import { Card } from "@/components/ui/card";

export default function ChannelLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* 1. Mirrored ChannelHeader Skeleton */}
      <Card className="bg-white/80 border border-slate-200/60 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative overflow-hidden">
        <div className="space-y-2.5 flex-1">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-slate-200" />
            <div className="h-5 bg-slate-200 rounded-md w-1/4" />
          </div>
          <div className="h-3.5 bg-slate-200 rounded-md w-2/3" />
          <div className="h-3 bg-slate-200 rounded-md w-1/5" />
        </div>
        <div className="w-28 h-9 bg-slate-200 rounded-xl shrink-0" />
      </Card>

      {/* 2. Mirrored DiscussionCards Feed List Skeleton */}
      <div className="space-y-4">
        {[1, 2, 3].map((idx) => {
          // Varying widths to simulate realistic title & text preview lines
          const titleWidths = ["w-1/3", "w-1/2", "w-2/5"];
          const contentWidths = ["w-3/4", "w-2/3", "w-5/6"];

          return (
            <Card key={idx} className="bg-white/80 border border-slate-200/60 rounded-3xl p-4 sm:p-5 space-y-3">
              <div className="flex items-start gap-4">
                {/* Author Avatar circle */}
                <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0" />

                <div className="flex-1 space-y-3 min-w-0">
                  <div className="space-y-2">
                    <div className={`h-4 bg-slate-200 rounded-md ${titleWidths[idx - 1]}`} />
                    <div className={`h-3 bg-slate-200 rounded-md ${contentWidths[idx - 1]}`} />
                  </div>

                  {/* Metadata engagement footer row */}
                  <div className="flex items-center gap-4 border-t border-slate-50 pt-2 text-[10px]">
                    <div className="h-3 bg-slate-200 rounded w-16" />
                    <div className="h-3 bg-slate-200 rounded w-20" />
                    
                    {/* Overlapping Avatars Pile shimmer */}
                    <div className="flex items-center -space-x-1 pl-2">
                      <div className="w-5 h-5 rounded-full bg-slate-200 border border-white" />
                      <div className="w-5 h-5 rounded-full bg-slate-200 border border-white" />
                      <div className="w-5 h-5 rounded-full bg-slate-200 border border-white" />
                    </div>

                    <div className="flex items-center gap-3 ml-auto">
                      <div className="w-8 h-3.5 bg-slate-200 rounded" />
                      <div className="w-8 h-3.5 bg-slate-200 rounded" />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
