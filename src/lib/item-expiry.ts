import { prisma } from "@/lib/prisma";

export async function expireOldItems() {
    const now = new Date();

    try {
        const result = await prisma.item.updateMany({
            where: {
                status: "ACTIVE",
                expiresAt: {
                    lt: now,
                },
            },
            data: {
                status: "EXPIRED",
            },
        });

        if (result.count > 0) {
            console.log(
                `NITRiTrack: expired ${result.count} item(s).`
            );
        }

        return result.count;
    } catch (error) {
        console.error(
            "EXPIRE OLD ITEMS ERROR:",
            error
        );

        return 0;
    }
}