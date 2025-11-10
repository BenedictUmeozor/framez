import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";

export function useLikeComment(commentId: Id<"comments"> | undefined) {
  const [isToggling, setIsToggling] = useState(false);
  const toggleLikeMutation = useMutation(api.likes.toggleCommentLike);
  const hasLiked = useQuery(
    api.likes.hasLikedComment,
    commentId ? { commentId } : "skip"
  );

  const toggleLike = async () => {
    if (!commentId || isToggling) return;

    try {
      setIsToggling(true);
      await toggleLikeMutation({ commentId });
    } catch (error) {
      console.error("Error toggling comment like:", error);
    } finally {
      setIsToggling(false);
    }
  };

  return {
    hasLiked: hasLiked ?? false,
    toggleLike,
    isToggling,
  };
}
