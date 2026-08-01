import { useState } from "react";
import { toast } from "sonner";

export function useLikePost(postId: string, initialIsLiked: boolean, initialLikesCount: number) {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [isLiking, setIsLiking] = useState(false);

  const toggleLike = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (isLiking) return;

    const wasLiked = isLiked;
    const prevCount = likesCount;

    setIsLiked(!wasLiked);
    setLikesCount((prev) => (wasLiked ? prev - 1 : prev + 1));
    setIsLiking(true);

    try {
      const res = await fetch(`/api/posts/${postId}/like`, {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error("Failed to like post");
      }

      const data = await res.json();
      if (data.success && data.liked !== undefined) {
        setIsLiked(data.liked);
      }
    } catch (error) {
      setIsLiked(wasLiked);
      setLikesCount(prevCount);
      toast.error("Failed to update like status");
      console.error(error);
    } finally {
      setIsLiking(false);
    }
  };

  return { isLiked, likesCount, isLiking, toggleLike };
}
