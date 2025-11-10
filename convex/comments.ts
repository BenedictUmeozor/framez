import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { auth } from "./auth";

/**
 * Create a comment on a post
 */
export const createComment = mutation({
  args: {
    postId: v.id("posts"),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    if (!args.text.trim()) {
      throw new Error("Comment cannot be empty");
    }

    // Create the comment
    const commentId = await ctx.db.insert("comments", {
      postId: args.postId,
      authorId: userId,
      text: args.text.trim(),
      likesCount: 0,
    });

    // Increment the post's comment count
    const post = await ctx.db.get(args.postId);
    if (post) {
      await ctx.db.patch(args.postId, {
        commentsCount: post.commentsCount + 1,
      });
    }

    return commentId;
  },
});

/**
 * Get comments for a post
 */
export const getCommentsByPostId = query({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const comments = await ctx.db
      .query("comments")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .order("desc")
      .collect();

    // Enrich comments with author information
    const commentsWithAuthors = await Promise.all(
      comments.map(async (comment) => {
        const author = await ctx.db.get(comment.authorId);
        return {
          ...comment,
          author: author
            ? {
                _id: author._id,
                name: author.name,
                username: author.username,
                avatarUrl: author.avatarUrl,
              }
            : null,
        };
      })
    );

    return commentsWithAuthors;
  },
});

/**
 * Delete a comment
 */
export const deleteComment = mutation({
  args: {
    commentId: v.id("comments"),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const comment = await ctx.db.get(args.commentId);
    if (!comment) {
      throw new Error("Comment not found");
    }

    if (comment.authorId !== userId) {
      throw new Error("Not authorized to delete this comment");
    }

    // Decrement the post's comment count
    const post = await ctx.db.get(comment.postId);
    if (post && post.commentsCount > 0) {
      await ctx.db.patch(comment.postId, {
        commentsCount: post.commentsCount - 1,
      });
    }

    await ctx.db.delete(args.commentId);
  },
});
