import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";

export function useFollowUser(userId: Id<"users"> | undefined) {
  const [isToggling, setIsToggling] = useState(false);
  const toggleFollowMutation = useMutation(api.follows.toggleFollow);
  const isFollowing = useQuery(
    api.follows.isFollowing,
    userId ? { userId } : "skip"
  );

  const toggleFollow = async () => {
    if (!userId || isToggling) return;

    try {
      setIsToggling(true);
      await toggleFollowMutation({ userId });
    } catch (error) {
      // Ignore errors
    } finally {
      setIsToggling(false);
    }
  };

  return {
    isFollowing: isFollowing ?? false,
    toggleFollow,
    isToggling,
  };
}
