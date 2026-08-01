"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { format } from "date-fns";
import { 
  Users, MessageSquare, FileText, Calendar, ShieldCheck, Shield,
  Globe, Github, Twitter, Linkedin, MessageCircle, Info, CalendarRange, ArrowRight
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { itemVariants, staggerContainer } from "@/lib/animations";

type Community = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  banner: string | null;
  createdAt: string;
  _count: {
    members: number;
    posts: number;
  };
};

type Organizer = {
  id: string;
  name: string;
  image: string | null;
  email: string;
  role: string;
  joinedAt: string;
};

type FeaturedMember = {
  id: string;
  name: string;
  image: string | null;
  joinedAt: string;
};

type Socials = {
  website?: string;
  discord?: string;
  github?: string;
  twitter?: string;
  linkedin?: string;
};

export default function AboutClient({
  community,
  organizers,
  featuredMembers,
  tags,
  socials,
}: {
  community: Community;
  organizers: Organizer[];
  featuredMembers: FeaturedMember[];
  tags: string[];
  socials: Socials;
}) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-5xl mx-auto"
    >
      {/* Left Column: Community description & Organizers */}
      <div className="lg:col-span-2 space-y-8">
        
        {/* Description Section */}
        <motion.div variants={itemVariants}>
          <Card className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-4">
              <Info className="w-5 h-5 text-[#34629f]" />
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Community Hub Overview</h2>
            </div>
            
            <div className="space-y-4">
              <p className="text-slate-600 leading-relaxed text-sm">
                {community.description || 
                  "Welcome to our community hub! Join us on this journey to collaborate, share posts, and participate in local meets and discussions."}
              </p>
              
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1.5 pt-2">
                <Calendar className="w-4 h-4 text-slate-300" />
                <span>Established {format(new Date(community.createdAt), "MMMM yyyy")}</span>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Organizers Section */}
        <motion.div variants={itemVariants}>
          <Card className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-4">
              <ShieldCheck className="w-5 h-5 text-[#34629f]" />
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Organizers & Admins</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {organizers.map((org) => (
                <div 
                  key={org.id}
                  className="flex items-center gap-3 bg-slate-50/50 hover:bg-slate-50 border border-slate-100 p-3 rounded-2xl transition-all duration-200"
                >
                  <Avatar className="w-10 h-10 border border-slate-200 shadow-sm rounded-full">
                    <AvatarImage src={org.image || undefined} alt={org.name} className="object-cover" />
                    <AvatarFallback className="bg-gradient-to-br from-[#34629f] to-[#2e68a8] text-white font-bold text-sm">
                      {org.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <h4 className="font-bold text-slate-800 text-sm truncate leading-none mb-1">{org.name}</h4>
                    <div className="flex items-center gap-1">
                      {org.role === "ADMIN" ? (
                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                          <ShieldCheck className="w-2.5 h-2.5" />
                          Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#34629f]/10 text-[#34629f]">
                          <Shield className="w-2.5 h-2.5" />
                          Moderator
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Featured Members Row */}
        {featuredMembers.length > 0 && (
          <motion.div variants={itemVariants}>
            <Card className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-4">
                <Users className="w-5 h-5 text-[#34629f]" />
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Active Members</h2>
              </div>
              
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex -space-x-3 overflow-hidden">
                  {featuredMembers.map((member) => (
                    <Avatar key={member.id} className="inline-block w-9 h-9 rounded-full ring-2 ring-white shadow-sm">
                      <AvatarImage src={member.image || undefined} alt={member.name} className="object-cover" />
                      <AvatarFallback className="bg-gradient-to-br from-[#34629f] to-[#2e68a8] text-white font-bold text-xs">
                        {member.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <span className="text-xs font-semibold text-slate-500">
                  Join {community._count.members.toLocaleString()} members actively sharing in this community!
                </span>
              </div>
            </Card>
          </motion.div>
        )}

      </div>

      {/* Right Column: Statistics, socials, and events */}
      <div className="space-y-8">
        
        {/* Core Stats Overview */}
        <motion.div variants={itemVariants}>
          <Card className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight border-b border-slate-100 pb-3 mb-4">Community Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50 flex flex-col justify-center text-center">
                <Users className="w-5 h-5 text-[#34629f] mx-auto mb-1.5" />
                <span className="text-xl font-extrabold text-slate-800 leading-none">{community._count.members.toLocaleString()}</span>
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-1">Members</span>
              </div>

              <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50 flex flex-col justify-center text-center">
                <FileText className="w-5 h-5 text-indigo-500 mx-auto mb-1.5" />
                <span className="text-xl font-extrabold text-slate-800 leading-none">{community._count.posts.toLocaleString()}</span>
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-1">Posts</span>
              </div>

              <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50 flex flex-col justify-center text-center">
                <CalendarRange className="w-5 h-5 text-emerald-500 mx-auto mb-1.5" />
                <span className="text-xl font-extrabold text-slate-800 leading-none">0</span>
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-1">Events</span>
              </div>

              <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50 flex flex-col justify-center text-center">
                <MessageSquare className="w-5 h-5 text-purple-500 mx-auto mb-1.5" />
                <span className="text-xl font-extrabold text-slate-800 leading-none">0</span>
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-1">Threads</span>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Brand Pill Tags */}
        <motion.div variants={itemVariants}>
          <Card className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight border-b border-slate-100 pb-3 mb-4">Interests & Topics</h3>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span 
                  key={tag}
                  className="px-3 py-1 rounded-full text-xs font-semibold bg-[#34629f]/5 text-[#34629f] border border-[#34629f]/10 hover:bg-[#34629f]/10 transition-colors cursor-pointer select-none"
                >
                  {tag}
                </span>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Social Links */}
        <motion.div variants={itemVariants}>
          <Card className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight border-b border-slate-100 pb-3 mb-4">Social Channels</h3>
            <div className="space-y-3">
              {socials.website && (
                <a 
                  href={socials.website} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-3 px-3 py-2 rounded-2xl hover:bg-slate-50 transition-colors group"
                >
                  <Globe className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
                  <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">Official Website</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 ml-auto transition-colors" />
                </a>
              )}
              {socials.discord && (
                <a 
                  href={socials.discord} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-3 px-3 py-2 rounded-2xl hover:bg-slate-50 transition-colors group"
                >
                  <MessageCircle className="w-4 h-4 text-slate-400 group-hover:text-[#5865F2] transition-colors" />
                  <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">Discord Server</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 ml-auto transition-colors" />
                </a>
              )}
              {socials.github && (
                <a 
                  href={socials.github} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-3 px-3 py-2 rounded-2xl hover:bg-slate-50 transition-colors group"
                >
                  <Github className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors" />
                  <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">GitHub Repository</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 ml-auto transition-colors" />
                </a>
              )}
              {socials.twitter && (
                <a 
                  href={socials.twitter} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-3 px-3 py-2 rounded-2xl hover:bg-slate-50 transition-colors group"
                >
                  <Twitter className="w-4 h-4 text-slate-400 group-hover:text-sky-500 transition-colors" />
                  <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">Twitter Feed</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 ml-auto transition-colors" />
                </a>
              )}
              {socials.linkedin && (
                <a 
                  href={socials.linkedin} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-3 px-3 py-2 rounded-2xl hover:bg-slate-50 transition-colors group"
                >
                  <Linkedin className="w-4 h-4 text-slate-400 group-hover:text-blue-700 transition-colors" />
                  <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">LinkedIn Page</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 ml-auto transition-colors" />
                </a>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Upcoming Event preview CTA */}
        <motion.div variants={itemVariants}>
          <Card className="bg-[#34629f] text-white rounded-3xl p-6 shadow-md hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
            
            <div className="space-y-4 relative z-10">
              <div className="flex items-center gap-2">
                <CalendarRange className="w-5 h-5 text-blue-200" />
                <span className="text-[10px] text-blue-200 font-bold uppercase tracking-widest">Community Events</span>
              </div>
              
              <div className="space-y-1">
                <h4 className="text-lg font-bold">Hackathons & Meetups</h4>
                <p className="text-blue-100 text-xs leading-relaxed">
                  Join organizers and members in upcoming local meetups, sharing hacks, coding marathons, and networking.
                </p>
              </div>

              <Link 
                href={`/communities/${community.slug}/events`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white text-[#34629f] hover:bg-blue-50 font-bold text-xs rounded-full shadow-sm transition-all duration-200 group-hover:scale-[1.03]"
              >
                <span>View Events Board</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </Card>
        </motion.div>

      </div>
    </motion.div>
  );
}
