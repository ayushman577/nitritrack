import { NextResponse } from "next/server";

import { sendExpiryWarnings } from "@/lib/item-expiry-warning";

export async function GET(request: Request) {
    try {
        const authHeader =
            request.headers.get("authorization");

        if (
            authHeader !==
            `Bearer ${process.env.CRON_SECRET}`
        ) {
            return NextResponse.json(
                {
                    message: "Unauthorized",
                },
                {
                    status: 401,
                }
            );
        }

        const count =
            await sendExpiryWarnings();

        return NextResponse.json({
            message:
                "Expiry warnings processed successfully.",
            processed: count,
        });

    } catch (error) {
        console.error(
            "EXPIRY WARNING CRON ERROR:",
            error
        );

        return NextResponse.json(
            {
                message:
                    "Failed to process expiry warnings.",
            },
            {
                status: 500,
            }
        );
    }
}