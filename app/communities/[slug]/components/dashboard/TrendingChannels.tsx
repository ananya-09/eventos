import { Hash, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";

type VirtualChannel = {
  id: string;
  name: string;
  description: string;
  postCount: number;
};

export default function TrendingChannels({ channels }: { channels: VirtualChannel[] }) {
  return (
    <Card className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 space-y-4">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <Sparkles className="w-5 h-5 text-[#34629f]" />
        <h3 className="text-lg font-bold text-slate-800 tracking-tight">Active Channels</h3>
      </div>

      <div className="space-y-2">
        {channels.map((chan) => (
          <div
            key={chan.id}
            className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors duration-200 group cursor-pointer"
          >
            <div className="flex items-center gap-2 min-w-0">
              <Hash className="w-4 h-4 text-slate-400 group-hover:text-[#34629f] transition-colors shrink-0" />
              <div className="min-w-0">
                <span className="font-bold text-slate-700 text-xs sm:text-sm group-hover:text-slate-900 transition-colors block leading-tight">
                  {chan.name}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold block leading-none mt-0.5 truncate max-w-[140px]">
                  {chan.description}
                </span>
              </div>
            </div>
            <span className="inline-flex items-center px-2 py-0.5 bg-slate-100 text-slate-500 font-bold text-[10px] rounded-full shrink-0 group-hover:bg-blue-50 group-hover:text-[#34629f] transition-all">
              {chan.postCount}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
