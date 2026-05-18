import { Users, FileText, CalendarDays } from "lucide-react";
import { Card } from "@/components/ui/card";

type Overview = {
  memberCount: number;
  postCount: number;
  eventCount: number;
};

export default function CommunityStats({ overview }: { overview: Overview }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <Card className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-4">
        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#34629f]">
          <Users className="w-6 h-6" />
        </div>
        <div>
          <span className="text-2xl font-extrabold text-slate-800 leading-none block">{overview.memberCount.toLocaleString()}</span>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mt-1">Members</span>
        </div>
      </Card>

      <Card className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-4">
        <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500">
          <FileText className="w-6 h-6" />
        </div>
        <div>
          <span className="text-2xl font-extrabold text-slate-800 leading-none block">{overview.postCount.toLocaleString()}</span>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mt-1">Posts Shared</span>
        </div>
      </Card>

      <Card className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-4">
        <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500">
          <CalendarDays className="w-6 h-6" />
        </div>
        <div>
          <span className="text-2xl font-extrabold text-slate-800 leading-none block">{overview.eventCount.toLocaleString()}</span>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mt-1">Events Scheduled</span>
        </div>
      </Card>
    </div>
  );
}
