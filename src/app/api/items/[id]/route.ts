import { NextResponse } from "next/server";
import { z } from "zod";

import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const updateItemSchema = z.object({
  type: z.enum(["LOST", "FOUND"]),

  category: z.enum([
    "ID_CARD",
    "MONEY",
    "WALLET",
    "PHONE",
    "LAPTOP",
    "EARPHONES",
    "WATCH",
    "KEYS",
    "BAG",
    "BOOKS",
    "CLOTHING",
    "DOCUMENTS",
    "ACCESSORIES",
    "ELECTRONICS",
    "OTHER",
  ]),

  title: z
    .string()
    .trim()
    .min(2, "Title must be at least 2 characters.")
    .max(100, "Title is too long."),

  description: z
    .string()
    .trim()
    .min(5, "Description must be at least 5 characters.")
    .max(2000, "Description is too long."),

  location: z
    .string()
    .trim()
    .min(2, "Location is required.")
    .max(150, "Location is too long."),

  itemDate: z.string().min(1, "Item date is required."),
});

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(
  request: Request,
  { params }: RouteContext
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          message: "Unauthorized.",
        },
        {
          status: 401,
        }
      );
    }

    const { id } = await params;

    const item = await prisma.item.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        ownerId: true,
        status: true,
      },
    });

    if (!item) {
      return NextResponse.json(
        {
          message: "Report not found.",
        },
        {
          status: 404,
        }
      );
    }

    // Only the owner can edit the report.
    if (item.ownerId !== user.id) {
      return NextResponse.json(
        {
          message:
            "You are not allowed to edit this report.",
        },
        {
          status: 403,
        }
      );
    }

    // Closed and expired reports cannot be edited.
    if (item.status !== "ACTIVE") {
      return NextResponse.json(
        {
          message:
            "Only active reports can be edited.",
        },
        {
          status: 400,
        }
      );
    }

    const body = await request.json();

    const result = updateItemSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          message:
            result.error.issues[0]?.message ||
            "Invalid report details.",
        },
        {
          status: 400,
        }
      );
    }

    const {
      type,
      category,
      title,
      description,
      location,
      itemDate,
    } = result.data;

    const parsedItemDate = new Date(
      `${itemDate}T00:00:00`
    );

    if (Number.isNaN(parsedItemDate.getTime())) {
      return NextResponse.json(
        {
          message: "Invalid item date.",
        },
        {
          status: 400,
        }
      );
    }

    const updatedItem = await prisma.item.update({
      where: {
        id,
      },
      data: {
        type,
        category,
        title,
        description,
        location,
        itemDate: parsedItemDate,
      },
      select: {
        id: true,
        type: true,
        category: true,
        title: true,
        description: true,
        location: true,
        itemDate: true,
        imageUrl: true,
        status: true,
        expiresAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      message: "Report updated successfully.",
      item: updatedItem,
    });
  } catch (error) {
    console.error("UPDATE ITEM ERROR:", error);

    return NextResponse.json(
      {
        message: "Failed to update report.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: RouteContext
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          message: "Unauthorized.",
        },
        {
          status: 401,
        }
      );
    }

    const { id } = await params;

    const item = await prisma.item.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        ownerId: true,
      },
    });

    if (!item) {
      return NextResponse.json(
        {
          message: "Report not found.",
        },
        {
          status: 404,
        }
      );
    }

    // Only the owner can delete the report.
    if (item.ownerId !== user.id) {
      return NextResponse.json(
        {
          message:
            "You are not allowed to delete this report.",
        },
        {
          status: 403,
        }
      );
    }

    await prisma.item.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      message: "Report deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE ITEM ERROR:", error);

    return NextResponse.json(
      {
        message: "Failed to delete report.",
      },
      {
        status: 500,
      }
    );
  }
}