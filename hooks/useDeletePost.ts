import { useState } from "react";
import { toast } from "sonner";

export function useDeletePost(
  postId: string,
  onDeleteSuccess: (postId: string) => void
) {
  const [isDeleting, setIsDeleting] = useState(false);

  const deletePost = async (): Promise<void> => {
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to delete post");
      }

      toast.success("Post deleted successfully");

      onDeleteSuccess(postId);
    } catch (error: any) {
      toast.error(error.message || "Failed to delete post");

      console.error(error);

      throw error;
    } finally {
      setIsDeleting(false);
    }
  };

  return { isDeleting, deletePost };
}