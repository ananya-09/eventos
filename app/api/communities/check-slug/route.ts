import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    // 1. Get authenticated session
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2. Parse query parameters
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug")?.trim().toLowerCase();

    if (!slug) {
      return NextResponse.json(
        { success: false, message: "Slug query parameter is required" },
        { status: 400 }
      );
    }

    // 3. Simple regex check matching createCommunitySchema
    const slugRegex = /^[a-z0-9-]+$/;
    if (!slugRegex.test(slug)) {
      return NextResponse.json(
        { 
          success: true, 
          available: false, 
          message: "Slug can only contain lowercase letters, numbers, and hyphens" 
        }
      );
    }

    if (slug.length < 3 || slug.length > 50) {
      return NextResponse.json(
        { 
          success: true, 
          available: false, 
          message: "Slug must be between 3 and 50 characters" 
        }
      );
    }

    // 4. Query DB
    const existingCommunity = await prisma.community.findUnique({
      where: { slug },
      select: { id: true },
    });

    return NextResponse.json({
      success: true,
      available: !existingCommunity,
      message: existingCommunity ? "Slug is already taken" : "Slug is available",
    });
  } catch (error: any) {
    console.error("[CHECK_SLUG_ERROR]", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
