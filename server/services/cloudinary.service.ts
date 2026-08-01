import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";
import type { BrandingAssetType } from "@/server/validators/branding.validator";

function ensureConfigured() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET."
    );
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
}

export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
  width: number;
  height: number;
  bytes: number;
}

export async function uploadCommunityBrandingImage(params: {
  buffer: Buffer;
  communitySlug: string;
  assetType: BrandingAssetType;
}): Promise<CloudinaryUploadResult> {
  ensureConfigured();

  const { buffer, communitySlug, assetType } = params;
  const folder = `eventos/communities/${communitySlug}`;
  const publicId = assetType === "banner" ? "banner" : "logo";

  const transformation =
    assetType === "banner"
      ? [
          { width: 1920, height: 640, crop: "limit", quality: "auto", fetch_format: "auto" },
        ]
      : [
          { width: 512, height: 512, crop: "fill", gravity: "auto", quality: "auto", fetch_format: "auto" },
        ];

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: publicId,
        resource_type: "image",
        overwrite: true,
        invalidate: true,
        transformation,
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary upload failed"));
          return;
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
          bytes: result.bytes,
        });
      }
    );

    Readable.from(buffer).pipe(uploadStream);
  });
}

export async function deleteCommunityBrandingImage(publicId: string): Promise<void> {
  ensureConfigured();
  await cloudinary.uploader.destroy(publicId, { invalidate: true });
}
