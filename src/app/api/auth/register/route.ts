import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import {
  generateOTP,
  hashOTP,
} from "@/lib/otp";

import {
  hashPassword,
} from "@/lib/password";

import {
  sendOTPEmail,
} from "@/lib/email";


const registerSchema = z.object({
  name: z.string().min(2),
  email: z
  .string()
  .trim()
  .email()
  .refine(
    (email) =>
      email.toLowerCase().endsWith("@nitrkl.ac.in"),
    {
      message:
        "Only NIT Rourkela email addresses (@nitrkl.ac.in) are allowed.",
    }
  ),
  password: z.string().min(8),
  phone: z.string().optional(),
});


export async function POST(
  request: Request
) {

  try {

    const body = await request.json();


    const result =
      registerSchema.safeParse(body);


    if (!result.success) {
      return NextResponse.json(
        {
          message:"Invalid data"
        },
        {
          status:400
        }
      );
    }


    const {
      name,
      password,
      phone
    } = result.data;

    const email = result.data.email.trim().toLowerCase();


    const existingUser =
      await prisma.user.findUnique({
        where:{
          email
        }
      });


    if(existingUser) {
      return NextResponse.json(
        {
          message:
          "Account already exists"
        },
        {
          status:409
        }
      );
    }


    const passwordHash =
      await hashPassword(password);


    const otp =
      generateOTP();


    await prisma.otp.create({
  data:{
    email,

    codeHash:
      hashOTP(otp),

    purpose:
      "REGISTER",

    name,

    phone,

    passwordHash,

    expiresAt:
      new Date(
        Date.now()
        +
        10 * 60 * 1000
      ),
  }
});


    await sendOTPEmail(
      email,
      otp
    );


    return NextResponse.json({
      message:
      "OTP sent successfully",

      email
    });


  }
  catch(error){

    console.error(error);

    return NextResponse.json(
      {
        message:
        "Something went wrong"
      },
      {
        status:500
      }
    );
  }
}