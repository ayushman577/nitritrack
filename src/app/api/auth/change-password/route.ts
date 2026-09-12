import { NextResponse } from "next/server";
import { z } from "zod";

import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
    verifyPassword,
    hashPassword,
} from "@/lib/password";

const changePasswordSchema = z.object({
    currentPassword: z
        .string()
        .min(1, "Current password is required."),

    newPassword: z
        .string()
        .min(
            8,
            "New password must be at least 8 characters."
        )
        .max(72, "New password is too long."),
});

export async function POST(request: Request) {
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
            changePasswordSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                {
                    message:
                        result.error.issues[0]?.message ||
                        "Invalid password details.",
                },
                {
                    status: 400,
                }
            );
        }

        const {
            currentPassword,
            newPassword,
        } = result.data;

        const dbUser =
            await prisma.user.findUnique({
                where: {
                    id: user.id,
                },
                select: {
                    id: true,
                    passwordHash: true,
                },
            });

        if (!dbUser) {
            return NextResponse.json(
                {
                    message: "User not found.",
                },
                {
                    status: 404,
                }
            );
        }

        if (!dbUser.passwordHash) {
            return NextResponse.json(
                {
                    message:
                        "This account does not have a password. Please use the available login method.",
                },
                {
                    status: 400,
                }
            );
        }

        const passwordMatches =
            await verifyPassword(
                currentPassword,
                dbUser.passwordHash
            );

        if (!passwordMatches) {
            return NextResponse.json(
                {
                    message:
                        "Current password is incorrect.",
                },
                {
                    status: 400,
                }
            );
        }

        const newPasswordHash =
            await hashPassword(newPassword);

        await prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                passwordHash: newPasswordHash,
            },
        });

        return NextResponse.json({
            message:
                "Password changed successfully.",
        });

    } catch (error) {
        console.error(
            "CHANGE PASSWORD ERROR:",
            error
        );

        return NextResponse.json(
            {
                message:
                    "Failed to change password.",
            },
            {
                status: 500,
            }
        );
    }
}