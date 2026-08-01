import { Card } from "@/components/ui/card";

export default function DashboardLoading() {
  return (
    <div className="w-full space-y-8 pb-12 animate-pulse">
      {/* 1. Community Hero Overview Skeleton */}
      <Card className="bg-white/80 border border-slate-200/60 rounded-3xl p-6 flex flex-col md:flex-row items-center md:items-start gap-6 relative overflow-hidden min-h-[180px]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/5 to-transparent rounded-full blur-2xl pointer-events-none" />
        <div className="w-16 h-16 rounded-3xl bg-slate-200 shrink-0 shadow-sm" />
        <div className="flex-1 space-y-3 w-full relative z-10">
          <div className="h-6 bg-slate-200 rounded-lg w-1/3" />
          <div className="h-3.5 bg-slate-200 rounded-lg w-2/3" />
          <div className="h-3 bg-slate-200 rounded-lg w-1/2" />
        </div>
      </Card>

      {/* Grid Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Main Content Column (Left, 2/3 width) */}
        <div className="lg:col-span-2 space-y-8">
          {/* 2. Stats Grid Loader */}
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="bg-white/80 border border-slate-200/60 rounded-2xl p-4 space-y-2 text-center">
                <div className="h-3 bg-slate-200 rounded w-1/2 mx-auto" />
                <div className="h-6 bg-slate-200 rounded w-1/3 mx-auto" />
              </Card>
            ))}
          </div>

          {/* 3. Featured Event Card Loader */}
          <Card className="bg-white/80 border border-slate-200/60 rounded-3xl p-5 sm:p-6 space-y-4">
            <div className="h-4 bg-slate-200 rounded-lg w-1/4" />
            <div className="w-full h-48 bg-slate-200 rounded-2xl" />
            <div className="space-y-2.5">
              <div className="h-5 bg-slate-200 rounded-lg w-2/3" />
              <div className="h-3.5 bg-slate-200 rounded-lg w-1/2" />
            </div>
          </Card>

          {/* 4. Discussions Preview Loader */}
          <Card className="bg-white/80 border border-slate-200/60 rounded-3xl p-5 sm:p-6 space-y-4">
            <div className="h-4 bg-slate-200 rounded-lg w-1/4" />
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4 p-3 border border-slate-100 rounded-2xl items-center">
                  <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-200 rounded-lg w-1/3" />
                    <div className="h-3 bg-slate-200 rounded-lg w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar Column (Right, 1/3 width) */}
        <div className="space-y-8 lg:sticky lg:top-24">
          {/* 5. Trending Channels Loader */}
          <Card className="bg-white/80 border border-slate-200/60 rounded-3xl p-5 space-y-4">
            <div className="h-4 bg-slate-200 rounded-lg w-1/2" />
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex justify-between items-center py-1">
                  <div className="h-3.5 bg-slate-200 rounded-lg w-1/2" />
                  <div className="w-6 h-4 bg-slate-200 rounded-full" />
                </div>
              ))}
            </div>
          </Card>

          {/* 6. Leaders Loader */}
          <Card className="bg-white/80 border border-slate-200/60 rounded-3xl p-5 space-y-4">
            <div className="h-4 bg-slate-200 rounded-lg w-1/2" />
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3.5 bg-slate-200 rounded-lg w-1/3" />
                    <div className="h-2.5 bg-slate-200 rounded-lg w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
