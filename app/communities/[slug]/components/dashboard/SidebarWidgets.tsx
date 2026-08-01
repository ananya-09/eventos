import Link from "next/link";
import { format, parseISO } from "date-fns";
import { CalendarRange, Clock, Users, ArrowRight, BookOpen } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type MiniEvent = {
  id: string;
  title: string;
  startDate: string;
};

type ActiveMember = {
  id: string;
  name: string;
  image: string | null;
};

interface SidebarWidgetsProps {
  miniEvents: MiniEvent[];
  activeMembers: ActiveMember[];
  slug: string;
}

export default function SidebarWidgets({ miniEvents, activeMembers, slug }: SidebarWidgetsProps) {
  const formatMiniDate = (isoString: string) => {
    try {
      return format(parseISO(isoString), "MMM d, h:mm a");
    } catch (e) {
      return isoString;
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Upcoming Mini Events Widget */}
      {miniEvents.length > 0 && (
        <Card className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <CalendarRange className="w-5 h-5 text-[#34629f]" />
              <h3 className="text-lg font-bold text-slate-800 tracking-tight">More Events</h3>
            </div>
          </div>

          <div className="space-y-3">
            {miniEvents.map((evt) => (
              <Link 
                key={evt.id} 
                href={`/communities/${slug}/events`}
                className="block hover:bg-slate-50 p-2.5 rounded-2xl transition-all duration-200 group"
              >
                <div className="flex items-center gap-2 text-[10px] font-bold text-[#34629f]">
                  <Clock className="w-3 h-3" />
                  <span>{formatMiniDate(evt.startDate)}</span>
                </div>
                <h4 className="font-bold text-slate-700 text-xs mt-1 group-hover:text-[#2e68a8] transition-colors leading-tight truncate">
                  {evt.title}
                </h4>
              </Link>
            ))}
          </div>
        </Card>
      )}

      {/* 2. Active Members facepile Widget */}
      {activeMembers.length > 0 && (
        <Card className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[#34629f]" />
              <h3 className="text-lg font-bold text-slate-800 tracking-tight">Recent Joins</h3>
            </div>
            <Link 
              href={`/communities/${slug}/members`}
              className="text-[10px] font-bold text-[#34629f] hover:text-[#2e68a8] flex items-center gap-0.5 transition-colors"
            >
              <span>All</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {activeMembers.map((member) => (
              <Avatar key={member.id} className="w-8 h-8 rounded-full border-2 border-white shadow-sm hover:scale-105 transition-transform cursor-pointer">
                <AvatarImage src={member.image || undefined} alt={member.name} className="object-cover" />
                <AvatarFallback className="bg-gradient-to-br from-[#34629f] to-[#2e68a8] text-white font-bold text-[9px]">
                  {member.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
        </Card>
      )}

      {/* 3. Community Resources / Quick Links widget */}
      <Card className="bg-gradient-to-br from-blue-50/50 to-indigo-50/20 backdrop-blur-xl border border-slate-200/60 rounded-3xl p-6 shadow-sm space-y-4 relative overflow-hidden group">
        <div className="absolute inset-0 bg-white/20 backdrop-blur-xl z-0 pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#34629f]" />
            <h3 className="text-lg font-bold text-slate-800 tracking-tight">Knowledge Base</h3>
          </div>
          <p className="text-slate-500 text-xs leading-relaxed">
            Access official slides, code repositories, documentation links, and resource files created by organizers.
          </p>
          <Link 
            href={`/communities/${slug}/resources`}
            className="w-full inline-flex items-center justify-center py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-900 font-bold text-xs rounded-xl shadow-sm transition-all duration-200"
          >
            Open Resources
          </Link>
        </div>
      </Card>
    </div>
  );
}
