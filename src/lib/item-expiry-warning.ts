import { prisma } from "@/lib/prisma";
import { sendExpiryWarningEmail } from "@/lib/email";

export async function sendExpiryWarnings() {
    const now = new Date();

    const tomorrow = new Date(
        now.getTime() +
        24 * 60 * 60 * 1000
    );

    const items =
        await prisma.item.findMany({
            where: {
                status: "ACTIVE",

                expiresAt: {
                    gt: now,
                    lte: tomorrow,
                },

                // Only send the warning once
                warningSentAt: null,
            },

            include: {
                owner: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
        });

    for (const item of items) {
        try {
            // Send the warning email
            await sendExpiryWarningEmail({
                email: item.owner.email,
                name: item.owner.name,
                title: item.title,
                type: item.type,
                expiresAt: item.expiresAt,
            });

            // Mark the warning as sent only after
            // the email was successfully sent.
            await prisma.item.update({
                where: {
                    id: item.id,
                },
                data: {
                    warningSentAt: new Date(),
                },
            });

            console.log(
                `Expiry warning sent for item ${item.id}`
            );

        } catch (error) {
            console.error(
                `Failed to send expiry warning for ${item.id}:`,
                error
            );
        }
    }

    return items.length;
}