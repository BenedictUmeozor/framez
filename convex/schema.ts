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

  // Users table - stores user profile information
  users: defineTable({
    name: v.string(),
    username: v.string(),
    email: v.string(),
    avatarUrl: v.optional(v.string()),
    bio: v.optional(v.string()),
    followersCount: v.number(),
    followingCount: v.number(),
    // tokenIdentifier links to auth system
    tokenIdentifier: v.optional(v.string()),
  })
    .index("by_email", ["email"])
    .index("by_username", ["username"])
    .index("by_token", ["tokenIdentifier"]),

  // Posts table - stores user posts with captions and images
  posts: defineTable({
    authorId: v.id("users"),
    caption: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    likesCount: v.number(),
    commentsCount: v.number(),
  })
    .index("by_author", ["authorId"])
    .index("by_creation_time", ["_creationTime"]),

  // Comments table - stores comments on posts
  comments: defineTable({
    postId: v.id("posts"),
    authorId: v.id("users"),
    text: v.string(),
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

  // Follows table - stores follower/following relationships
  follows: defineTable({
    followerId: v.id("users"),
    followingId: v.id("users"),
  })
    .index("by_follower", ["followerId"])
    .index("by_following", ["followingId"])
    .index("by_follower_and_following", ["followerId", "followingId"]),
});
