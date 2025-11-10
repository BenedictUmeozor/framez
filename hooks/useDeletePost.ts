import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { useState } from "react";
import Toast from "react-native-toast-message";

export function useDeletePost() {
  const [isDeleting, setIsDeleting] = useState(false);
  const deletePostMutation = useMutation(api.posts.deletePost);

  const deletePost = async (postId: Id<"posts">) => {
    try {
      setIsDeleting(true);
      await deletePostMutation({ postId });

      Toast.show({
        type: "success",
        text1: "Post deleted",
        position: "top",
        visibilityTime: 2000,
      });

      return true;
    } catch (error) {
      console.error("Error deleting post:", error);
      Toast.show({
        type: "error",
        text1: "Failed to delete post",
        text2: error instanceof Error ? error.message : "Please try again",
        position: "top",
        visibilityTime: 3000,
      });
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return { deletePost, isDeleting };
}
