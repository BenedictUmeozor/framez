import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { auth } from "./auth";

/**
 * Generate upload URL for post image
 */
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }
    return await ctx.storage.generateUploadUrl();
  },
});

/**
 * Create a new post
 */
export const createPost = mutation({
  args: {
    caption: v.optional(v.string()),
    imageStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // At least one of caption or image must be provided
    if (!args.caption && !args.imageStorageId) {
      throw new Error("Post must have either a caption or an image");
    }

    // Get image URL if storage ID is provided
    let imageUrl: string | undefined;
    if (args.imageStorageId) {
      const url = await ctx.storage.getUrl(args.imageStorageId);
      imageUrl = url ?? undefined;
    }

    const postId = await ctx.db.insert("posts", {
      authorId: userId,
      caption: args.caption,
      imageUrl: imageUrl,
      likesCount: 0,
      commentsCount: 0,
    });

    return postId;
  },
});

/**
 * Get all posts (feed)
 */
export const getAllPosts = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;
    
    const posts = await ctx.db
      .query("posts")
      .order("desc")
      .take(limit);

    // Enrich posts with author information
    const postsWithAuthors = await Promise.all(
      posts.map(async (post) => {
        const author = await ctx.db.get(post.authorId);
        return {
          ...post,
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

    return postsWithAuthors;
  },
});

/**
 * Get posts by user ID
 */
export const getPostsByUserId = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const posts = await ctx.db
      .query("posts")
      .withIndex("by_author", (q) => q.eq("authorId", args.userId))
      .order("desc")
      .collect();

    return posts;
  },
});

/**
 * Get a single post by ID
 */
export const getPostById = query({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);
    if (!post) {
      return null;
    }

    const author = await ctx.db.get(post.authorId);
    return {
      ...post,
      author: author
        ? {
            _id: author._id,
            name: author.name,
            username: author.username,
            avatarUrl: author.avatarUrl,
          }
        : null,
    };
  },
});

/**
 * Delete a post
 */
export const deletePost = mutation({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const post = await ctx.db.get(args.postId);
    if (!post) {
      throw new Error("Post not found");
    }

    if (post.authorId !== userId) {
      throw new Error("Not authorized to delete this post");
    }

    // Delete associated comments
    const comments = await ctx.db
      .query("comments")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .collect();
    
    for (const comment of comments) {
      await ctx.db.delete(comment._id);
    }

    // Delete associated likes
    const likes = await ctx.db
      .query("likes")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .collect();
    
    for (const like of likes) {
      await ctx.db.delete(like._id);
    }

    // Delete the post
    await ctx.db.delete(args.postId);
  },
});

/**
 * Update post caption
 */
export const updatePostCaption = mutation({
  args: {
    postId: v.id("posts"),
    caption: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const post = await ctx.db.get(args.postId);
    if (!post) {
      throw new Error("Post not found");
    }

    if (post.authorId !== userId) {
      throw new Error("Not authorized to update this post");
    }

    await ctx.db.patch(args.postId, {
      caption: args.caption,
    });
  },
});
