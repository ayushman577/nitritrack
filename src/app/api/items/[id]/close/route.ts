import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

type CloseItemRouteProps = {
    params: Promise<{
        id: string;
    }>;
};

export async function PATCH(
    request: Request,
    { params }: CloseItemRouteProps
) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                {
                    message: "You must be logged in.",
                },
                {
                    status: 401,
                }
            );
        }

        const { id } = await params;

        const item =
            await prisma.item.findUnique({
                where: {
                    id,
                },
            });

        if (!item) {
            return NextResponse.json(
                {
                    message: "Report not found.",
                },
                {
                    status: 404,
                }
            );
        }

        // Only the person who created the report
        // can close it.
        if (item.ownerId !== user.id) {
            return NextResponse.json(
                {
                    message:
                        "You can only close your own reports.",
                },
                {
                    status: 403,
                }
            );
        }

        if (item.status !== "ACTIVE") {
            return NextResponse.json(
                {
                    message:
                        "Only active reports can be closed.",
                },
                {
                    status: 400,
                }
            );
        }

        const updatedItem =
            await prisma.item.update({
                where: {
                    id,
                },
                data: {
                    status: "CLOSED",
                    closedAt: new Date(),
                },
            });

        return NextResponse.json({
            message:
                "Report closed successfully.",
            item: {
                id: updatedItem.id,
                status: updatedItem.status,
                closedAt: updatedItem.closedAt,
            },
        });

    } catch (error) {
        console.error(
            "CLOSE ITEM ERROR:",
            error
        );

        return NextResponse.json(
            {
                message:
                    "Something went wrong while closing the report.",
            },
            {
                status: 500,
            }
        );
    }
}