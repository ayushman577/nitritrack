import { NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";

import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";


const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});


export async function POST(request: Request) {

    try {

        const body = await request.json();


        const result =
            loginSchema.safeParse(body);


        if (!result.success) {

            return NextResponse.json(
                {
                    message: "Invalid input"
                },
                {
                    status: 400
                }
            );

        }


        const email =
            result.data.email
                .trim()
                .toLowerCase();


        const password =
            result.data.password;



        // Find user
        const user =
            await prisma.user.findUnique({
                where: {
                    email
                }
            });



        if (!user) {

            return NextResponse.json(
                {
                    message:
                        "Invalid email or password"
                },
                {
                    status: 401
                }
            );

        }



        // Check email verification
        if (!user.emailVerifiedAt) {

            return NextResponse.json(
                {
                    message:
                        "Please verify your email first"
                },
                {
                    status: 403
                }
            );

        }



        // Check password
        const passwordMatch =
            await verifyPassword(
                password,
                user.passwordHash
            );


        if (!passwordMatch) {

            return NextResponse.json(
                {
                    message:
                        "Invalid email or password"
                },
                {
                    status: 401
                }
            );

        }



        // =====================================================
        // CREATE SESSION
        // =====================================================

        const sessionToken =
            crypto.randomBytes(32).toString("hex");


        // Session valid for 7 days
        const expiresAt =
            new Date(
                Date.now() +
                7 * 24 * 60 * 60 * 1000
            );


        await prisma.session.create({
            data: {
                token: sessionToken,
                userId: user.id,
                expiresAt,
            }
        });



        // =====================================================
        // RESPONSE
        // =====================================================

        const response =
            NextResponse.json({

                message:
                    "Login successful",

                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }

            });



        // =====================================================
        // HTTP-ONLY COOKIE
        // =====================================================

        response.cookies.set(
            "nitritrack_session",
            sessionToken,
            {
                httpOnly: true,

                secure:
                    process.env.NODE_ENV ===
                    "production",

                sameSite: "lax",

                expires: expiresAt,

                path: "/",
            }
        );


        return response;


    }
    catch (error) {

        console.error(
            "LOGIN ERROR:",
            error
        );


        return NextResponse.json(
            {
                message:
                    "Server error"
            },
            {
                status: 500
            }
        );

    }

}