import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { useState } from "react";
import Toast from "react-native-toast-message";

export function useCreateComment() {
  const [isCreating, setIsCreating] = useState(false);
  const createCommentMutation = useMutation(api.comments.createComment);

  const createComment = async (postId: Id<"posts">, text: string) => {
    if (!text.trim()) {
      Toast.show({
        type: "error",
        text1: "Comment cannot be empty",
        position: "top",
        visibilityTime: 3000,
      });
      return null;
    }

    try {
      setIsCreating(true);
      const commentId = await createCommentMutation({
        postId,
        text: text.trim(),
      });

      Toast.show({
        type: "success",
        text1: "Comment posted",
        position: "top",
        visibilityTime: 2000,
      });

      return commentId;
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Failed to post comment",
        text2: error instanceof Error ? error.message : "Please try again",
        position: "top",
        visibilityTime: 3000,
      });
      return null;
    } finally {
      setIsCreating(false);
    }
  };

  return { createComment, isCreating };
}
