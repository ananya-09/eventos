import { format } from "date-fns";
import { Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import PremiumImage from "@/components/ui/PremiumImage";
import { getCuratedCommunityBanner, SHARED_OVERLAYS } from "@/lib/media";

type Overview = {
  name: string;
  description: string | null;
  image: string | null;
  banner: string | null;
  createdAt: string;
};

export default function CommunityHero({ overview, slug }: { overview: Overview; slug: string }) {
  const bannerUrl = overview.banner || getCuratedCommunityBanner(slug);

  return (
    <Card className="bg-white/95 border border-slate-200/60 rounded-3xl overflow-hidden shadow-sm relative group min-h-[220px] flex flex-col justify-end">
      {/* Dynamic Curved Hero Banner Background */}
      <div className="absolute inset-0 z-0">
        <PremiumImage
          src={bannerUrl}
          alt={overview.name}
          fill
          priority
          sizes="(max-width: 1200px) 100vw, 1200px"
          className="object-cover w-full h-full saturate-[0.80] contrast-[0.90] brightness-[0.75] transition-all duration-500"
        />
        {/* Centralized premium ambient cinematic dark overlay */}
        <div className={SHARED_OVERLAYS.heroOverlay} />
      </div>

      <div className="p-6 sm:p-8 space-y-3 max-w-3xl relative z-20 text-white">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight drop-shadow-sm">
          Welcome to {overview.name}
        </h1>
        <p className="text-slate-200 leading-relaxed text-sm sm:text-base font-medium drop-shadow-sm max-w-2xl">
          {overview.description || 
            "Connect, collaborate, and share insights. Explore events, recent threads, and meet up with fellow community developers!"}
        </p>

        <div className="text-[10px] font-extrabold text-slate-300 uppercase tracking-widest flex items-center gap-1.5 pt-2">
          <Calendar className="w-4 h-4 text-blue-400 shrink-0" />
          <span>Formed {format(new Date(overview.createdAt), "MMMM yyyy")}</span>
        </div>
      </div>
    </Card>
  );
}
