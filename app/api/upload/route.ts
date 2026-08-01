import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uploadCommunityBrandingImage } from "@/server/services/cloudinary.service";
import { CommunityBrandingService } from "@/server/services/community-branding.service";
import { brandingAssetTypeSchema } from "@/server/validators/branding.validator";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    // 1. Get authenticated session
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2. Find logged-in user in database to ensure they are valid
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

    // 3. Parse request body form data
    const formData = await req.formData();
    const file = formData.get("file");
    const assetTypeRaw = formData.get("assetType");
    const proposedSlugRaw = formData.get("slug");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, message: "No file provided" },
        { status: 400 }
      );
    }

    // 4. Validate assetType
    const assetType = brandingAssetTypeSchema.safeParse(assetTypeRaw);
    if (!assetType.success) {
      return NextResponse.json(
        { success: false, message: "assetType must be 'banner' or 'logo'" },
        { status: 400 }
      );
    }

    // 5. Validate file size and MIME type
    try {
      CommunityBrandingService.validateFile(file, assetType.data);
    } catch (valError: any) {
      return NextResponse.json(
        { success: false, message: valError.message || "File validation failed" },
        { status: 400 }
      );
    }

    // 6. Perform upload
    const slug = (typeof proposedSlugRaw === "string" && proposedSlugRaw.trim()) 
      ? proposedSlugRaw.trim().toLowerCase() 
      : "temp-brand";
      
    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadResult = await uploadCommunityBrandingImage({
      buffer,
      communitySlug: slug,
      assetType: assetType.data,
    });

    return NextResponse.json({
      success: true,
      message: `${assetType.data === "banner" ? "Banner" : "Logo"} uploaded successfully`,
      url: uploadResult.url,
      assetType: assetType.data,
    });
  } catch (error: any) {
    console.error("[PRE_CREATION_UPLOAD_ERROR]", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Internal server error during upload",
      },
      { status: 500 }
    );
  }
}
