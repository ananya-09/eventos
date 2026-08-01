import { prisma } from "@/lib/prisma";
import { canManageCommunityBranding } from "@/lib/community/permissions";
import {
  BRANDING_LIMITS,
  brandingAssetTypeSchema,
  type BrandingAssetType,
} from "@/server/validators/branding.validator";
import { uploadCommunityBrandingImage } from "./cloudinary.service";

export class CommunityBrandingService {
  static async assertCanManage(userId: string, communityId: string) {
    const allowed = await canManageCommunityBranding(userId, communityId);
    if (!allowed) {
      throw Object.assign(new Error("Forbidden: insufficient permissions to edit community branding"), {
        statusCode: 403,
      });
    }
  }

  static validateFile(file: File, assetType: BrandingAssetType) {
    const limits = BRANDING_LIMITS[assetType];

    if (!limits.allowedMime.includes(file.type as (typeof limits.allowedMime)[number])) {
      throw Object.assign(
        new Error(`Invalid file type. Allowed: ${limits.allowedMime.join(", ")}`),
        { statusCode: 400 }
      );
    }

    if (file.size > limits.maxBytes) {
      const maxMb = limits.maxBytes / (1024 * 1024);
      throw Object.assign(
        new Error(`File too large. Maximum size for ${assetType} is ${maxMb}MB`),
        { statusCode: 400 }
      );
    }
  }

  static async uploadAndPersist(params: {
    userId: string;
    slug: string;
    assetType: BrandingAssetType;
    file: File;
  }) {
    const { userId, slug, assetType, file } = params;

    const parsedType = brandingAssetTypeSchema.parse(assetType);

    const community = await prisma.community.findUnique({
      where: { slug },
      select: { id: true, slug: true, banner: true, image: true },
    });

    if (!community) {
      throw Object.assign(new Error("Community not found"), { statusCode: 404 });
    }

    await this.assertCanManage(userId, community.id);
    this.validateFile(file, parsedType);

    const buffer = Buffer.from(await file.arrayBuffer());
    const upload = await uploadCommunityBrandingImage({
      buffer,
      communitySlug: community.slug,
      assetType: parsedType,
    });

    const updateData =
      parsedType === "banner"
        ? { banner: upload.url }
        : { image: upload.url };

    const updated = await prisma.community.update({
      where: { id: community.id },
      data: updateData,
      select: {
        id: true,
        slug: true,
        banner: true,
        image: true,
      },
    });

    return {
      assetType: parsedType,
      url: upload.url,
      publicId: upload.publicId,
      community: updated,
    };
  }
}
