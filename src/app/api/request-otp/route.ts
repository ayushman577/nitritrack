import { createHash } from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { sendOTPEmail } from "@/lib/email";

const requestOtpSchema = z.object({
  email: z.string().trim().email(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const parsed = requestOtpSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Please provide a valid email address.",
        },
        {
          status: 400,
        }
      );
    }

    const email = parsed.data.email.toLowerCase();

    // Only NIT Rourkela email addresses are allowed.
    if (!email.endsWith("@nitrkl.ac.in")) {
      return NextResponse.json(
        {
          message:
            "Only NIT Rourkela email addresses (@nitrkl.ac.in) are allowed.",
        },
        {
          status: 400,
        }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          message:
            "No account found with this NIT Rourkela email address.",
        },
        {
          status: 404,
        }
      );
    }

    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const expiresAt = new Date(
      Date.now() + 10 * 60 * 1000
    );

    // Remove previous OTPs for this email.
    await prisma.otp.deleteMany({
      where: {
        email,
      },
    });

    // Store only a hash of the OTP in the database.
    const codeHash = createHash("sha256")
      .update(otp)
      .digest("hex");

    await prisma.otp.create({
      data: {
        email,
        codeHash,
        purpose: "RESET_PASSWORD",
        expiresAt,
        userId: user.id,
      },
    });

    // Send the actual OTP to the user's email.
    await sendOTPEmail(email, otp);

    return NextResponse.json({
      message: "OTP sent successfully.",
    });
  } catch (error) {
    console.error(
      "REQUEST OTP ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Failed to send OTP. Please try again.",
      },
      {
        status: 500,
      }
    );
  }
}
