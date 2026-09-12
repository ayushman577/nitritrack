import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashOTP } from "@/lib/otp";
import { hashPassword } from "@/lib/password";

const resetPasswordSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
  password: z.string().min(8),
});

export async function POST(request: Request) {
  try {
    // -----------------------------
    // READ REQUEST
    // -----------------------------

    const body = await request.json();

    const result =
      resetPasswordSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          message:
            "Invalid email, OTP, or password.",
        },
        { status: 400 }
      );
    }

    const email =
      result.data.email
        .trim()
        .toLowerCase();

    const otp = result.data.otp;

    const password =
      result.data.password;

    // -----------------------------
    // FIND LATEST OTP
    // -----------------------------

    const otpRecord =
      await prisma.otp.findFirst({
        where: {
          email,
          purpose: "RESET_PASSWORD",
        },
        orderBy: {
          createdAt: "desc",
        },
      });

    if (!otpRecord) {
      return NextResponse.json(
        {
          message:
            "OTP not found. Please request a new OTP.",
        },
        { status: 400 }
      );
    }

    // -----------------------------
    // CHECK EXPIRY
    // -----------------------------

    if (
      otpRecord.expiresAt.getTime() <
      Date.now()
    ) {
      await prisma.otp.delete({
        where: {
          id: otpRecord.id,
        },
      });

      return NextResponse.json(
        {
          message:
            "OTP has expired. Please request a new OTP.",
        },
        { status: 400 }
      );
    }

    // -----------------------------
    // VERIFY OTP
    // -----------------------------

    const hashedInputOTP =
      hashOTP(otp);

    if (
      hashedInputOTP !==
      otpRecord.codeHash
    ) {
      return NextResponse.json(
        {
          message: "Invalid OTP.",
        },
        { status: 400 }
      );
    }

    // -----------------------------
    // FIND USER
    // -----------------------------

    const user =
      await prisma.user.findUnique({
        where: {
          email,
        },
      });

    if (!user) {
      return NextResponse.json(
        {
          message:
            "Unable to reset password.",
        },
        { status: 400 }
      );
    }

    // -----------------------------
    // HASH NEW PASSWORD
    // -----------------------------

    const passwordHash =
      await hashPassword(password);

    // -----------------------------
    // UPDATE PASSWORD
    // -----------------------------

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        passwordHash,
      },
    });

    // -----------------------------
    // DELETE USED OTP
    // -----------------------------

    await prisma.otp.delete({
      where: {
        id: otpRecord.id,
      },
    });

    // -----------------------------
    // SUCCESS
    // -----------------------------

    return NextResponse.json({
      message:
        "Password updated successfully.",
    });

  } catch (error) {

    console.error(
      "RESET PASSWORD ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Something went wrong while resetting your password.",
      },
      { status: 500 }
    );
  }
}