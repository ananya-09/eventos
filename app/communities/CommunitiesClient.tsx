"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Search, Users, MessageSquare, ArrowRight, Compass, Loader2, UserCheck, UserPlus } from "lucide-react";
import { toast } from "sonner";
import PremiumImage from "@/components/ui/PremiumImage";
import { getCuratedCommunityBanner, SHARED_OVERLAYS } from "@/lib/media";

type Community = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  banner: string | null;
  isMember?: boolean;
  _count: {
    members: number;
    posts: number;
  };
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
};

const CATEGORIES = ["All", "Technology", "Gaming", "Education", "Lifestyle", "Sports"];

export default function CommunitiesClient({ 
  initialCommunities 
}: { 
  initialCommunities: Community[] 
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  // Track local interactive membership state for optimistic UI updates
  const [membershipMap, setMembershipMap] = useState<Record<string, boolean>>(() =>
    initialCommunities.reduce((acc, c) => ({ ...acc, [c.slug]: !!c.isMember }), {} as Record<string, boolean>)
  );
  
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});

  const handleJoinToggle = async (slug: string) => {
    if (loadingMap[slug]) return;

    const wasMember = !!membershipMap[slug];

    // Optimistic Update
    setMembershipMap((prev) => ({ ...prev, [slug]: !wasMember }));
    setLoadingMap((prev) => ({ ...prev, [slug]: true }));

    try {
      const endpoint = wasMember 
        ? `/api/communities/${slug}/leave` 
        : `/api/communities/${slug}/join`;

      const res = await fetch(endpoint, {
        method: "POST",
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to toggle membership");
      }

      const data = await res.json();

      if (data.success && data.joined !== undefined) {
        setMembershipMap((prev) => ({ ...prev, [slug]: data.joined }));
        toast.success(data.message || (data.joined ? "Joined community!" : "Left community"));
      }
    } catch (error: any) {
      // Revert optimistic update on failure
      setMembershipMap((prev) => ({ ...prev, [slug]: wasMember }));
      toast.error(error.message || "Something went wrong. Please try again.");
      console.error(error);
    } finally {
      setLoadingMap((prev) => ({ ...prev, [slug]: false }));
    }
  };

  const filteredCommunities = initialCommunities.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (c.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    return matchesSearch;
  });

  return (
    <div className="w-full">
      {/* Search and Filter Section */}
      <div className="mb-12 space-y-8 relative z-20">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#2e68a8] transition-colors">
              <Search className="h-5 w-5" />
            </div>
            <input
              type="text"
              placeholder="Search communities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-white/70 backdrop-blur-md border border-slate-200/60 rounded-full text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#34629f]/20 focus:border-[#34629f] transition-all shadow-sm group-hover:shadow-md"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide snap-x">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-full whitespace-nowrap text-sm font-medium transition-all snap-center ${
                  activeCategory === cat
                    ? "bg-[#34629f] text-white shadow-md shadow-[#34629f]/20"
                    : "bg-white/60 backdrop-blur-sm text-slate-600 hover:bg-white hover:text-slate-900 border border-slate-200/50 hover:shadow-sm"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredCommunities.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6 shadow-inner border border-slate-200/50">
            <Compass className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">No communities found</h3>
          <p className="text-slate-500 max-w-md">
            We couldn't find any communities matching your search criteria. Try adjusting your filters or search terms.
          </p>
        </motion.div>
      ) : (
        /* Communities Grid */
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10 w-full"
        >
          <AnimatePresence>
            {filteredCommunities.map((community) => {
              const isJoined = !!membershipMap[community.slug];
              const isProcessing = !!loadingMap[community.slug];

              return (
                <motion.div
                  key={community.id}
                  variants={itemVariants}
                  layout
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className="bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden shadow-sm border border-slate-200/60 hover:shadow-xl transition-all duration-300 group flex flex-col h-full"
                >
                  {/* Banner/Header area */}
                  <div className="h-24 relative overflow-hidden bg-slate-100">
                    <PremiumImage 
                      src={community.banner || getCuratedCommunityBanner(community.slug)} 
                      alt={`${community.name} banner`} 
                      fill
                      className="object-cover transition-all duration-500 saturate-[0.85] contrast-[0.95] group-hover:saturate-100 group-hover:contrast-100" 
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {/* Centralized white overlay gradient for elegant text matching */}
                    <div className={SHARED_OVERLAYS.cardOverlay} />
                  </div>

                  <div className="p-6 pt-0 flex-1 flex flex-col">
                    {/* Avatar */}
                    <div className="w-11 h-11 rounded-xl bg-white shadow-sm border border-slate-100 p-0.5 -mt-6 relative z-10 mb-3 group-hover:scale-105 transition-transform duration-300 flex items-center justify-center overflow-hidden">
                      {community.image ? (
                        <div className="relative w-full h-full">
                          <Image 
                            src={community.image} 
                            alt={community.name} 
                            fill
                            className="rounded-lg object-cover" 
                            sizes="44px"
                          />
                        </div>
                      ) : (
                        <div className="w-full h-full rounded-lg bg-gradient-to-br from-[#34629f] to-[#2e68a8] flex items-center justify-center text-white font-bold text-base">
                          {community.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>

                    <Link href={`/communities/${community.slug}`} className="block group-hover:text-[#2e68a8] transition-colors">
                      <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-2 line-clamp-1">
                        {community.name}
                      </h2>
                    </Link>
                    
                    <p className="text-slate-500 text-sm mb-6 line-clamp-2 leading-relaxed flex-1">
                      {community.description || "A community for connecting and sharing with like-minded individuals."}
                    </p>

                    <div className="flex items-center gap-4 py-4 border-t border-slate-100">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5 text-slate-600 font-semibold">
                          <Users className="w-4 h-4 text-[#34629f]" />
                          <span>
                            {((community._count?.members || 0) + (isJoined && !community.isMember ? 1 : 0) - (!isJoined && community.isMember ? 1 : 0)).toLocaleString()}
                          </span>
                        </div>
                        <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Members</span>
                      </div>
                      
                      <div className="w-px h-8 bg-slate-100" />
                      
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5 text-slate-600 font-semibold">
                          <MessageSquare className="w-4 h-4 text-[#34629f]" />
                          <span>{community._count?.posts?.toLocaleString() || 0}</span>
                        </div>
                        <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Posts</span>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-auto pt-2">
                      <Link href={`/communities/${community.slug}`} className="flex-1">
                        <motion.button
                          whileTap={{ scale: 0.97 }}
                          className="w-full py-2.5 px-4 rounded-xl bg-slate-50 text-slate-700 font-semibold border border-slate-200/60 hover:bg-slate-100 hover:border-slate-300 transition-colors text-sm"
                        >
                          View
                        </motion.button>
                      </Link>
                      
                      <motion.button
                        whileHover={!isProcessing ? { scale: 1.02 } : {}}
                        whileTap={!isProcessing ? { scale: 0.97 } : {}}
                        onClick={() => handleJoinToggle(community.slug)}
                        disabled={isProcessing}
                        className={`flex-1 py-2.5 px-4 rounded-xl font-semibold shadow-sm transition-all flex items-center justify-center gap-2 group/btn text-sm border ${
                          isJoined 
                            ? "bg-[#f8fafc] text-slate-600 border-slate-200 hover:bg-slate-100"
                            : "bg-[#34629f] text-white border-transparent hover:bg-[#2e68a8] hover:shadow-md hover:shadow-[#34629f]/20"
                        } ${isProcessing ? "opacity-75 cursor-not-allowed" : ""}`}
                      >
                        {isProcessing ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : isJoined ? (
                          <UserCheck className="w-4 h-4" />
                        ) : (
                          <UserPlus className="w-4 h-4" />
                        )}
                        {isProcessing ? "Wait..." : isJoined ? "Joined" : "Join"}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
