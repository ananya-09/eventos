"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, parseISO } from "date-fns";
import { CalendarRange, CalendarDays, Plus, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { itemVariants, staggerContainer } from "@/lib/animations";
import CreateEventModal from "./components/CreateEventModal";

type Creator = {
  id: string;
  name: string;
  image: string | null;
  email: string;
};

type EventType = {
  id: string;
  title: string;
  description: string;
  banner: string | null;
  location: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  creator: Creator;
};

type EventsClientProps = {
  slug: string;
  initialUpcomingEvents: EventType[];
  initialPastEvents: EventType[];
  isMember: boolean;
};

export default function EventsClient({
  slug,
  initialUpcomingEvents,
  initialPastEvents,
  isMember,
}: EventsClientProps) {
  const [upcomingEvents, setUpcomingEvents] = useState<EventType[]>(initialUpcomingEvents);
  const [pastEvents, setPastEvents] = useState<EventType[]>(initialPastEvents);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEventCreated = (newEvent: EventType) => {
    // Sort and insert dynamically
    setUpcomingEvents((prev) => [newEvent, ...prev].sort(
      (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    ));
  };

  const formatEventDate = (isoString: string) => {
    try {
      const date = parseISO(isoString);
      return format(date, "EEE, MMM d, yyyy • h:mm a");
    } catch (e) {
      return isoString;
    }
  };

  return (
    <div className="w-full space-y-10">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#34629f]">
            <CalendarRange className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Scheduled Events</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              {upcomingEvents.length} upcoming • {pastEvents.length} past events
            </p>
          </div>
        </div>

        {isMember && (
          <Button
            onClick={() => setIsModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
            className="px-5 py-2.5 rounded-full font-semibold text-sm transition-all shadow-sm"
          >
            Create Event
          </Button>
        )}
      </div>

      {/* Upcoming Events Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-slate-800">
          <CalendarDays className="w-5 h-5 text-[#34629f]" />
          <h3 className="text-lg font-bold tracking-tight">Upcoming Community Events</h3>
        </div>

        <AnimatePresence mode="popLayout">
          {upcomingEvents.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center justify-center p-12 text-center bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl shadow-sm min-h-[250px]"
            >
              <div className="bg-slate-50 p-6 rounded-full mb-4 border border-slate-100 shadow-sm text-slate-400">
                <CalendarRange className="w-10 h-10" />
              </div>
              <h4 className="text-lg font-bold text-slate-800 mb-2">No upcoming events scheduled</h4>
              <p className="text-slate-500 max-w-sm text-sm">
                There are no future events planned at the moment. Check back soon or create one if you are a member!
              </p>
            </motion.div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {upcomingEvents.map((evt) => (
                <motion.div
                  key={evt.id}
                  variants={itemVariants}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="bg-white rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group flex flex-col h-full relative"
                >
                  <div className="absolute top-3 right-3 z-10">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 shadow-sm">
                      Upcoming
                    </span>
                  </div>

                  {/* Banner image */}
                  <div className="h-44 w-full relative overflow-hidden bg-slate-100 shrink-0">
                    {evt.banner ? (
                      <img 
                        src={evt.banner} 
                        alt={evt.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" 
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-r from-[#34629f]/20 to-[#2e68a8]/20 flex items-center justify-center text-slate-300">
                        <CalendarRange className="w-12 h-12" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>

                  {/* Event Details */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#34629f]">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{formatEventDate(evt.startDate)}</span>
                        </div>
                        <h4 className="font-extrabold text-slate-800 text-lg group-hover:text-[#2e68a8] transition-colors leading-snug">
                          {evt.title}
                        </h4>
                      </div>
                      <p className="text-slate-500 text-xs leading-relaxed line-clamp-3">
                        {evt.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4 text-xs font-semibold">
                      <div className="flex items-center gap-1.5 text-slate-500 min-w-0">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{evt.location}</span>
                      </div>

                      <div className="flex items-center gap-1.5 text-slate-500 shrink-0">
                        <Avatar className="w-6 h-6 rounded-full border border-white shadow-sm">
                          <AvatarImage src={evt.creator.image || undefined} alt={evt.creator.name} className="object-cover" />
                          <AvatarFallback className="bg-gradient-to-br from-[#34629f] to-[#2e68a8] text-white font-bold text-[8px]">
                            {evt.creator.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="truncate max-w-[80px]">{evt.creator.name.split(" ")[0]}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Past Events Section */}
      {pastEvents.length > 0 && (
        <div className="space-y-6 pt-6 border-t border-slate-200/60">
          <div className="flex items-center gap-2 text-slate-700">
            <CalendarDays className="w-5 h-5 text-slate-400" />
            <h3 className="text-lg font-bold tracking-tight">Past Community Events</h3>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-75 hover:opacity-90 transition-opacity duration-300"
          >
            {pastEvents.map((evt) => (
              <div
                key={evt.id}
                className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden flex flex-col h-full relative"
              >
                <div className="absolute top-3 right-3 z-10">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 shadow-sm border border-slate-200/40">
                    Past
                  </span>
                </div>

                <div className="h-40 w-full relative overflow-hidden bg-slate-100 shrink-0 filter grayscale">
                  {evt.banner ? (
                    <img 
                      src={evt.banner} 
                      alt={evt.title} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-slate-200 to-slate-300 flex items-center justify-center text-slate-400">
                      <CalendarRange className="w-12 h-12" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{formatEventDate(evt.startDate)}</span>
                      </div>
                      <h4 className="font-extrabold text-slate-700 text-lg leading-snug">
                        {evt.title}
                      </h4>
                    </div>
                    <p className="text-slate-500 text-xs leading-relaxed line-clamp-3">
                      {evt.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4 text-xs font-semibold">
                    <div className="flex items-center gap-1.5 text-slate-400 min-w-0">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{evt.location}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-400 shrink-0">
                      <Avatar className="w-6 h-6 rounded-full border border-white shadow-sm">
                        <AvatarImage src={evt.creator.image || undefined} alt={evt.creator.name} className="object-cover" />
                        <AvatarFallback className="bg-slate-300 text-white font-bold text-[8px]">
                          {evt.creator.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="truncate max-w-[80px]">{evt.creator.name.split(" ")[0]}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      )}

      {/* Modal Dialog */}
      <CreateEventModal 
        slug={slug}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onEventCreated={handleEventCreated}
      />
    </div>
  );
}
