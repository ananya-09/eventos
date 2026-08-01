"use client";

import { useCallback, useRef, useState } from "react";
import type { BrandingAssetType } from "@/server/validators/branding.validator";

export type UploadState = "idle" | "uploading" | "success" | "error";

interface UseCommunityBrandingUploadOptions {
  communitySlug: string;
  onSuccess?: (assetType: BrandingAssetType, url: string) => void;
}

export function useCommunityBrandingUpload({
  communitySlug,
  onSuccess,
}: UseCommunityBrandingUploadOptions) {
  const [progress, setProgress] = useState(0);
  const [state, setState] = useState<UploadState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [activeAsset, setActiveAsset] = useState<BrandingAssetType | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const cancel = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setState("idle");
    setProgress(0);
    setActiveAsset(null);
  }, []);

  const upload = useCallback(
    (file: File, assetType: BrandingAssetType) => {
      cancel();

      const controller = new AbortController();
      abortRef.current = controller;

      setActiveAsset(assetType);
      setState("uploading");
      setProgress(0);
      setError(null);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("assetType", assetType);

      return new Promise<string>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", `/api/communities/${communitySlug}/branding/upload`);
        xhr.withCredentials = true;

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            setProgress(Math.round((event.loaded / event.total) * 100));
          }
        };

        xhr.onload = () => {
          abortRef.current = null;
          let data: { success?: boolean; message?: string; url?: string } = {};
          try {
            data = JSON.parse(xhr.responseText);
          } catch {
            /* ignore */
          }

          if (xhr.status >= 200 && xhr.status < 300 && data.success && data.url) {
            setState("success");
            setProgress(100);
            onSuccess?.(assetType, data.url);
            resolve(data.url);
            setTimeout(() => {
              setState("idle");
              setActiveAsset(null);
              setProgress(0);
            }, 600);
            return;
          }

          const message = data.message || `Upload failed (${xhr.status})`;
          setState("error");
          setError(message);
          reject(new Error(message));
        };

        xhr.onerror = () => {
          abortRef.current = null;
          const message = "Network error during upload";
          setState("error");
          setError(message);
          reject(new Error(message));
        };

        xhr.onabort = () => {
          setState("idle");
          setProgress(0);
          setActiveAsset(null);
          reject(new Error("Upload cancelled"));
        };

        controller.signal.addEventListener("abort", () => xhr.abort());
        xhr.send(formData);
      });
    },
    [communitySlug, cancel, onSuccess]
  );

  return {
    upload,
    cancel,
    progress,
    state,
    error,
    activeAsset,
    isUploading: state === "uploading",
  };
}
