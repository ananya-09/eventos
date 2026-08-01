"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Creator } from "@/lib/discussions/types";

interface ParticipantFacepileProps {
  participants: Creator[];
  max?: number;
}

export default function ParticipantFacepile({ participants, max = 3 }: ParticipantFacepileProps) {
  if (participants.length === 0) return null;

  const displayParticipants = participants.slice(0, max);
  const remainingCount = participants.length - max;

  return (
    <div className="flex items-center -space-x-1.5 overflow-hidden">
      {displayParticipants.map((user, idx) => (
        <Avatar
          key={user.id}
          className="w-5 h-5 rounded-full border border-white shadow-sm ring-1 ring-slate-100/50 shrink-0"
          style={{ zIndex: max - idx }}
        >
          <AvatarImage src={user.image || undefined} alt={user.name} className="object-cover" />
          <AvatarFallback className="bg-slate-100 text-slate-500 font-extrabold text-[6px]">
            {user.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      ))}

      {remainingCount > 0 && (
        <div className="w-5 h-5 rounded-full border border-white bg-slate-50 text-slate-400 font-extrabold text-[7px] flex items-center justify-center shadow-sm shrink-0 z-0">
          +{remainingCount}
        </div>
      )}
    </div>
  );
}
