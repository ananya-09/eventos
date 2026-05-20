import { z } from "zod";

export const brandingAssetTypeSchema = z.enum(["banner", "logo"]);

export type BrandingAssetType = z.infer<typeof brandingAssetTypeSchema>;

export const BRANDING_LIMITS = {
  banner: {
    maxBytes: 5 * 1024 * 1024,
    maxWidth: 2400,
    maxHeight: 1200,
    allowedMime: ["image/jpeg", "image/png", "image/webp", "image/gif"] as const,
  },
  logo: {
    maxBytes: 2 * 1024 * 1024,
    maxWidth: 1024,
    maxHeight: 1024,
    allowedMime: ["image/jpeg", "image/png", "image/webp", "image/gif"] as const,
  },
} as const;
