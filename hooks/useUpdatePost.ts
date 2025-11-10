import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { useState } from "react";
import Toast from "react-native-toast-message";

export function useUpdatePost() {
  const [isUpdating, setIsUpdating] = useState(false);
  const updatePostMutation = useMutation(api.posts.updatePostCaption);

  const updatePost = async (postId: Id<"posts">, caption: string) => {
    try {
      setIsUpdating(true);
      await updatePostMutation({ postId, caption });

      Toast.show({
        type: "success",
        text1: "Post updated",
        position: "top",
        visibilityTime: 2000,
      });

      return true;
    } catch (error) {
      console.error("Error updating post:", error);
      Toast.show({
        type: "error",
        text1: "Failed to update post",
        text2: error instanceof Error ? error.message : "Please try again",
        position: "top",
        visibilityTime: 3000,
      });
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  return { updatePost, isUpdating };
}
