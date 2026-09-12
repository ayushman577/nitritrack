import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  generateOTP,
  hashOTP,
} from "@/lib/otp";
import { sendOTPEmail } from "@/lib/email";

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export async function POST(request: Request) {
  try {
    // -----------------------------
    // READ REQUEST
    // -----------------------------

    const body = await request.json();

    const result =
      forgotPasswordSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          message: "Please enter a valid email.",
        },
        { status: 400 }
      );
    }

    const email =
      result.data.email
        .trim()
        .toLowerCase();

    // -----------------------------
    // FIND USER
    // -----------------------------

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    /*
      We intentionally do not reveal
      whether an account exists.
    */

    if (!user) {
      return NextResponse.json({
        message:
          "If this email is registered, an OTP has been sent.",
      });
    }

    // -----------------------------
    // CHECK LAST OTP
    // -----------------------------

    const previousOtp =
      await prisma.otp.findFirst({
        where: {
          email,
          purpose: "RESET_PASSWORD",
        },
        orderBy: {
          createdAt: "desc",
        },
      });

    // -----------------------------
    // 30 SECOND SERVER PROTECTION
    // -----------------------------

    if (previousOtp) {
      const secondsSinceLastOtp =
        (Date.now() -
          previousOtp.createdAt.getTime()) /
        1000;

      if (secondsSinceLastOtp < 30) {
        const remainingSeconds =
          Math.ceil(
            30 - secondsSinceLastOtp
          );

        return NextResponse.json(
          {
            message: `Please wait ${remainingSeconds} seconds before requesting another OTP.`,
          },
          { status: 429 }
        );
      }
    }

    // -----------------------------
    // GENERATE OTP
    // -----------------------------

    const otp = generateOTP();

    const codeHash = hashOTP(otp);

    const expiresAt = new Date(
      Date.now() + 10 * 60 * 1000
    );

    // -----------------------------
    // SEND EMAIL FIRST
    // -----------------------------

    await sendOTPEmail(
      email,
      otp
    );

    // -----------------------------
    // DELETE OLD RESET OTPs
    // -----------------------------

    await prisma.otp.deleteMany({
      where: {
        email,
        purpose: "RESET_PASSWORD",
      },
    });

    // -----------------------------
    // CREATE NEW OTP
    // -----------------------------

    await prisma.otp.create({
      data: {
        email,
        codeHash,
        purpose: "RESET_PASSWORD",
        expiresAt,
      },
    });

    // -----------------------------
    // RESPONSE
    // -----------------------------

    return NextResponse.json({
      message:
        "OTP sent successfully.",
      email,
    });

  } catch (error) {

    console.error(
      "FORGOT PASSWORD ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}