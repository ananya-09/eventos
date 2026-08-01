"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, MapPin, Image as ImageIcon, AlignLeft, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { overlayVariants, modalVariants } from "@/lib/animations";

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

type CreateEventModalProps = {
  slug: string;
  isOpen: boolean;
  onClose: () => void;
  onEventCreated: (event: EventType) => void;
};

export default function CreateEventModal({
  slug,
  isOpen,
  onClose,
  onEventCreated,
}: CreateEventModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [banner, setBanner] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !location || !startDate || !endDate) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`/api/communities/${slug}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          banner: banner || null,
          location,
          startDate,
          endDate,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to create event");
      }

      toast.success("Event created successfully!");
      onEventCreated(data.event);
      
      // Reset form
      setTitle("");
      setDescription("");
      setBanner("");
      setLocation("");
      setStartDate("");
      setEndDate("");
      
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop overlay */}
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-3xl shadow-xl w-full max-w-xl relative overflow-hidden z-10 p-6 sm:p-8 flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6 shrink-0">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#34629f]" />
                <h3 className="text-xl font-bold text-slate-800 tracking-tight">Create Community Event</h3>
              </div>
              <button 
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form */}
            <form onSubmit={handleSubmit} className="space-y-5 overflow-y-auto pr-1 flex-1 no-scrollbar">
              {/* Event Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Event Title *</label>
                <input
                  type="text"
                  placeholder="e.g. JavaScript Coding Marathon"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50/50 border border-slate-200/60 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#34629f]/10 focus:border-[#34629f] transition-all"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <AlignLeft className="w-3.5 h-3.5 text-slate-400" />
                  Description *
                </label>
                <textarea
                  placeholder="What is this event about? Share the agenda, meet links, and speakers list..."
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50/50 border border-slate-200/60 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#34629f]/10 focus:border-[#34629f] transition-all resize-none"
                />
              </div>

              {/* Banner URL */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
                  Banner URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/... or similar"
                  value={banner}
                  onChange={(e) => setBanner(e.target.value)}
                  className="w-full bg-slate-50/50 border border-slate-200/60 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#34629f]/10 focus:border-[#34629f] transition-all"
                />
              </div>

              {/* Location */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  Location *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Zoom link or Tech Hub Room 3B"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-slate-50/50 border border-slate-200/60 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#34629f]/10 focus:border-[#34629f] transition-all"
                />
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Start Date/Time *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-slate-50/50 border border-slate-200/60 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#34629f]/10 focus:border-[#34629f] transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    End Date/Time *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-slate-50/50 border border-slate-200/60 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#34629f]/10 focus:border-[#34629f] transition-all"
                  />
                </div>
              </div>

              {/* Actions footer */}
              <div className="flex gap-3 pt-6 border-t border-slate-100 shrink-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl font-bold transition-all text-sm"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  isLoading={isLoading}
                  className="flex-1 py-2.5 rounded-xl font-bold transition-all text-sm"
                >
                  Schedule Event
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
