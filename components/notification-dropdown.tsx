"use client";

import React, { useState, useEffect, useRef } from "react";
import { Bell, CheckCheck, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Image from "next/image";

interface NotificationItem {
  id: string;
  userId: string;
  notifierId: string | null;
  type: string;
  entityType: string;
  entityId: string;
  postId: string | null;
  commentId: string | null;
  isRead: boolean;
  metadata: any;
  createdAt: string;
  notifier: {
    id: string;
    name: string;
    image: string | null;
  } | null;
  post: {
    id: string;
    title: string;
    community: {
      slug: string;
    };
  } | null;
}

export default function NotificationDropdown() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch initial notifications and count
  const fetchNotifications = async (isPoll = false) => {
    if (!session) return;
    if (!isPoll && notifications.length === 0) setIsLoading(true);

    try {
      const res = await fetch("/api/notifications?limit=8");
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setNotifications(data.notifications);
          setUnreadCount(data.unreadCount);
          setNextCursor(data.nextCursor);
        }
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load more notifications (pagination)
  const loadMore = async () => {
    if (!nextCursor || isLoadingMore) return;
    setIsLoadingMore(true);

    try {
      const res = await fetch(`/api/notifications?limit=8&cursor=${nextCursor}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setNotifications((prev) => [...prev, ...data.notifications]);
          setNextCursor(data.nextCursor);
        }
      }
    } catch (err) {
      console.error("Error loading more notifications:", err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const res = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ all: true }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
          setUnreadCount(0);
          toast.success("All notifications marked as read");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Could not mark notifications as read");
    }
  };

  // Click on a notification: mark read and navigate
  const handleNotificationClick = async (notif: NotificationItem) => {
    setIsOpen(false);
    
    // Optimistically mark as read in local state
    if (!notif.isRead) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));

      // Fire mark-as-read call to database
      fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationIds: [notif.id] }),
      }).catch(console.error);
    }

    // Determine target URL for redirection
    if (notif.postId && notif.post?.community?.slug) {
      router.push(`/communities/${notif.post.community.slug}/threads/${notif.postId}`);
    } else {
      router.push("/communities");
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Background Polling (Reddit/X style async sync every 30 seconds)
  useEffect(() => {
    if (!session) return;
    fetchNotifications();

    const interval = setInterval(() => {
      fetchNotifications(true);
    }, 30000);

    return () => clearInterval(interval);
  }, [session]);

  if (!session) return null;

  // Format dynamic notification message content
  const renderNotificationMessage = (notif: NotificationItem) => {
    const actorName = notif.notifier?.name || "Someone";
    const likeCount = notif.metadata?.count || 1;
    
    switch (notif.type) {
      case "REPLY":
        return (
          <span>
            <strong className="font-bold text-slate-800 dark:text-slate-100">{actorName}</strong> replied to your thread:{" "}
            <span className="italic text-slate-500">"{notif.metadata?.bodySnippet || ""}"</span>
          </span>
        );
      case "MENTION":
        return (
          <span>
            <strong className="font-bold text-slate-800 dark:text-slate-100">{actorName}</strong> mentioned you in a {notif.commentId ? "reply" : "thread"}:{" "}
            <span className="italic text-slate-500">"{notif.metadata?.bodySnippet || ""}"</span>
          </span>
        );
      case "LIKE":
        return (
          <span>
            <strong className="font-bold text-slate-800 dark:text-slate-100">{actorName}</strong>
            {likeCount > 1 ? ` and ${likeCount - 1} others` : ""} liked your post.
          </span>
        );
      case "THREAD_ACTIVITY":
        return (
          <span>
            New activity on watched thread{" "}
            <strong className="font-bold text-slate-800 dark:text-slate-100">
              {notif.post?.title ? `"${notif.post.title}"` : ""}
            </strong>
          </span>
        );
      case "ANNOUNCEMENT":
        return (
          <span>
            Community Announcement:{" "}
            <strong className="font-bold text-slate-800 dark:text-slate-100">
              {notif.metadata?.title || "Update"}
            </strong>
          </span>
        );
      case "MODERATION":
        return (
          <span className="text-rose-500 font-medium">
            Moderator Action: {notif.metadata?.reason || "Rules violation check"}
          </span>
        );
      default:
        return <span>New activity recorded.</span>;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-650 dark:text-slate-350 transition-colors focus:outline-none"
        aria-label="View notifications"
      >
        <Bell className="w-5 h-5" strokeWidth={1.8} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-extrabold text-white animate-in zoom-in duration-300">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Card */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2.5 w-80 md:w-96 max-w-[calc(100vw-2rem)] z-50 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden"
        >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-150/50 dark:border-slate-800/50">
              <span className="text-sm font-bold text-slate-850 dark:text-slate-100">
                Notifications
              </span>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-[#34629f] dark:text-sky-400 hover:underline cursor-pointer focus:outline-none"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Mark all read</span>
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="max-h-[360px] overflow-y-auto divide-y divide-slate-100/60 dark:divide-slate-800/40">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-2">
                  <Loader2 className="w-6 h-6 animate-spin text-[#34629f]" />
                  <span className="text-xs text-slate-400">Loading inbox...</span>
                </div>
              ) : notifications.length > 0 ? (
                <>
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => handleNotificationClick(notif)}
                      className={`flex gap-3 px-4 py-3.5 hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors cursor-pointer select-none relative ${
                        !notif.isRead ? "bg-slate-50/30 dark:bg-slate-800/10" : ""
                      }`}
                    >
                      {/* Unread indicator bar */}
                      {!notif.isRead && (
                        <div className="absolute left-0 top-0 bottom-0 w-0.75 bg-[#34629f] dark:bg-sky-400" />
                      )}

                      {/* Notifier Avatar */}
                      <div className="relative w-8 h-8 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 shrink-0">
                        {notif.notifier?.image ? (
                          <Image
                            src={notif.notifier.image}
                            alt="avatar"
                            fill
                            className="object-cover"
                            sizes="32px"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-slate-400 to-slate-500 flex items-center justify-center text-white font-bold text-xs">
                            {notif.notifier?.name?.charAt(0).toUpperCase() || "?"}
                          </div>
                        )}
                      </div>

                      {/* Notification details */}
                      <div className="flex-1 min-w-0 text-xs">
                        <div className="leading-normal text-slate-650 dark:text-slate-300">
                          {renderNotificationMessage(notif)}
                        </div>
                        <span className="block mt-1 text-[10px] text-slate-400">
                          {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  ))}

                  {/* Load More Button */}
                  {nextCursor && (
                    <div className="p-2 flex justify-center">
                      <Button
                        onClick={loadMore}
                        disabled={isLoadingMore}
                        variant="ghost"
                        size="sm"
                        className="text-[10px] text-slate-500 font-bold hover:text-[#34629f]"
                      >
                        {isLoadingMore ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <span>Load older notifications</span>
                        )}
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center px-4 space-y-3">
                  <div className="p-3 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-400">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <span className="block text-xs font-bold text-slate-700 dark:text-slate-350">
                      Inbox is empty
                    </span>
                    <span className="block text-[10px] text-slate-450 dark:text-slate-400 max-w-[200px] mx-auto">
                      We will notify you here when you receive replies, likes, or mentions.
                    </span>
                  </div>
                </div>
              )}
            </div>
        </div>
      )}
    </div>
  );
}
