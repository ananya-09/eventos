import { ShieldCheck, Award } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type CommunityLeader = {
  id: string;
  name: string;
  image: string | null;
  role: string;
  joinedAt: string;
};

export default function CommunityLeaders({ leaders }: { leaders: CommunityLeader[] }) {
  return (
    <Card className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 space-y-4">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <Award className="w-5 h-5 text-[#34629f]" />
        <h3 className="text-lg font-bold text-slate-800 tracking-tight">Organizers & Leaders</h3>
      </div>

      <div className="space-y-3">
        {leaders.map((leader) => (
          <div key={leader.id} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <Avatar className="w-8 h-8 rounded-full border border-slate-200 shadow-sm shrink-0">
                <AvatarImage src={leader.image || undefined} alt={leader.name} className="object-cover" />
                <AvatarFallback className="bg-gradient-to-br from-[#34629f] to-[#2e68a8] text-white font-bold text-[10px]">
                  {leader.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0">
                <span className="font-bold text-slate-700 text-xs sm:text-sm truncate block leading-tight">
                  {leader.name}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold block leading-none mt-0.5">
                  Leader
                </span>
              </div>
            </div>

            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-blue-50 text-[#34629f] font-bold text-[9px] uppercase tracking-wider rounded-full shrink-0 shadow-sm border border-blue-100/50">
              <ShieldCheck className="w-3 h-3 text-[#34629f]" />
              <span>{leader.role.toLowerCase()}</span>
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
