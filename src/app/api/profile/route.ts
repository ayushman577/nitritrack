import { NextResponse } from "next/server";
import { z } from "zod";

import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const updateProfileSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Name must be at least 2 characters.")
        .max(50, "Name is too long."),

    phone: z
        .string()
        .trim()
        .max(20, "Phone number is too long.")
        .optional()
        .or(z.literal("")),
});

export async function PATCH(request: Request) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                {
                    message: "Unauthorized.",
                },
                {
                    status: 401,
                }
            );
        }

        const body = await request.json();

        const result =
            updateProfileSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                {
                    message:
                        result.error.issues[0]?.message ||
                        "Invalid profile details.",
                },
                {
                    status: 400,
                }
            );
        }

        const { name, phone } = result.data;

        const updatedUser =
            await prisma.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    name,
                    phone: phone || null,
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                },
            });

        return NextResponse.json({
            message: "Profile updated successfully.",
            user: updatedUser,
        });
    } catch (error) {
        console.error(
            "UPDATE PROFILE ERROR:",
            error
        );

        return NextResponse.json(
            {
                message:
                    "Failed to update profile.",
            },
            {
                status: 500,
            }
        );
    }
}