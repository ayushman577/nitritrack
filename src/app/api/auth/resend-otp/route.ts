import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateOTP, hashOTP } from "@/lib/otp";
import { sendOTPEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email = body.email?.trim().toLowerCase();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    // Find the latest registration OTP
    const previousOtp = await prisma.otp.findFirst({
      where: {
        email,
        purpose: "REGISTER",
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // No pending registration
    if (!previousOtp) {
      return NextResponse.json(
        {
          message:
            "Registration session not found. Please register again.",
        },
        { status: 400 }
      );
    }

    // Server-side 30 second protection
    const secondsSinceLastOtp =
      (Date.now() - previousOtp.createdAt.getTime()) / 1000;

    if (secondsSinceLastOtp < 30) {
      const remainingSeconds = Math.ceil(
        30 - secondsSinceLastOtp
      );

      return NextResponse.json(
        {
          message: `Please wait ${remainingSeconds} seconds before requesting another OTP.`,
        },
        { status: 429 }
      );
    }

    // Generate new OTP
    const otp = generateOTP();

    // Send the new email first.
    // This prevents us from deleting the existing OTP
    // if Brevo happens to fail.
    await sendOTPEmail(email, otp);

    // Remove previous registration OTPs
    await prisma.otp.deleteMany({
      where: {
        email,
        purpose: "REGISTER",
      },
    });

    // Create new OTP while preserving registration data
    await prisma.otp.create({
      data: {
        email,
        codeHash: hashOTP(otp),
        purpose: "REGISTER",

        name: previousOtp.name,
        phone: previousOtp.phone,
        passwordHash: previousOtp.passwordHash,

        expiresAt: new Date(
          Date.now() + 10 * 60 * 1000
        ),
      },
    });

    return NextResponse.json({
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("RESEND OTP ERROR:", error);

    return NextResponse.json(
      {
        message: "Failed to resend OTP",
      },
      { status: 500 }
    );
  }
}