import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Framez Social Media App Schema
 * Defines all database tables and their structure
 */
export default defineSchema({
  // Authentication tables from Convex Auth
  ...authTables,

  // Users table - extends auth users table with profile information
  users: defineTable({
    // Required auth fields
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    image: v.optional(v.string()),
    
    // Custom profile fields
    name: v.optional(v.string()),
    username: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    bio: v.optional(v.string()),
    followersCount: v.optional(v.number()),
    followingCount: v.optional(v.number()),
  })
    .index("email", ["email"])
    .index("by_username", ["username"]),

  // Posts table - stores user posts with captions and images
  posts: defineTable({
    authorId: v.id("users"),
    caption: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    likesCount: v.number(),
    commentsCount: v.number(),
  })
    .index("by_author", ["authorId"]),

  // Comments table - stores comments on posts
  comments: defineTable({
    postId: v.id("posts"),
    authorId: v.id("users"),
    text: v.string(),
    likesCount: v.optional(v.number()),
  })
    .index("by_post", ["postId"])
    .index("by_author", ["authorId"]),

  // Likes table - stores post likes
  likes: defineTable({
    postId: v.id("posts"),
    userId: v.id("users"),
  })
    .index("by_post", ["postId"])
    .index("by_user", ["userId"])
    .index("by_post_and_user", ["postId", "userId"]),

  // Comment likes table - stores comment likes
  commentLikes: defineTable({
    commentId: v.id("comments"),
    userId: v.id("users"),
  })
    .index("by_comment", ["commentId"])
    .index("by_user", ["userId"])
    .index("by_comment_and_user", ["commentId", "userId"]),

  // Follows table - stores follower/following relationships
  follows: defineTable({
    followerId: v.id("users"),
    followingId: v.id("users"),
  })
    .index("by_follower", ["followerId"])
    .index("by_following", ["followingId"])
    .index("by_follower_and_following", ["followerId", "followingId"]),
});
