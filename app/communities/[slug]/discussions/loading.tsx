import { Card } from "@/components/ui/card";

export default function DiscussionsLoading() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start w-full animate-pulse">
      {/* 1. Left Sticky Aside Sidebar Skeleton */}
      <aside className="lg:col-span-1 w-full">
        <Card className="bg-white/80 border border-slate-200/60 rounded-3xl p-4 sm:p-5 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="h-4 bg-slate-200 rounded w-1/2" />
          </div>
          
          {[1, 2, 3].map((catIdx) => (
            <div key={catIdx} className="space-y-2">
              <div className="h-3 bg-slate-200 rounded w-1/3" />
              <div className="space-y-1">
                {[1, 2].map((chanIdx) => (
                  <div key={chanIdx} className="h-7 bg-slate-200 rounded-xl w-full" />
                ))}
              </div>
            </div>
          ))}
        </Card>
      </aside>

      {/* 2. Right Main Feed Skeleton */}
      <main className="lg:col-span-3 w-full space-y-6">
        <Card className="bg-white/80 border border-slate-200/60 rounded-3xl p-5 sm:p-6 flex items-center justify-between gap-4 h-24">
          <div className="space-y-2 flex-1">
            <div className="h-5 bg-slate-200 rounded w-1/4" />
            <div className="h-3.5 bg-slate-200 rounded w-1/2" />
          </div>
        </Card>
        
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <Card key={i} className="bg-white/80 border border-slate-200/60 rounded-3xl p-4 sm:p-5 h-28" />
          ))}
        </div>
      </main>
    </div>
  );
}
