"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, 
  Upload, 
  Loader2, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Info,
  Users,
  MessageSquare,
  Globe,
  Image as ImageIcon
} from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { BRANDING_LIMITS } from "@/server/validators/branding.validator";
import { getCuratedCommunityBanner } from "@/lib/media";

interface CreateCommunityClientProps {
  initialName?: string;
}

const CATEGORIES = ["Technology", "Gaming", "Education", "Lifestyle", "Sports"];

export default function CreateCommunityClient({ initialName = "" }: CreateCommunityClientProps) {
  const router = useRouter();

  // Form State
  const [name, setName] = useState(initialName);
  const [slug, setSlug] = useState("");
  const [isSlugManual, setIsSlugManual] = useState(false);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Technology");
  
  // Branding State
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);

  // File Upload State
  const [logoUploading, setLogoUploading] = useState(false);
  const [logoProgress, setLogoProgress] = useState(0);
  const [logoUploadError, setLogoUploadError] = useState<string | null>(null);
  const logoAbortRef = useRef<AbortController | null>(null);

  const [bannerUploading, setBannerUploading] = useState(false);
  const [bannerProgress, setBannerProgress] = useState(0);
  const [bannerUploadError, setBannerUploadError] = useState<string | null>(null);
  const bannerAbortRef = useRef<AbortController | null>(null);

  // Slug Check State
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [slugMessage, setSlugMessage] = useState("");
  const slugDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const slugInputRef = useRef<HTMLInputElement>(null);

  // Form Submit State
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Slugifier Helper
  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // Remove non-word chars
      .replace(/[\s_]+/g, "-")  // Replace spaces/underscores with hyphens
      .replace(/-+/g, "-");     // Remove duplicate hyphens
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSlugManual(true);
    const originalValue = e.target.value;
    const slugifiedValue = slugify(originalValue);
    
    const selectionStart = e.target.selectionStart;
    const selectionEnd = e.target.selectionEnd;
    
    setSlug(slugifiedValue);
    
    if (selectionStart !== null && selectionEnd !== null) {
      const valueBeforeCaret = originalValue.substring(0, selectionStart);
      const slugifiedBeforeCaret = slugify(valueBeforeCaret);
      const targetCaretPos = slugifiedBeforeCaret.length;

      requestAnimationFrame(() => {
        if (slugInputRef.current) {
          slugInputRef.current.setSelectionRange(targetCaretPos, targetCaretPos);
        }
      });
    }
  };

  // 1. Handle auto-slugification from Name
  useEffect(() => {
    if (!isSlugManual) {
      setSlug(slugify(name));
    }
  }, [name, isSlugManual]);

  // 2. Debounced Slug Availability Check
  useEffect(() => {
    if (slugDebounceRef.current) {
      clearTimeout(slugDebounceRef.current);
    }

    if (slug.length < 3) {
      setSlugAvailable(null);
      setSlugMessage("Slug must be at least 3 characters");
      return;
    }

    // Basic format validation
    const slugRegex = /^[a-z0-9-]+$/;
    if (!slugRegex.test(slug)) {
      setSlugAvailable(false);
      setSlugMessage("Slug can only contain lowercase letters, numbers, and hyphens");
      return;
    }

    setIsCheckingSlug(true);
    setSlugAvailable(null);

    slugDebounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/communities/check-slug?slug=${slug}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setSlugAvailable(data.available);
            setSlugMessage(data.message);
          } else {
            setSlugAvailable(false);
            setSlugMessage(data.message || "Failed to check slug availability");
          }
        } else {
          setSlugAvailable(false);
          setSlugMessage("Error verifying slug availability");
        }
      } catch (error) {
        setSlugAvailable(false);
        setSlugMessage("Network error during slug check");
      } finally {
        setIsCheckingSlug(false);
      }
    }, 500);

    return () => {
      if (slugDebounceRef.current) clearTimeout(slugDebounceRef.current);
    };
  }, [slug]);

  // 3. Cloudinary Branding Upload Handlers
  const cancelUpload = useCallback((type: "logo" | "banner") => {
    if (type === "logo") {
      logoAbortRef.current?.abort();
      logoAbortRef.current = null;
      setLogoUploading(false);
      setLogoProgress(0);
    } else {
      bannerAbortRef.current?.abort();
      bannerAbortRef.current = null;
      setBannerUploading(false);
      setBannerProgress(0);
    }
    toast.success("Upload cancelled");
  }, []);

  const handleFileUpload = async (file: File, type: "logo" | "banner") => {
    const limits = BRANDING_LIMITS[type];
    
    // File verification
    if (!limits.allowedMime.includes(file.type as any)) {
      const errorMsg = `Invalid type. Allowed formats: JPG, PNG, WebP, GIF.`;
      if (type === "logo") setLogoUploadError(errorMsg);
      else setBannerUploadError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    if (file.size > limits.maxBytes) {
      const errorMsg = `File too large. Maximum size is ${limits.maxBytes / (1024 * 1024)}MB.`;
      if (type === "logo") setLogoUploadError(errorMsg);
      else setBannerUploadError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    if (type === "logo") {
      setLogoUploading(true);
      setLogoProgress(0);
      setLogoUploadError(null);
    } else {
      setBannerUploading(true);
      setBannerProgress(0);
      setBannerUploadError(null);
    }

    const controller = new AbortController();
    if (type === "logo") logoAbortRef.current = controller;
    else bannerAbortRef.current = controller;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("assetType", type);
    formData.append("slug", slug || "temp-brand");

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/upload");
    xhr.withCredentials = true;

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        if (type === "logo") setLogoProgress(percent);
        else setBannerProgress(percent);
      }
    };

    xhr.onload = () => {
      let data: any = {};
      try {
        data = JSON.parse(xhr.responseText);
      } catch {}

      if (xhr.status >= 200 && xhr.status < 300 && data.success && data.url) {
        if (type === "logo") {
          setLogoUrl(data.url);
          setLogoUploading(false);
          logoAbortRef.current = null;
        } else {
          setBannerUrl(data.url);
          setBannerUploading(false);
          bannerAbortRef.current = null;
        }
        toast.success(`${type === "banner" ? "Banner" : "Logo"} uploaded successfully!`);
      } else {
        const msg = data.message || `Upload failed (${xhr.status})`;
        if (type === "logo") {
          setLogoUploadError(msg);
          setLogoUploading(false);
          logoAbortRef.current = null;
        } else {
          setBannerUploadError(msg);
          setBannerUploading(false);
          bannerAbortRef.current = null;
        }
        toast.error(msg);
      }
    };

    xhr.onerror = () => {
      const msg = "Network error during upload.";
      if (type === "logo") {
        setLogoUploadError(msg);
        setLogoUploading(false);
      } else {
        setBannerUploadError(msg);
        setBannerUploading(false);
      }
      toast.error(msg);
    };

    xhr.onabort = () => {
      if (type === "logo") {
        setLogoUploading(false);
        setLogoProgress(0);
      } else {
        setBannerUploading(false);
        setBannerProgress(0);
      }
    };

    controller.signal.addEventListener("abort", () => xhr.abort());
    xhr.send(formData);
  };

  const pickFile = (type: "logo" | "banner") => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = BRANDING_LIMITS[type].allowedMime.join(",");
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) handleFileUpload(file, type);
    };
    input.click();
  };

  // 4. Form Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Standard validations
    if (name.length < 3 || name.length > 50) {
      toast.error("Community Name must be between 3 and 50 characters");
      return;
    }

    if (slugAvailable === false) {
      toast.error("Please resolve the slug issue first");
      return;
    }

    if (slug.length < 3 || slug.length > 50) {
      toast.error("Slug must be between 3 and 50 characters");
      return;
    }

    if (description.length > 500) {
      toast.error("Description must not exceed 500 characters");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name,
        slug,
        description: description || undefined,
        image: logoUrl || undefined,
        banner: bannerUrl || undefined,
      };

      const res = await fetch("/api/communities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("Community created successfully! Launching onboarding...");
        // Auto redirect to new community home
        router.push(`/communities/${data.community.slug}`);
      } else {
        toast.error(data.message || data.error?.[0]?.message || "Failed to create community");
        setIsSubmitting(false);
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred");
      setIsSubmitting(false);
    }
  };

  // Curated Fallback Banner based on slug keyword or selected category
  const displayBanner = bannerUrl || getCuratedCommunityBanner(slug || category);

  return (
    <div className="w-full">
      {/* Top Breadcrumb */}
      <Link
        href="/communities"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#34629f] transition-colors mb-6"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to communities
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Premium Form */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-7 space-y-6"
        >
          {/* Header text */}
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold text-[#34629f] uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Onboarding Suite
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Start a Community
            </h1>
            <p className="text-sm text-slate-500 max-w-lg">
              Set up your premium hub in seconds. Populate details, brand it uniquely, and invite members to collaborate, share posts, and schedule immersive events.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 1. Core Metadata Box */}
            <div className="glass-surface-strong rounded-[2rem] border border-slate-200/70 p-6 sm:p-8 space-y-6 shadow-md backdrop-blur-2xl">
              <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#34629f]" />
                Identity & Details
              </h2>

              {/* Name */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Community Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Next.js Developers Gorakhpur"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-white/70 border border-slate-200/80 rounded-xl text-slate-950 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#34629f]/20 focus:border-[#34629f] transition-all shadow-inner text-sm font-semibold"
                />
              </div>

              {/* Slug with Real-time Async Validation */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Custom Slug <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsSlugManual(true)}
                    className="text-[10px] text-[#34629f] hover:underline font-bold"
                  >
                    Edit Slug Manually
                  </button>
                </div>
                <div className="relative flex items-stretch rounded-xl border border-slate-200/80 bg-white/70 focus-within:ring-2 focus-within:ring-[#34629f]/20 focus-within:border-[#34629f] transition-all shadow-inner overflow-hidden">
                  <span className="inline-flex items-center px-4 bg-slate-50 border-r border-slate-200 text-slate-400 font-bold text-sm select-none shrink-0">
                    eventos.io/
                  </span>
                  <div className="relative flex-1">
                    <input
                      ref={slugInputRef}
                      type="text"
                      required
                      placeholder="nextjs-devs-gorakhpur"
                      value={slug}
                      onChange={handleSlugChange}
                      className="w-full pl-4 pr-10 py-3 bg-transparent text-slate-950 placeholder-slate-400 focus:outline-none text-sm font-semibold"
                    />

                    {/* Slug availability indicator icon */}
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                      {isCheckingSlug ? (
                        <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />
                      ) : slugAvailable === true ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : slugAvailable === false ? (
                        <AlertCircle className="w-4 h-4 text-rose-500" />
                      ) : null}
                    </div>
                  </div>
                </div>

                {/* Slug feedback message */}
                {slugMessage && (
                  <motion.p 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`text-[11px] font-bold mt-1.5 flex items-center gap-1 ${
                      slugAvailable === true ? "text-emerald-600" : "text-rose-600"
                    }`}
                  >
                    <Info className="w-3 h-3" />
                    {slugMessage}
                  </motion.p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Short Description
                  </label>
                  <span className={`text-[10px] font-bold ${description.length > 500 ? "text-rose-500" : "text-slate-400"}`}>
                    {description.length}/500
                  </span>
                </div>
                <textarea
                  rows={4}
                  placeholder="Tell people what your community is all about. This will be shown on search, discovery cards, and the onboarding headers..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 bg-white/70 border border-slate-200/80 rounded-xl text-slate-950 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#34629f]/20 focus:border-[#34629f] transition-all shadow-inner text-sm leading-relaxed"
                />
              </div>

              {/* Category */}
              <div className="space-y-2.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Category / Ecosystem Focus
                </label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                        category === cat
                          ? "bg-[#34629f] text-white border-transparent shadow-sm shadow-[#34629f]/10 scale-[1.02]"
                          : "bg-white/70 text-slate-600 border-slate-200/80 hover:bg-white hover:text-slate-900"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. Visual Branding Upload Box */}
            <div className="glass-surface-strong rounded-[2rem] border border-slate-200/70 p-6 sm:p-8 space-y-6 shadow-md backdrop-blur-2xl">
              <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#34629f]" />
                Branding assets
              </h2>

              {/* Logo upload block */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Community Logo
                </h3>
                <div className="flex flex-col sm:flex-row gap-5 sm:items-center">
                  {/* Logo frame */}
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 shadow-inner flex items-center justify-center">
                    {logoUrl ? (
                      <Image src={logoUrl} alt="Logo" fill className="object-cover animate-fade-in" sizes="80px" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#34629f] to-sky-500 flex items-center justify-center text-white font-bold text-xl uppercase">
                        {name ? name.charAt(0) : "?"}
                      </div>
                    )}
                    {logoUploading && (
                      <div className="absolute inset-0 bg-slate-950/60 flex items-center justify-center">
                        <Loader2 className="w-5 h-5 text-white animate-spin" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <p className="text-[11px] text-slate-500 leading-normal">
                      Square image · recommended size 512×512 · max 2MB · PNG, JPG, WebP, GIF
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        disabled={logoUploading || isSubmitting}
                        onClick={() => pickFile("logo")}
                        className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-all"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        Choose Logo
                      </button>

                      {logoUploading && (
                        <button
                          type="button"
                          onClick={() => cancelUpload("logo")}
                          className="text-xs text-rose-500 font-bold hover:underline"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {logoUploading && (
                  <div className="space-y-1">
                    <Progress value={logoProgress} className="h-1.5" />
                    <p className="text-[10px] text-slate-400 font-bold">Uploading: {logoProgress}%</p>
                  </div>
                )}
                
                {logoUploadError && (
                  <p className="text-xs text-rose-500 font-bold mt-1">{logoUploadError}</p>
                )}
              </div>

              {/* Banner upload block */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Community Banner
                </h3>

                <div className="relative h-32 w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner">
                  <Image
                    src={displayBanner}
                    alt="Banner preview"
                    fill
                    className="object-cover saturate-[0.9] contrast-[0.95]"
                    sizes="(max-width: 768px) 100vw, 600px"
                  />
                  {bannerUploading && (
                    <div className="absolute inset-0 bg-slate-950/60 flex flex-col items-center justify-center gap-2 px-8">
                      <Loader2 className="w-6 h-6 text-white animate-spin" />
                      <Progress value={bannerProgress} className="w-full max-w-xs h-1.5" />
                      <button
                        type="button"
                        onClick={() => cancelUpload("banner")}
                        className="text-xs text-white/90 underline font-bold"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                  <div>
                    <p className="text-[11px] text-slate-500">
                      Landscape banner · recommended 1920×640 · max 5MB · PNG, JPG, WebP, GIF
                    </p>
                  </div>
                  
                  <div className="shrink-0 flex items-center gap-2">
                    <button
                      type="button"
                      disabled={bannerUploading || isSubmitting}
                      onClick={() => pickFile("banner")}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-all"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      Upload custom banner
                    </button>
                  </div>
                </div>

                {bannerUploadError && (
                  <p className="text-xs text-rose-500 font-bold mt-1">{bannerUploadError}</p>
                )}
              </div>
            </div>

            {/* Form Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting || isCheckingSlug || slugAvailable === false}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full py-4 rounded-2xl bg-[#34629f] hover:bg-[#2e68a8] disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-extrabold text-base shadow-md shadow-[#34629f]/10 transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating community...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Create Community
                </>
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* RIGHT COLUMN: Premium Sticky Live Preview Card */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-5 lg:sticky lg:top-24 space-y-4"
        >
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <Info className="w-3.5 h-3.5" />
              Live Visual Preview
            </span>
            <p className="text-xs text-slate-400 leading-normal">
              This card displays real-time formatting updates to match exact layouts shown in search feeds.
            </p>
          </div>

          {/* Live Preview Card exactly styled like CommunitiesClient grid card */}
          <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-200/80 transition-all duration-300 flex flex-col h-full transform hover:scale-[1.01]">
            
            {/* Banner preview */}
            <div className="h-32 relative overflow-hidden bg-slate-100">
              <Image 
                src={displayBanner} 
                alt="Banner preview card" 
                fill
                className="object-cover saturate-[0.85] contrast-[0.95]" 
                sizes="400px"
              />
              
              {/* Category tag on card top right */}
              <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider z-20">
                {category}
              </div>
            </div>

            <div className="p-6 pt-0 flex-1 flex flex-col relative bg-white/70 backdrop-blur-md">
              {/* Avatar Logo preview */}
              <div className="w-12 h-12 rounded-xl bg-white shadow-md border border-slate-100 p-0.5 -mt-6 relative z-10 mb-3 flex items-center justify-center overflow-hidden">
                {logoUrl ? (
                  <div className="relative w-full h-full">
                    <Image 
                      src={logoUrl} 
                      alt="Logo preview" 
                      fill
                      className="rounded-lg object-cover" 
                      sizes="44px"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full rounded-lg bg-gradient-to-br from-[#34629f] to-[#2e68a8] flex items-center justify-center text-white font-extrabold text-lg uppercase shadow-inner">
                    {name ? name.charAt(0) : "?"}
                  </div>
                )}
              </div>

              {/* Title */}
              <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-2 line-clamp-1">
                {name || "Your Community Name"}
              </h2>

              {/* URL preview path */}
              <p className="text-[10px] font-bold text-[#34629f] tracking-wider uppercase mb-3 truncate">
                eventos.io/communities/{slug || "slug-path"}
              </p>
              
              {/* Description */}
              <p className="text-slate-500 text-sm mb-6 line-clamp-3 leading-relaxed flex-1">
                {description || "Provide an engaging summary of your community ecosystem, key topics, membership structure, and event types..."}
              </p>

              {/* Counts section */}
              <div className="flex items-center gap-4 py-4 border-t border-slate-100">
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5 text-slate-600 font-semibold">
                    <Users className="w-4 h-4 text-[#34629f]" />
                    <span>1</span>
                  </div>
                  <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Member</span>
                </div>
                
                <div className="w-px h-8 bg-slate-100" />
                
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5 text-slate-600 font-semibold">
                    <MessageSquare className="w-4 h-4 text-[#34629f]" />
                    <span>0</span>
                  </div>
                  <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Posts</span>
                </div>
              </div>

              {/* Action Buttons Mock (Disabled) */}
              <div className="flex gap-3 mt-auto pt-2 opacity-50 pointer-events-none">
                <button
                  type="button"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-slate-50 text-slate-700 font-semibold border border-slate-200/60 text-sm"
                >
                  View
                </button>
                <button
                  type="button"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-[#34629f] text-white font-semibold text-sm"
                >
                  Joined
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
