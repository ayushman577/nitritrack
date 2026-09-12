import { cookies } from "next/headers";

import { prisma } from "@/lib/prisma";


const SESSION_COOKIE_NAME =
    "nitritrack_session";


export async function getCurrentUser() {

    const cookieStore =
        await cookies();


    const sessionToken =
        cookieStore.get(
            SESSION_COOKIE_NAME
        )?.value;


    // No session cookie
    if (!sessionToken) {
        return null;
    }


    const session =
        await prisma.session.findUnique({
            where: {
                token: sessionToken,
            },

            include: {
                user: true,
            },
        });


    // Session doesn't exist
    if (!session) {
        return null;
    }


    // Session expired
    if (
        session.expiresAt.getTime() <
        Date.now()
    ) {

        await prisma.session.delete({
            where: {
                id: session.id,
            },
        });

        return null;
    }


    return session.user;
}