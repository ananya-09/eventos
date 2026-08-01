"use client";

import { useState } from "react";
import Image from "next/image";
import { Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { getCuratedCommunityBanner } from "@/lib/media";
import { useCommunityBrandingUpload } from "@/hooks/useCommunityBrandingUpload";
import { BRANDING_LIMITS } from "@/server/validators/branding.validator";

interface BrandingSettingsClientProps {
  slug: string;
  initialBanner: string | null;
  initialLogo: string | null;
}

export default function BrandingSettingsClient({
  slug,
  initialBanner,
  initialLogo,
}: BrandingSettingsClientProps) {
  const [bannerUrl, setBannerUrl] = useState(initialBanner);
  const [logoUrl, setLogoUrl] = useState(initialLogo);

  const { upload, cancel, progress, activeAsset, isUploading, error } =
    useCommunityBrandingUpload({
      communitySlug: slug,
      onSuccess: (type, url) => {
        if (type === "banner") setBannerUrl(url);
        else setLogoUrl(url);
        toast.success(type === "banner" ? "Banner saved" : "Logo saved");
      },
    });

  const pickAndUpload = async (type: "banner" | "logo") => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = BRANDING_LIMITS[type].allowedMime.join(",");
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        await upload(file, type);
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Upload failed";
        if (msg !== "Upload cancelled") toast.error(msg);
      }
    };
    input.click();
  };

  const displayBanner = bannerUrl || getCuratedCommunityBanner(slug);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="glass-surface-strong rounded-3xl border border-slate-200/70 overflow-hidden">
        <div className="relative h-40 sm:h-52 bg-slate-100">
          <Image
            src={displayBanner}
            alt="Community banner"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 800px"
          />
          {isUploading && activeAsset === "banner" && (
            <div className="absolute inset-0 bg-slate-900/60 flex flex-col items-center justify-center gap-2 px-8">
              <Loader2 className="w-6 h-6 text-white animate-spin" />
              <Progress value={progress} className="w-full max-w-xs h-2" />
              <button
                type="button"
                onClick={cancel}
                className="text-xs text-white/90 underline"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
        <div className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="font-bold text-slate-900 text-sm">Banner image</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              JPG, PNG, WebP, or GIF · max 5MB · recommended 1920×640
            </p>
          </div>
          <button
            type="button"
            disabled={isUploading}
            onClick={() => pickAndUpload("banner")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#34629f] text-white text-xs font-bold disabled:opacity-60"
          >
            <Upload className="w-4 h-4" />
            Upload banner
          </button>
        </div>
        {error && activeAsset === "banner" && (
          <p className="px-5 pb-4 text-xs text-rose-500 font-semibold">{error}</p>
        )}
      </div>

      {/* Logo */}
      <div className="glass-surface-strong rounded-3xl border border-slate-200/70 p-5">
        <div className="flex flex-col sm:flex-row gap-5 sm:items-center">
          <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
            {logoUrl ? (
              <Image src={logoUrl} alt="Logo" fill className="object-cover" sizes="96px" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#34629f] to-[#2e68a8] flex items-center justify-center text-white font-bold text-2xl">
                ?
              </div>
            )}
            {isUploading && activeAsset === "logo" && (
              <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center">
                <Loader2 className="w-5 h-5 text-white animate-spin" />
              </div>
            )}
          </div>
          <div className="flex-1 space-y-3">
            <div>
              <h2 className="font-bold text-slate-900 text-sm">Community logo</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Square image · max 2MB · displayed as avatar across Eventos
              </p>
            </div>
            <button
              type="button"
              disabled={isUploading}
              onClick={() => pickAndUpload("logo")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#34629f] text-white text-xs font-bold disabled:opacity-60"
            >
              <Upload className="w-4 h-4" />
              Upload logo
            </button>
            {error && activeAsset === "logo" && (
              <p className="text-xs text-rose-500 font-semibold">{error}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
