"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { Loader2, X, ImageIcon, Camera } from "lucide-react";
import { toast } from "sonner";
import PremiumImage from "@/components/ui/PremiumImage";
import { Progress } from "@/components/ui/progress";
import { getCuratedCommunityBanner, SHARED_OVERLAYS } from "@/lib/media";
import { useCommunityBrandingUpload } from "@/hooks/useCommunityBrandingUpload";
import { BRANDING_LIMITS } from "@/server/validators/branding.validator";
import type { BrandingAssetType } from "@/server/validators/branding.validator";

interface CommunityHeroBrandingProps {
  slug: string;
  name: string;
  initialBanner: string | null;
  initialLogo: string | null;
  canManageBranding: boolean;
  infoSection: React.ReactNode;
  actionsSection: React.ReactNode;
}

function UploadProgressBar({
  progress,
  onCancel,
}: {
  progress: number;
  onCancel: () => void;
}) {
  return (
    <div className="w-full max-w-xs px-6 space-y-2">
      <div className="flex items-center justify-between text-white text-xs font-bold">
        <span className="flex items-center gap-1.5">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          Uploading…
        </span>
        <button
          type="button"
          onClick={onCancel}
          className="p-1 rounded-md hover:bg-white/20"
          aria-label="Cancel upload"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
      <Progress value={progress} className="h-1.5 bg-white/20" />
      <span className="text-[10px] text-white/80 font-semibold">{progress}%</span>
    </div>
  );
}

export default function CommunityHeroBranding({
  slug,
  name,
  initialBanner,
  initialLogo,
  canManageBranding,
  infoSection,
  actionsSection,
}: CommunityHeroBrandingProps) {
  const [bannerUrl, setBannerUrl] = useState<string | null>(initialBanner);
  const [logoUrl, setLogoUrl] = useState<string | null>(initialLogo);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const bannerInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const { upload, cancel, progress, state, error, activeAsset, isUploading } =
    useCommunityBrandingUpload({
      communitySlug: slug,
      onSuccess: (assetType, url) => {
        if (assetType === "banner") {
          setBannerUrl(url);
          toast.success("Banner updated");
        } else {
          setLogoUrl(url);
          setLogoPreview(null);
          toast.success("Community logo updated");
        }
      },
    });

  const handleFileSelect = useCallback(
    async (assetType: BrandingAssetType, file: File | undefined) => {
      if (!file) return;
      if (assetType === "logo") setLogoPreview(URL.createObjectURL(file));
      try {
        await upload(file, assetType);
      } catch (err) {
        if (assetType === "logo") setLogoPreview(null);
        const message = err instanceof Error ? err.message : "Upload failed";
        if (message !== "Upload cancelled") toast.error(message);
      }
    },
    [upload]
  );

  const displayBanner = bannerUrl || getCuratedCommunityBanner(slug);
  const displayLogo = logoPreview || logoUrl;
  const isBannerUploading = isUploading && activeAsset === "banner";
  const isLogoUploading = isUploading && activeAsset === "logo";

  return (
    <>
      <input
        ref={bannerInputRef}
        type="file"
        accept={BRANDING_LIMITS.banner.allowedMime.join(",")}
        className="hidden"
        onChange={(e) => {
          handleFileSelect("banner", e.target.files?.[0]);
          e.target.value = "";
        }}
      />
      <input
        ref={logoInputRef}
        type="file"
        accept={BRANDING_LIMITS.logo.allowedMime.join(",")}
        className="hidden"
        onChange={(e) => {
          handleFileSelect("logo", e.target.files?.[0]);
          e.target.value = "";
        }}
      />

      <div className="w-full h-48 md:h-64 lg:h-72 relative z-10 overflow-hidden bg-slate-100 group">
        <PremiumImage
          key={displayBanner}
          src={displayBanner}
          alt={`${name} banner`}
          fill
          className="object-cover saturate-[0.80] contrast-[0.90] brightness-[0.75] transition-all duration-500"
          sizes="100vw"
          priority
        />
        <div className={SHARED_OVERLAYS.heroOverlay} />

        {canManageBranding && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-slate-900/45 backdrop-blur-[2px]">
            {isBannerUploading ? (
              <UploadProgressBar progress={progress} onCancel={cancel} />
            ) : (
              <button
                type="button"
                onClick={() => bannerInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/95 text-slate-800 text-xs font-bold shadow-lg hover:bg-white"
              >
                <Camera className="w-4 h-4 text-[#34629f]" />
                Change banner
              </button>
            )}
          </div>
        )}

        {state === "error" && activeAsset === "banner" && error && (
          <p className="absolute bottom-2 left-2 right-2 z-30 text-xs font-semibold text-rose-200 bg-rose-900/80 rounded-lg px-2 py-1 text-center">
            {error}
          </p>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 w-full">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 pb-6 pt-4 flex-1">
            <div className="relative z-20 w-28 h-28 md:w-36 md:h-36 rounded-[32px] shadow-lg -mt-14 md:-mt-18 overflow-hidden flex items-center justify-center shrink-0 bg-white group/logo">
              {displayLogo ? (
                <Image
                  key={displayLogo}
                  src={displayLogo}
                  alt={name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 112px, 144px"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#34629f] to-[#2e68a8] flex items-center justify-center text-white font-bold text-4xl">
                  {name.charAt(0).toUpperCase()}
                </div>
              )}

              {canManageBranding && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center opacity-0 group-hover/logo:opacity-100 transition-opacity bg-slate-900/55 backdrop-blur-[2px] rounded-[32px]">
                  {isLogoUploading ? (
                    <UploadProgressBar progress={progress} onCancel={cancel} />
                  ) : (
                    <button
                      type="button"
                      onClick={() => logoInputRef.current?.click()}
                      className="inline-flex flex-col items-center gap-1 text-white"
                    >
                      <ImageIcon className="w-5 h-5" />
                      <span className="text-[9px] font-extrabold uppercase tracking-wider">
                        Edit logo
                      </span>
                    </button>
                  )}
                </div>
              )}

              {state === "error" && activeAsset === "logo" && error && (
                <p className="absolute -bottom-7 left-0 right-0 text-[10px] font-semibold text-rose-500 text-center z-30">
                  {error}
                </p>
              )}
            </div>

            {infoSection}
          </div>

          {actionsSection}
        </div>
      </div>
    </>
  );
}
