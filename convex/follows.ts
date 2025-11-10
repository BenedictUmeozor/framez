import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { auth } from "./auth";

/**
 * Toggle follow/unfollow a user
 */
export const toggleFollow = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const currentUserId = await auth.getUserId(ctx);
    if (!currentUserId) {
      throw new Error("Not authenticated");
    }

    // Can't follow yourself
    if (currentUserId === args.userId) {
      throw new Error("Cannot follow yourself");
    }

    // Check if already following
    const existingFollow = await ctx.db
      .query("follows")
      .withIndex("by_follower_and_following", (q) =>
        q.eq("followerId", currentUserId).eq("followingId", args.userId)
      )
      .first();

    if (existingFollow) {
      // Unfollow: remove the follow relationship
      await ctx.db.delete(existingFollow._id);

      // Decrement follower count for the user being unfollowed
      const targetUser = await ctx.db.get(args.userId);
      if (targetUser && (targetUser.followersCount ?? 0) > 0) {
        await ctx.db.patch(args.userId, {
          followersCount: (targetUser.followersCount ?? 0) - 1,
        });
      }

      // Decrement following count for current user
      const currentUser = await ctx.db.get(currentUserId);
      if (currentUser && (currentUser.followingCount ?? 0) > 0) {
        await ctx.db.patch(currentUserId, {
          followingCount: (currentUser.followingCount ?? 0) - 1,
        });
      }

      return { following: false };
    } else {
      // Follow: create a new follow relationship
      await ctx.db.insert("follows", {
        followerId: currentUserId,
        followingId: args.userId,
      });

      // Increment follower count for the user being followed
      const targetUser = await ctx.db.get(args.userId);
      if (targetUser) {
        await ctx.db.patch(args.userId, {
          followersCount: (targetUser.followersCount ?? 0) + 1,
        });
      }

      // Increment following count for current user
      const currentUser = await ctx.db.get(currentUserId);
      if (currentUser) {
        await ctx.db.patch(currentUserId, {
          followingCount: (currentUser.followingCount ?? 0) + 1,
        });
      }

      return { following: true };
    }
  },
});

/**
 * Check if current user is following a specific user
 */
export const isFollowing = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const currentUserId = await auth.getUserId(ctx);
    if (!currentUserId) {
      return false;
    }

    const follow = await ctx.db
      .query("follows")
      .withIndex("by_follower_and_following", (q) =>
        q.eq("followerId", currentUserId).eq("followingId", args.userId)
      )
      .first();

    return !!follow;
  },
});

/**
 * Get followers of a user
 */
export const getFollowers = query({
  args: {
    userId: v.id("users"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;

    const follows = await ctx.db
      .query("follows")
      .withIndex("by_following", (q) => q.eq("followingId", args.userId))
      .take(limit);

    // Enrich with follower user information
    const followers = await Promise.all(
      follows.map(async (follow) => {
        const follower = await ctx.db.get(follow.followerId);
        return follower
          ? {
              _id: follower._id,
              name: follower.name,
              username: follower.username,
              avatarUrl: follower.avatarUrl,
              bio: follower.bio,
              followersCount: follower.followersCount,
              followingCount: follower.followingCount,
            }
          : null;
      })
    );

    return followers.filter((f) => f !== null);
  },
});

/**
 * Get users that a user is following
 */
export const getFollowing = query({
  args: {
    userId: v.id("users"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;

    const follows = await ctx.db
      .query("follows")
      .withIndex("by_follower", (q) => q.eq("followerId", args.userId))
      .take(limit);

    // Enrich with following user information
    const following = await Promise.all(
      follows.map(async (follow) => {
        const user = await ctx.db.get(follow.followingId);
        return user
          ? {
              _id: user._id,
              name: user.name,
              username: user.username,
              avatarUrl: user.avatarUrl,
              bio: user.bio,
              followersCount: user.followersCount,
              followingCount: user.followingCount,
            }
          : null;
      })
    );

    return following.filter((f) => f !== null);
  },
});

/**
 * Get follow stats for a user
 */
export const getFollowStats = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      return {
        followersCount: 0,
        followingCount: 0,
      };
    }

    return {
      followersCount: user.followersCount ?? 0,
      followingCount: user.followingCount ?? 0,
    };
  },
});
