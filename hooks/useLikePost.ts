import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";

export function useLikePost(postId: Id<"posts"> | undefined) {
  const [isToggling, setIsToggling] = useState(false);
  const toggleLikeMutation = useMutation(api.likes.togglePostLike);
  const hasLiked = useQuery(
    api.likes.hasLikedPost,
    postId ? { postId } : "skip"
  );

  const toggleLike = async () => {
    if (!postId || isToggling) return;

    try {
      setIsToggling(true);
      await toggleLikeMutation({ postId });
    } catch (error) {
      // Ignore errors
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
