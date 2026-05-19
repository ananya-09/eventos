export default function NewDiscussionLoading() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-8 animate-pulse">
      <div className="h-4 w-32 bg-slate-200 rounded-lg" />
      <div className="space-y-2">
        <div className="h-3 w-24 bg-slate-200 rounded" />
        <div className="h-8 w-64 bg-slate-200 rounded-xl" />
        <div className="h-4 w-full max-w-md bg-slate-100 rounded" />
      </div>
      <div className="glass-surface-strong rounded-3xl p-8 space-y-4 border border-slate-200/60">
        <div className="h-10 bg-slate-100 rounded-2xl" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-10 bg-slate-100 rounded-xl" />
          <div className="h-10 bg-slate-100 rounded-xl" />
        </div>
        <div className="h-32 bg-slate-100 rounded-2xl" />
        <div className="h-10 w-40 bg-slate-200 rounded-xl ml-auto" />
      </div>
    </div>
  );
}
