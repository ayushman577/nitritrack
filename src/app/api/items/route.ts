import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { supabase } from "@/lib/supabase";


const createItemSchema = z.object({
    type: z.enum(["LOST", "FOUND"]),

    category: z.enum([
        "ID_CARD",
        "MONEY",
        "WALLET",
        "PHONE",
        "LAPTOP",
        "EARPHONES",
        "WATCH",
        "KEYS",
        "BAG",
        "BOOKS",
        "CLOTHING",
        "DOCUMENTS",
        "ACCESSORIES",
        "ELECTRONICS",
        "OTHER",
    ]),

    title: z
        .string()
        .trim()
        .min(2, "Title is required")
        .max(100),

    description: z
        .string()
        .trim()
        .max(1000)
        .optional(),

    location: z
        .string()
        .trim()
        .min(2, "Location is required")
        .max(200),

    itemDate: z.string().datetime(),
});


export async function POST(
    request: Request
) {

    try {

        // =========================================
        // AUTHENTICATION
        // =========================================

        const user =
            await getCurrentUser();


        if (!user) {

            return NextResponse.json(
                {
                    message:
                        "You must be logged in to create a report.",
                },
                {
                    status: 401,
                }
            );

        }


        // =========================================
        // READ FORMDATA
        // =========================================

        const formData =
            await request.formData();


        const type =
            formData.get("type");

        const category =
            formData.get("category");

        const title =
            formData.get("title");

        const description =
            formData.get("description");

        const location =
            formData.get("location");

        const itemDate =
            formData.get("itemDate");

        const image =
            formData.get("image");


        // =========================================
        // VALIDATE TEXT DATA
        // =========================================

        const result =
            createItemSchema.safeParse({

                type,

                category,

                title,

                description:
                    description || undefined,

                location,

                itemDate,

            });


        if (!result.success) {

            return NextResponse.json(
                {
                    message:
                        "Invalid report data.",

                    errors:
                        result.error.flatten(),
                },
                {
                    status: 400,
                }
            );

        }


        // =========================================
        // VALIDATE IMAGE
        // =========================================

        let imageUrl:
            string | null = null;


        if (image instanceof File) {

            // Maximum 5 MB

            if (
                image.size >
                5 * 1024 * 1024
            ) {

                return NextResponse.json(
                    {
                        message:
                            "Image size must be less than 5 MB.",
                    },
                    {
                        status: 400,
                    }
                );

            }


            // Allowed image types

            const allowedTypes = [
                "image/jpeg",
                "image/png",
                "image/webp",
            ];


            if (
                !allowedTypes.includes(
                    image.type
                )
            ) {

                return NextResponse.json(
                    {
                        message:
                            "Only JPG, PNG and WEBP images are allowed.",
                    },
                    {
                        status: 400,
                    }
                );

            }


            // =====================================
            // CREATE UNIQUE FILE NAME
            // =====================================

            const fileExtension =
                image.name
                    .split(".")
                    .pop()
                    ?.toLowerCase() || "jpg";


            const fileName =
                `${user.id}/${crypto.randomUUID()}.${fileExtension}`;


            // =====================================
            // CONVERT FILE TO BUFFER
            // =====================================

            const arrayBuffer =
                await image.arrayBuffer();


            const buffer =
                Buffer.from(arrayBuffer);


            // =====================================
            // UPLOAD TO SUPABASE STORAGE
            // =====================================

            const {
                error: uploadError,
            } = await supabase.storage
                .from("item-images")
                .upload(
                    fileName,
                    buffer,
                    {
                        contentType:
                            image.type,

                        upsert: false,
                    }
                );


            if (uploadError) {

                console.error(
                    "SUPABASE IMAGE UPLOAD ERROR:",
                    uploadError
                );


                return NextResponse.json(
                    {
                        message:
                            "Failed to upload image.",
                    },
                    {
                        status: 500,
                    }
                );

            }


            // =====================================
            // GET PUBLIC IMAGE URL
            // =====================================

            const {
                data: publicUrlData,
            } =
                supabase.storage
                    .from("item-images")
                    .getPublicUrl(
                        fileName
                    );


            imageUrl =
                publicUrlData.publicUrl;

        }


        // =========================================
        // CREATE ITEM IN DATABASE
        // =========================================

        const createdAt =
            new Date();


        const expiresAt =
            new Date(
                createdAt.getTime() +
                7 * 24 * 60 * 60 * 1000
            );


        const item =
            await prisma.item.create({

                data: {

                    ownerId:
                        user.id,

                    type:
                        result.data.type,

                    category:
                        result.data.category,

                    title:
                        result.data.title,

                    description:
                        result.data.description ||
                        null,

                    location:
                        result.data.location,

                    itemDate:
                        new Date(
                            result.data.itemDate
                        ),

                    imageUrl,

                    status:
                        "ACTIVE",

                    createdAt,

                    expiresAt,

                },

            });


        // =========================================
        // SUCCESS
        // =========================================

        return NextResponse.json(

            {
                message:
                    "Report created successfully.",

                item: {

                    id:
                        item.id,

                    type:
                        item.type,

                    category:
                        item.category,

                    title:
                        item.title,

                    description:
                        item.description,

                    location:
                        item.location,

                    itemDate:
                        item.itemDate,

                    imageUrl:
                        item.imageUrl,

                    status:
                        item.status,

                    createdAt:
                        item.createdAt,

                    expiresAt:
                        item.expiresAt,

                },

            },

            {
                status: 201,
            }

        );


    }
    catch (error) {

        console.error(
            "CREATE ITEM ERROR:",
            error
        );


        return NextResponse.json(

            {
                message:
                    "Something went wrong while creating the report.",
            },

            {
                status: 500,
            }

        );

    }

}