import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

/**
 * Get current authenticated user
 */
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }
    
    const user = await ctx.db.get(identity.subject as Id<"users">);
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
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    
    const userId = identity.subject as Id<"users">;

    // Check if username is already taken by another user
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .first();

    if (existingUser && existingUser._id !== userId) {
      throw new Error("Username already taken");
    }

    // Update user profile
    await ctx.db.patch(userId, {
      name: args.name,
      username: args.username,
      email: args.email,
      avatarUrl: args.avatarUrl,
      bio: args.bio,
      followersCount: 0,
      followingCount: 0,
    });

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
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    
    const userId = identity.subject as Id<"users">;

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
