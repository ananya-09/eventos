"use client";

import { useEffect } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error boundary caught error:", error);
  }, [error]);

  return (
    <div className="w-full min-h-[400px] flex items-center justify-center p-4">
      <Card className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl p-8 shadow-md max-w-md w-full text-center space-y-6">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 mb-4 border border-rose-100">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Something went wrong</h2>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            Failed to load your community dashboard insights. Please try again.
          </p>
        </div>

        <Button
          onClick={reset}
          leftIcon={<RotateCcw className="w-4 h-4" />}
          className="w-full py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all"
        >
          Try Again
        </Button>
      </Card>
    </div>
  );
}
