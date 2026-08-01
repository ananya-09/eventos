import { BookOpen } from "lucide-react";

export default function ResourcesTab() {
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center p-12 text-center bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl shadow-sm min-h-[300px]">
      <div className="bg-emerald-50 p-6 rounded-full mb-4 shadow-inner text-emerald-500">
        <BookOpen className="w-10 h-10" />
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-2">Shared Resources</h3>
      <p className="text-slate-500 max-w-sm">
        No links, manuals, or documents have been shared yet. Reach out to the organizers or check the feed for reference notes!
      </p>
    </div>
  );
}
