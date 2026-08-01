import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CommunityBrandingService } from "@/server/services/community-branding.service";
import { brandingAssetTypeSchema } from "@/server/validators/branding.validator";

export const runtime = "nodejs";

export async function POST(
  req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file");
    const assetTypeRaw = formData.get("assetType");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, message: "No file provided" },
        { status: 400 }
      );
    }

    const assetType = brandingAssetTypeSchema.safeParse(assetTypeRaw);
    if (!assetType.success) {
      return NextResponse.json(
        { success: false, message: "assetType must be 'banner' or 'logo'" },
        { status: 400 }
      );
    }

    const result = await CommunityBrandingService.uploadAndPersist({
      userId: user.id,
      slug,
      assetType: assetType.data,
      file,
    });

    return NextResponse.json({
      success: true,
      message: `${assetType.data === "banner" ? "Banner" : "Logo"} updated successfully`,
      assetType: result.assetType,
      url: result.url,
      banner: result.community.banner,
      logo: result.community.image,
    });
  } catch (error: unknown) {
    console.error("BRANDING UPLOAD ERROR:", error);

    const err = error as Error & { statusCode?: number };
    const status = err.statusCode ?? 500;

    return NextResponse.json(
      {
        success: false,
        message: err.message || "Upload failed",
      },
      { status }
    );
  }
}
