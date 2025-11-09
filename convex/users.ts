import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { auth } from "./auth";

/**
 * Get current authenticated user
 */
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      return null;
    }
    
    const user = await ctx.db.get(userId);
    return user;
  },
});

/**
 * Create or update user profile after authentication
 */
export const createOrUpdateUser = mutation({
  args: {
    name: v.string(),
    username: v.string(),
    email: v.string(),
    avatarUrl: v.optional(v.string()),
    bio: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Check if username is already taken by another user
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .first();

    if (existingUser && existingUser._id !== userId) {
      throw new Error("Username already taken");
    }

    // Try to get the user document
    let user = await ctx.db.get(userId);
    let retries = 0;
    const maxRetries = 5;
    
    // Retry logic in case user document is still being created
    while (!user && retries < maxRetries) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      user = await ctx.db.get(userId);
      retries++;
    }
    
    if (user) {
      // Update existing user profile
      await ctx.db.patch(userId, {
        name: args.name,
        username: args.username,
        email: args.email,
        avatarUrl: args.avatarUrl,
        bio: args.bio,
        followersCount: user.followersCount ?? 0,
        followingCount: user.followingCount ?? 0,
      });
    } else {
      // User document still doesn't exist, throw error
      throw new Error("User document not found. Please try logging in again.");
    }

    return userId;
  },
});

/**
 * Get user by ID
 */
export const getUserById = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});

/**
 * Get user by username
 */
export const getUserByUsername = query({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .first();
  },
});

/**
 * Check if username is available
 */
export const checkUsernameAvailable = query({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    if (!args.username || args.username.length < 3) {
      return { available: false, message: "Username must be at least 3 characters" };
    }

    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .first();

    return {
      available: !existingUser,
      message: existingUser ? "Username already taken" : "Username available",
    };
  },
});

/**
 * Check if email is available
 */
export const checkEmailAvailable = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", args.email))
      .first();

    return {
      available: !existingUser,
      message: existingUser ? "Email already registered" : "Email available",
    };
  },
});

/**
 * Update user profile
 */
export const updateProfile = mutation({
  args: {
    name: v.optional(v.string()),
    username: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    bio: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // If username is being updated, check if it's available
    if (args.username) {
      const existingUser = await ctx.db
        .query("users")
        .withIndex("by_username", (q) => q.eq("username", args.username))
        .first();

      if (existingUser && existingUser._id !== userId) {
        throw new Error("Username already taken");
      }
    }

    await ctx.db.patch(userId, args);
    return userId;
  },
});
