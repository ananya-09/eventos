import Link from "next/link";
import { format, parseISO } from "date-fns";
import { CalendarRange, MapPin, Clock, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import PremiumImage from "@/components/ui/PremiumImage";
import { getCuratedEventCover, SHARED_OVERLAYS } from "@/lib/media";

type Creator = {
  id: string;
  name: string;
  image: string | null;
};

type EventType = {
  id: string;
  title: string;
  description: string;
  banner: string | null;
  location: string;
  startDate: string;
  endDate: string;
  creator: Creator;
} | null;

export default function FeaturedEventCard({ event, slug }: { event: EventType; slug: string }) {
  const formatEventDate = (isoString: string) => {
    try {
      return format(parseISO(isoString), "EEE, MMM d, yyyy • h:mm a");
    } catch (e) {
      return isoString;
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <CalendarRange className="w-5 h-5 text-[#34629f]" />
          <h3 className="text-lg font-bold text-slate-800 tracking-tight">Featured Event</h3>
        </div>
        <Link 
          href={`/communities/${slug}/events`}
          className="text-xs font-bold text-[#34629f] hover:text-[#2e68a8] flex items-center gap-1 group transition-colors"
        >
          <span>All Events</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {!event ? (
        <div className="flex flex-col items-center text-center p-6 bg-slate-50/50 border border-slate-100 rounded-2xl">
          <CalendarRange className="w-8 h-8 text-slate-300 mb-2" />
          <h4 className="font-bold text-slate-700 text-sm mb-1">No upcoming events planned</h4>
          <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
            There are no future activities scheduled for this community hub yet.
          </p>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-5 items-stretch">
          <div className="w-full sm:w-44 h-32 rounded-2xl overflow-hidden shrink-0 bg-slate-100 border border-slate-100 relative">
            <PremiumImage
              src={event.banner || getCuratedEventCover(event.id)}
              alt={event.title}
              fill
              sizes="(max-width: 640px) 100vw, 176px"
              className="object-cover w-full h-full saturate-[0.85] contrast-[0.95] transition-all duration-500"
            />
            {/* Ambient overlay gradient for soft blending */}
            <div className={SHARED_OVERLAYS.eventOverlay} />
          </div>

          <div className="flex-1 flex flex-col justify-between py-1 space-y-3">
            <div className="space-y-2">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#34629f]">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{formatEventDate(event.startDate)}</span>
                </div>
                <h4 className="font-extrabold text-slate-800 leading-snug truncate sm:max-w-md">
                  {event.title}
                </h4>
              </div>
              <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">
                {event.description}
              </p>
            </div>

            <div className="flex items-center justify-between gap-4 text-xs font-semibold pt-2 border-t border-slate-50">
              <div className="flex items-center gap-1.5 text-slate-500 min-w-0">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{event.location}</span>
              </div>

              <div className="flex items-center gap-1.5 text-slate-500 shrink-0">
                <Avatar className="w-5 h-5 rounded-full">
                  <AvatarImage src={event.creator.image || undefined} alt={event.creator.name} className="object-cover" />
                  <AvatarFallback className="bg-gradient-to-br from-[#34629f] to-[#2e68a8] text-white font-bold text-[7px]">
                    {event.creator.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="truncate max-w-[60px]">{event.creator.name.split(" ")[0]}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
