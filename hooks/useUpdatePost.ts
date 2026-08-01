import { useState } from "react";
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

type Post = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  isLiked?: boolean;
  comments?: Comment[];
  author: {
    id?: string;
    name: string;
    image: string | null;
  };
  _count: {
    likes: number;
    comments: number;
  };
};

export function useUpdatePost(
  post: Post,
  onUpdateSuccess: (postId: string, updatedFields: Partial<Post>) => void
) {
  const [isSaving, setIsSaving] = useState(false);

  const updatePost = async (title: string, content: string) => {
    if (title.trim().length < 3) {
      toast.error("Title must be at least 3 characters");
      return false;
    }
    if (content.trim().length < 10) {
      toast.error("Content must be at least 10 characters");
      return false;
    }

    setIsSaving(true);

    const prevTitle = post.title;
    const prevContent = post.content;

    // Optimistically update parent list state
    onUpdateSuccess(post.id, { title, content });

    try {
      const res = await fetch(`/api/posts/${post.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to update post");
      }

      toast.success("Post updated successfully!");
      return true;
    } catch (error: any) {
      // Rollback parent list state on failure
      onUpdateSuccess(post.id, { title: prevTitle, content: prevContent });
      toast.error(error.message || "Failed to save updates");
      console.error(error);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return { isSaving, updatePost };
}
