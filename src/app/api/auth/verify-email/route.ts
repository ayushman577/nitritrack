import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashOTP } from "@/lib/otp";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email = body.email?.trim().toLowerCase();
    const otp = body.otp?.trim();

    if (!email || !otp) {
      return NextResponse.json(
        {
          message: "Email and OTP are required",
        },
        {
          status: 400,
        }
      );
    }

    const otpRecord = await prisma.otp.findFirst({
      where: {
        email,
        purpose: "REGISTER",
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!otpRecord) {
      return NextResponse.json(
        {
          message: "OTP not found. Please request a new OTP.",
        },
        {
          status: 400,
        }
      );
    }

    if (otpRecord.expiresAt < new Date()) {
      await prisma.otp.delete({
        where: {
          id: otpRecord.id,
        },
      });

      return NextResponse.json(
        {
          message: "OTP has expired. Please request a new OTP.",
        },
        {
          status: 400,
        }
      );
    }

    const hashedInputOTP = hashOTP(otp);

    if (hashedInputOTP !== otpRecord.codeHash) {
      return NextResponse.json(
        {
          message: "Invalid OTP",
        },
        {
          status: 400,
        }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      await prisma.otp.delete({
        where: {
          id: otpRecord.id,
        },
      });

      return NextResponse.json(
        {
          message: "An account with this email already exists",
        },
        {
          status: 409,
        }
      );
    }

    if (!otpRecord.passwordHash) {
      return NextResponse.json(
        {
          message: "Registration data is incomplete",
        },
        {
          status: 400,
        }
      );
    }

    const user = await prisma.user.create({
      data: {
        name: otpRecord.name ?? "NITR User",
        email: otpRecord.email,
        phone: otpRecord.phone,
        passwordHash: otpRecord.passwordHash,
        emailVerifiedAt: new Date(),
      },
    });

    await prisma.otp.delete({
      where: {
        id: otpRecord.id,
      },
    });

    return NextResponse.json(
      {
        message: "Email verified successfully",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("VERIFY EMAIL ERROR:", error);

    return NextResponse.json(
      {
        message: "Server error while verifying email",
      },
      {
        status: 500,
      }
    );
  }
}