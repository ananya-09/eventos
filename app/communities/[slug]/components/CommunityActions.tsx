"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { UserPlus, LogOut, PenSquare, ChevronDown, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import ConfirmModal from "@/components/ui/confirm-modal";

export default function CommunityActions({ 
  slug, 
  initialIsJoined = false 
}: { 
  slug: string; 
  initialIsJoined?: boolean;
}) {
  const router = useRouter();
  const [isJoined, setIsJoined] = useState(initialIsJoined);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleMembership = async () => {
    if (isLoading) return;
    
    // 1. Immediately close the modal to kick off Framer Motion's exit animation
    setIsModalOpen(false);
    
    // 2. Wait 180ms for the modal backdrop & panel to fully unmount from the DOM
    await new Promise((resolve) => setTimeout(resolve, 180));
    
    // 3. Initiate loading state and trigger optimistic updates
    setIsLoading(true);
    const previousState = isJoined;
    setIsJoined(!isJoined);

    try {
      const endpoint = previousState 
        ? `/api/communities/${slug}/leave` 
        : `/api/communities/${slug}/join`;

      const res = await fetch(endpoint, {
        method: "POST",
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to toggle join status");
      }

      const data = await res.json();
      
      // 4. Sync with server state
      if (data.success !== undefined) {
        setIsJoined(data.joined ?? !previousState);
        
        // 5. Display high-fidelity feedback
        toast.success(data.message || (!previousState ? "Joined community!" : "Left community"));
        
        // 6. Safely synchronize client component states with server components
        // router.refresh();
      }
    } catch (error: any) {
      // Revert optimistic update on failure
      setIsJoined(previousState);
      toast.error(error.message || "Something went wrong. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleButtonClick = () => {
    if (isJoined) {
      // Open confirmation modal if already a member
      setIsModalOpen(true);
    } else {
      // Instantly join if not a member
      toggleMembership();
    }
  };

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-3 relative z-20"
      >
        {/* GDG Lucknow Styled Membership Trigger */}
        <button
          onClick={handleButtonClick}
          disabled={isLoading}
          className={`px-5 py-2 rounded-full font-bold text-sm border transition-all flex items-center gap-2 cursor-pointer shadow-sm ${
            isJoined 
              ? "bg-[#e8f0fe] text-[#1a73e8] border-[#adccf9] hover:bg-[#d2e3fc]"
              : "bg-[#1a73e8] text-white border-transparent hover:bg-[#1557b0] hover:shadow-md"
          } ${isLoading ? "opacity-75 cursor-not-allowed" : ""}`}
        >
          {isJoined ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Joined</span>
              <ChevronDown className="w-3.5 h-3.5 ml-0.5 opacity-80" />
            </>
          ) : (
            <>
              <UserPlus className="w-3.5 h-3.5" />
              <span>Join</span>
            </>
          )}
        </button>
        
        {/* Create Post Action Button */}
        <button
          className="px-5 py-2 rounded-full bg-slate-900 text-white font-bold text-sm shadow-sm hover:bg-slate-800 hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <PenSquare className="w-3.5 h-3.5" />
          <span>Post</span>
        </button>
      </motion.div>

      <ConfirmModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={toggleMembership}
        isLoading={isLoading}
        title="Leave Community"
        description="Are you sure you want to leave this community? You will no longer receive updates and your membership status will be removed."
        confirmText="Leave Community"
        cancelText="Cancel"
        variant="danger"
        icon={<LogOut className="w-5 h-5" />}
      />
    </>
  );
}
