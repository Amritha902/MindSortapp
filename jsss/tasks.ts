import { v } from "convex/values";
import { query, mutation, action } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { api, internal } from "./_generated/api";

export const getUserTasks = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("tasks")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const toggleTaskComplete = mutation({
  args: { taskId: v.id("tasks") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const task = await ctx.db.get(args.taskId);
    if (!task || task.userId !== userId) {
      throw new Error("Task not found or unauthorized");
    }

    await ctx.db.patch(args.taskId, {
      completed: !task.completed,
    });
  },
});

export const deleteTask = mutation({
  args: { taskId: v.id("tasks") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const task = await ctx.db.get(args.taskId);
    if (!task || task.userId !== userId) {
      throw new Error("Task not found or unauthorized");
    }

    await ctx.db.delete(args.taskId);
  },
});

export const updateTask = mutation({
  args: {
    taskId: v.id("tasks"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    priority: v.optional(v.union(
      v.literal("Very Important"),
      v.literal("Important"),
      v.literal("Optional")
    )),
    deadline: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const task = await ctx.db.get(args.taskId);
    if (!task || task.userId !== userId) {
      throw new Error("Task not found or unauthorized");
    }

    const updates: any = {};
    if (args.title !== undefined) updates.title = args.title;
    if (args.description !== undefined) updates.description = args.description;
    if (args.priority !== undefined) updates.priority = args.priority;
    if (args.deadline !== undefined) updates.deadline = args.deadline;

    await ctx.db.patch(args.taskId, updates);
  },
});

export const processUserInput = action({
  args: { input: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Call the AI parsing action
    const result = await ctx.runAction(internal.ai.parseUserInput, {
      input: args.input,
    });

    // Store the session
    const sessionId = await ctx.runMutation(internal.tasks.createSession, {
      userId,
      originalInput: args.input,
      distressDetected: result.distressDetected,
      mentalHealthSuggestions: result.mentalHealthSuggestions,
    });

    // Create tasks
    const taskIds = [];
    for (const taskData of result.tasks) {
      const taskId = await ctx.runMutation(internal.tasks.createTask, {
        userId,
        ...taskData,
        originalText: args.input,
      });
      taskIds.push(taskId);
    }

    // Update session with task IDs
    await ctx.runMutation(internal.tasks.updateSessionTasks, {
      sessionId,
      taskIds,
    });

    return {
      tasks: result.tasks,
      mentalHealthSuggestions: result.mentalHealthSuggestions,
      distressDetected: result.distressDetected,
    };
  },
});

export const createTask = mutation({
  args: {
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
    originalText: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("tasks", {
      ...args,
      completed: false,
    });
  },
});

export const createSession = mutation({
  args: {
    userId: v.id("users"),
    originalInput: v.string(),
    distressDetected: v.boolean(),
    mentalHealthSuggestions: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("sessions", {
      ...args,
      parsedTasks: [],
    });
  },
});

export const updateSessionTasks = mutation({
  args: {
    sessionId: v.id("sessions"),
    taskIds: v.array(v.id("tasks")),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.sessionId, {
      parsedTasks: args.taskIds,
    });
  },
});
