import { useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

type Comment = {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
    image: string | null;
  };
};

export function useCreateComment(
  postId: string,
  initialComments: Comment[],
  initialCommentsCount: number
) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [commentsCount, setCommentsCount] = useState(initialCommentsCount);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addComment = async (content: string) => {
    if (!session) {
      toast.error("You must be logged in to comment");
      return false;
    }
    if (content.trim().length < 2) {
      toast.error("Comment must be at least 2 characters");
      return false;
    }

    setIsSubmitting(true);

    const tempId = `temp-${Date.now()}`;
    const optimisticComment: Comment = {
      id: tempId,
      content,
      createdAt: new Date().toISOString(),
      author: {
        id: session.user?.email || "temp-id",
        name: session.user?.name || "Community Member",
        image: session.user?.image || null,
      },
    };

    // Optimistic Update
    setComments((prev) => [optimisticComment, ...prev]);
    setCommentsCount((prev) => prev + 1);

    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to submit comment");
      }

      setComments((prev) =>
        prev.map((c) => (c.id === tempId ? data.comment : c))
      );
      return true;
    } catch (error: any) {
      // Rollback
      setComments((prev) => prev.filter((c) => c.id !== tempId));
      setCommentsCount((prev) => prev - 1);
      toast.error(error.message || "Failed to post comment");
      console.error(error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { comments, commentsCount, isSubmitting, addComment, setComments };
}
