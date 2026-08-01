"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Users, Shield, ShieldCheck, Mail, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { itemVariants, staggerContainer } from "@/lib/animations";

type Member = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  joinedAt: string;
  role: string;
};

type MembersListProps = {
  initialMembers: Member[];
  initialCount: number;
};

export default function MembersList({
  initialMembers,
  initialCount,
}: MembersListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMembers = initialMembers.filter((member) => {
    const query = searchQuery.toLowerCase();
    return (
      member.name.toLowerCase().includes(query) ||
      member.email.toLowerCase().includes(query)
    );
  });

  return (
    <div className="w-full space-y-6">
      {/* Header and Search control */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#34629f]">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Community Members</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              {filteredMembers.length} {filteredMembers.length === 1 ? "member" : "members"} total
            </p>
          </div>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/80 border border-slate-200/60 rounded-full pl-9 pr-4 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#34629f]/10 focus:border-[#34629f] transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Grid of Member Cards */}
      <AnimatePresence mode="popLayout">
        {filteredMembers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center justify-center p-12 text-center bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl shadow-sm min-h-[300px]"
          >
            <div className="bg-slate-100 p-6 rounded-full mb-4 shadow-sm border border-slate-200">
              <Users className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">No members found</h3>
            <p className="text-slate-500 max-w-sm">
              We couldn't find any members matching "{searchQuery}". Try adjusting your search query.
            </p>
          </motion.div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
          >
            {filteredMembers.map((member) => (
              <motion.div
                key={member.id}
                variants={itemVariants}
                layout
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-sm border border-slate-200/60 hover:shadow-md transition-all duration-300 relative overflow-hidden group flex flex-col items-center text-center space-y-4"
              >
                {/* Subtle gradient accent on card hover */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500/0 via-blue-500/0 to-blue-500/0 group-hover:from-blue-400 group-hover:via-blue-500 group-hover:to-[#2e68a8] transition-all duration-500 opacity-0 group-hover:opacity-100" />

                {/* Avatar with Status badge */}
                <div className="relative">
                  <Avatar className="w-20 h-20 border-4 border-white shadow-md rounded-full relative">
                    <AvatarImage src={member.image || undefined} alt={member.name} className="object-cover" />
                    <AvatarFallback className="bg-gradient-to-br from-[#34629f] to-[#2e68a8] text-white font-bold text-2xl">
                      {member.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {member.role === "ADMIN" && (
                    <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-1 rounded-full shadow-md border-2 border-white" title="Admin">
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </div>
                  )}
                  {member.role === "MODERATOR" && (
                    <div className="absolute -bottom-1 -right-1 bg-[#34629f] text-white p-1 rounded-full shadow-md border-2 border-white" title="Moderator">
                      <Shield className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>

                {/* Info Text */}
                <div className="space-y-1 w-full min-w-0">
                  <h3 className="font-bold text-slate-800 truncate text-lg group-hover:text-[#2e68a8] transition-colors">
                    {member.name}
                  </h3>
                  <div className="flex items-center justify-center gap-1.5 text-slate-500 text-xs truncate">
                    <Mail className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                    <span className="truncate">{member.email}</span>
                  </div>
                </div>

                {/* Footer Join Date */}
                <div className="w-full pt-3 border-t border-slate-100/80 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <Calendar className="w-3.5 h-3.5 text-slate-300" />
                  <span>Joined {formatDistanceToNow(new Date(member.joinedAt), { addSuffix: true })}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
