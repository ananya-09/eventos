import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  Shield, 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  MessageSquareText,
  Lock,
  ArrowLeft,
  Calendar,
  Award
} from "lucide-react";
import { ReputationService, TRUST_LEVELS, DEFAULT_BADGES } from "@/server/services/reputation.service";

// Map icon string names to Lucide icons
const iconMap: Record<string, any> = {
  Sparkles: Sparkles,
  TrendingUp: TrendingUp,
  ShieldCheck: ShieldCheck,
  MessageSquareText: MessageSquareText,
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = (await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      badges: {
        include: {
          badge: true,
        },
      },
      _count: {
        select: {
          posts: true,
          comments: true,
        },
      },
    },
  })) as any;

  if (!user) {
    redirect("/login");
  }

  const trustLevel = ReputationService.getTrustLevel(user.reputation);
  const nextLevel = TRUST_LEVELS.find((l) => l.level === trustLevel.level + 1);
  
  // Calculate progress percent to next level
  let progressPercent = 100;
  let repRequired = 0;
  if (nextLevel) {
    const currentRange = nextLevel.minReputation - (TRUST_LEVELS[trustLevel.level]?.minReputation || 0);
    const userProgress = user.reputation - (TRUST_LEVELS[trustLevel.level]?.minReputation || 0);
    progressPercent = Math.min(Math.max((userProgress / currentRange) * 100, 0), 100);
    repRequired = nextLevel.minReputation - user.reputation;
  }

  const earnedBadgeNames = new Set(user.badges.map((b: any) => b.badge.name));

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-100 to-slate-200 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-800 dark:text-slate-200 py-10 px-4 md:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Back Link */}
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 dark:hover:text-slate-150 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Feed</span>
        </Link>

        {/* User Card Profile Header */}
        <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl flex flex-col md:flex-row gap-6 items-center">
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-[#2e68a8]/20 bg-slate-100 dark:bg-slate-800 shrink-0">
            {user.image ? (
              <Image 
                src={user.image} 
                alt={user.name} 
                fill 
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-tr from-[#2e68a8] to-sky-500 flex items-center justify-center text-white text-3xl font-extrabold">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="flex-1 text-center md:text-left space-y-2">
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {user.name}
            </h1>
            <p className="text-slate-500 text-sm flex items-center justify-center md:justify-start gap-1">
              <Calendar className="w-4 h-4" />
              <span>Joined {new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}</span>
            </p>
            <div className="flex items-center justify-center md:justify-start gap-3 mt-1.5 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-250/20 text-xs font-bold text-slate-600 dark:text-slate-350 shadow-sm">
                Threads: {user._count.posts}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-250/20 text-xs font-bold text-slate-600 dark:text-slate-350 shadow-sm">
                Comments: {user._count.comments}
              </span>
            </div>
          </div>

          {/* User Reputation Score display */}
          <div className="bg-gradient-to-br from-[#2e68a8] to-sky-600 p-6 rounded-3xl text-white text-center shadow-lg shadow-blue-500/10 min-w-[150px] shrink-0 border border-white/10 relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-white/5 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500" />
            <span className="block text-xs uppercase tracking-widest font-black text-blue-200">Reputation</span>
            <span className="block text-4xl font-black tracking-tight my-1 tabular-nums">
              {user.reputation}
            </span>
            <span className="text-[10px] text-blue-150 font-bold bg-white/10 px-2.5 py-0.5 rounded-full inline-block">
              {trustLevel.name}
            </span>
          </div>
        </div>

        {/* Trust Level Progression Panel */}
        <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-[#2e68a8]" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Trust Level & Capabilities</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-500">
                  <span>Current: {trustLevel.name}</span>
                  {nextLevel && <span>Next: {nextLevel.name}</span>}
                </div>
                {/* Visual Progress Bar */}
                <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 border border-slate-200/30 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-sky-500 rounded-full transition-all duration-1000"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
              
              {nextLevel ? (
                <p className="text-xs text-slate-400 font-medium leading-relaxed">
                  Earn <span className="font-bold text-[#2e68a8]">{repRequired} more reputation</span> points to level up and unlock advanced features.
                </p>
              ) : (
                <p className="text-xs text-slate-450 font-bold leading-relaxed text-blue-500">
                  You have achieved the highest Trust Level on the platform!
                </p>
              )}
            </div>

            <div className="bg-slate-50/50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-850 p-5 rounded-2xl space-y-3">
              <h3 className="text-xs uppercase font-extrabold text-slate-450 tracking-wider">Your Capabilities</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-500">Post Link Articles</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${trustLevel.capabilities.postLinks ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400" : "bg-slate-100 text-slate-400 dark:bg-slate-800"}`}>
                    {trustLevel.capabilities.postLinks ? "Unlocked" : "Locked"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-500">Downvote Flag Content</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${trustLevel.capabilities.downvote ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400" : "bg-slate-100 text-slate-400 dark:bg-slate-800"}`}>
                    {trustLevel.capabilities.downvote ? "Unlocked" : "Locked"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-500">Review Moderation Reports</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${trustLevel.capabilities.flagReview ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400" : "bg-slate-100 text-slate-400 dark:bg-slate-800"}`}>
                    {trustLevel.capabilities.flagReview ? "Unlocked" : "Locked"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-500">Lock Threads</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${trustLevel.capabilities.lockThread ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400" : "bg-slate-100 text-slate-400 dark:bg-slate-800"}`}>
                    {trustLevel.capabilities.lockThread ? "Unlocked" : "Locked"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Badges Achievements Display Grid */}
        <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
          <div className="flex items-center gap-3">
            <Award className="w-6 h-6 text-[#2e68a8]" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Milestones & Achievements</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DEFAULT_BADGES.map((badge) => {
              const isEarned = earnedBadgeNames.has(badge.name);
              const Icon = iconMap[badge.icon] || Award;

              return (
                <div 
                  key={badge.name}
                  className={`flex gap-4 p-4 rounded-2xl border transition-all duration-300 ${
                    isEarned
                      ? "bg-gradient-to-br from-white to-blue-50/10 dark:from-slate-900 dark:to-blue-950/5 border-blue-200 dark:border-blue-900/40 shadow-sm"
                      : "bg-slate-50/30 dark:bg-slate-900/10 border-slate-100 dark:border-slate-800/80 opacity-60"
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-inner ${
                    isEarned
                      ? "bg-blue-50 dark:bg-blue-950/30 text-[#2e68a8] dark:text-blue-400"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                  }`}>
                    {isEarned ? <Icon className="w-6 h-6" /> : <Lock className="w-5 h-5 text-slate-400" />}
                  </div>

                  <div className="space-y-1 min-w-0">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>{badge.name}</span>
                      {isEarned && (
                        <span className="text-[9px] bg-emerald-50 text-emerald-600 dark:bg-emerald-950/35 dark:text-emerald-400 px-1.5 py-0.2 rounded-full uppercase font-black">
                          Unlocked
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {badge.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
