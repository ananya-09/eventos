import { ReactNode } from "react";

interface DashboardShellProps {
  children: ReactNode[];
}

export default function DashboardShell({ children }: DashboardShellProps) {
  const [hero, stats, featuredEvent, discussions, channels, leaders, sidebarWidgets] = children;

  return (
    <div className="w-full space-y-8 pb-12">
      {/* Hero Panel (Full Width) */}
      <div className="w-full">
        {hero}
      </div>

      {/* Grid Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Main Content Column (Left, 2/3 width) */}
        <div className="lg:col-span-2 space-y-8">
          {stats}
          {featuredEvent}
          {discussions}
        </div>

        {/* Sidebar Column (Right, 1/3 width) */}
        <div className="space-y-8 lg:sticky lg:top-24">
          {channels}
          {leaders}
          {sidebarWidgets}
        </div>
      </div>
    </div>
  );
}
