import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  tasks: defineTable({
    userId: v.id("users"),
    title: v.string(),
    description: v.optional(v.string()),
    category: v.union(
      v.literal("HEALTH"),
      v.literal("ACADEMICS"),
      v.literal("INTERNSHIP"),
      v.literal("COMMUNICATION"),
      v.literal("EMOTIONS")
    ),
    priority: v.union(
      v.literal("Very Important"),
      v.literal("Important"),
      v.literal("Optional")
    ),
    deadline: v.optional(v.string()),
    completed: v.boolean(),
    originalText: v.string(),
  }).index("by_user", ["userId"]),

  sessions: defineTable({
    userId: v.id("users"),
    originalInput: v.string(),
    parsedTasks: v.array(v.id("tasks")),
    mentalHealthSuggestions: v.optional(v.array(v.string())),
    distressDetected: v.boolean(),
  }).index("by_user", ["userId"]),

  healthEntries: defineTable({
    userId: v.id("users"),
    type: v.union(v.literal("medication"), v.literal("period"), v.literal("sleep")),
    data: v.object({
      name: v.optional(v.string()),
      time: v.optional(v.string()),
      taken: v.optional(v.boolean()),
      date: v.optional(v.string()),
      hours: v.optional(v.number()),
      quality: v.optional(v.string()),
      flow: v.optional(v.string()),
    }),
  }).index("by_user", ["userId"]),

  studyEntries: defineTable({
    userId: v.id("users"),
    course: v.string(),
    task: v.string(),
    due: v.string(),
    priority: v.union(v.literal("high"), v.literal("medium"), v.literal("low")),
    completed: v.boolean(),
  }).index("by_user", ["userId"]),

  contacts: defineTable({
    userId: v.id("users"),
    name: v.string(),
    lastContact: v.string(),
    contactType: v.union(v.literal("call"), v.literal("text"), v.literal("email")),
    priority: v.union(v.literal("high"), v.literal("medium"), v.literal("low")),
    notes: v.optional(v.string()),
  }).index("by_user", ["userId"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
