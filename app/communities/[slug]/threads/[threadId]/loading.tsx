import { Skeleton } from "@/components/ui/skeleton";

export default function ThreadDetailLoading() {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Thread Card Skeleton */}
      <div className="w-full bg-white dark:bg-slate-900/40 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-6 md:p-8 space-y-6">
        
        {/* Back and community metadata skeleton */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-28 rounded-lg" />
          <Skeleton className="h-5 w-36 rounded-full" />
        </div>

        {/* Title skeleton */}
        <div className="space-y-2.5">
          <Skeleton className="h-8 w-full md:w-3/4 rounded-xl" />
          <Skeleton className="h-8 w-1/2 rounded-xl" />
        </div>

        {/* Author metadata row skeleton */}
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-1.5 flex-1 max-w-xs">
            <Skeleton className="h-4 w-24 rounded-lg" />
            <Skeleton className="h-3.5 w-32 rounded-lg" />
          </div>
        </div>

        {/* Separator skeleton line */}
        <Skeleton className="h-[1px] w-full" />

        {/* Content body skeleton */}
        <div className="space-y-3">
          <Skeleton className="h-4 w-full rounded-lg" />
          <Skeleton className="h-4 w-full rounded-lg" />
          <Skeleton className="h-4 w-5/6 rounded-lg" />
          <Skeleton className="h-4 w-2/3 rounded-lg" />
        </div>

        {/* Syntax highlight placeholder block */}
        <Skeleton className="h-32 w-full rounded-2xl" />

        {/* Actions panel skeleton */}
        <div className="flex items-center justify-between border-t border-b border-slate-100 dark:border-slate-800/60 py-4">
          <div className="flex items-center gap-6">
            <Skeleton className="h-8 w-20 rounded-full" />
            <Skeleton className="h-8 w-24 rounded-full" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>

        {/* Comments Section skeleton */}
        <div className="space-y-4 pt-4">
          <Skeleton className="h-5 w-40 rounded-lg" />
          <Skeleton className="h-24 w-full rounded-2xl" />
          
          {/* Nested comments tree representation */}
          <div className="space-y-6 mt-4">
            {[1, 2].map((i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-3.5 w-32 rounded-lg" />
                  <Skeleton className="h-4 w-full rounded-lg" />
                  <Skeleton className="h-4 w-5/6 rounded-lg" />
                  
                  {/* Indented child comment reply skeleton */}
                  <div className="pl-6 border-l border-slate-100 dark:border-slate-800 flex gap-3 mt-3">
                    <Skeleton className="h-7 w-7 rounded-full shrink-0" />
                    <div className="space-y-1.5 flex-1">
                      <Skeleton className="h-3.5 w-24 rounded-lg" />
                      <Skeleton className="h-4 w-11/12 rounded-lg" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
