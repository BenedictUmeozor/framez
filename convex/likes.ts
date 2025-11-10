import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { auth } from "./auth";

/**
 * Toggle like on a post
 */
export const togglePostLike = mutation({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Check if user already liked this post
    const existingLike = await ctx.db
      .query("likes")
      .withIndex("by_post_and_user", (q) =>
        q.eq("postId", args.postId).eq("userId", userId)
      )
      .first();

    if (existingLike) {
      // Unlike: remove the like
      await ctx.db.delete(existingLike._id);

      // Decrement the post's like count
      const post = await ctx.db.get(args.postId);
      if (post && post.likesCount > 0) {
        await ctx.db.patch(args.postId, {
          likesCount: post.likesCount - 1,
        });
      }

      return { liked: false };
    } else {
      // Like: create a new like
      await ctx.db.insert("likes", {
        postId: args.postId,
        userId: userId,
      });

      // Increment the post's like count
      const post = await ctx.db.get(args.postId);
      if (post) {
        await ctx.db.patch(args.postId, {
          likesCount: post.likesCount + 1,
        });
      }

      return { liked: true };
    }
  },
});

/**
 * Check if current user has liked a post
 */
export const hasLikedPost = query({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      return false;
    }

    const like = await ctx.db
      .query("likes")
      .withIndex("by_post_and_user", (q) =>
        q.eq("postId", args.postId).eq("userId", userId)
      )
      .first();

    return !!like;
  },
});

/**
 * Get all posts liked by current user (for checking multiple posts at once)
 */
export const getLikedPostIds = query({
  args: {
    postIds: v.array(v.id("posts")),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      return [];
    }

    const likes = await ctx.db
      .query("likes")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    // Filter to only include likes for the requested posts
    const likedPostIds = likes
      .filter((like) => args.postIds.includes(like.postId))
      .map((like) => like.postId);

    return likedPostIds;
  },
});

/**
 * Get users who liked a post
 */
export const getPostLikes = query({
  args: {
    postId: v.id("posts"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;

    const likes = await ctx.db
      .query("likes")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .take(limit);

    // Enrich with user information
    const likesWithUsers = await Promise.all(
      likes.map(async (like) => {
        const user = await ctx.db.get(like.userId);
        return {
          ...like,
          user: user
            ? {
                _id: user._id,
                name: user.name,
                username: user.username,
                avatarUrl: user.avatarUrl,
              }
            : null,
        };
      })
    );

    return likesWithUsers;
  },
});

/**
 * Toggle like on a comment
 */
export const toggleCommentLike = mutation({
  args: {
    commentId: v.id("comments"),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Check if user already liked this comment
    const existingLike = await ctx.db
      .query("commentLikes")
      .withIndex("by_comment_and_user", (q) =>
        q.eq("commentId", args.commentId).eq("userId", userId)
      )
      .first();

    if (existingLike) {
      // Unlike: remove the like
      await ctx.db.delete(existingLike._id);

      // Decrement the comment's like count
      const comment = await ctx.db.get(args.commentId);
      if (comment && (comment.likesCount ?? 0) > 0) {
        await ctx.db.patch(args.commentId, {
          likesCount: (comment.likesCount ?? 0) - 1,
        });
      }

      return { liked: false };
    } else {
      // Like: create a new like
      await ctx.db.insert("commentLikes", {
        commentId: args.commentId,
        userId: userId,
      });

      // Increment the comment's like count
      const comment = await ctx.db.get(args.commentId);
      if (comment) {
        await ctx.db.patch(args.commentId, {
          likesCount: (comment.likesCount ?? 0) + 1,
        });
      }

      return { liked: true };
    }
  },
});

/**
 * Check if current user has liked a comment
 */
export const hasLikedComment = query({
  args: {
    commentId: v.id("comments"),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      return false;
    }

    const like = await ctx.db
      .query("commentLikes")
      .withIndex("by_comment_and_user", (q) =>
        q.eq("commentId", args.commentId).eq("userId", userId)
      )
      .first();

    return !!like;
  },
});

/**
 * Get all comments liked by current user (for checking multiple comments at once)
 */
export const getLikedCommentIds = query({
  args: {
    commentIds: v.array(v.id("comments")),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      return [];
    }

    const likes = await ctx.db
      .query("commentLikes")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    // Filter to only include likes for the requested comments
    const likedCommentIds = likes
      .filter((like) => args.commentIds.includes(like.commentId))
      .map((like) => like.commentId);

    return likedCommentIds;
  },
});
