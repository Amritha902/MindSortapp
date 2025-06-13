"use node";

import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: process.env.CONVEX_OPENAI_BASE_URL,
  apiKey: process.env.CONVEX_OPENAI_API_KEY,
});

export const parseUserInput = internalAction({
  args: { input: v.string() },
  handler: async (ctx, args) => {
    const systemPrompt = `You are MindSort, a compassionate AI that helps overwhelmed users organize their chaotic thoughts into structured tasks. You work with a multicrew system of specialized agents:

1. HEALTH Agent: Identifies medical appointments, symptoms, medication, periods, wellness needs
2. ACADEMICS Agent: Finds coursework, assignments, studying, exams, projects
3. INTERNSHIP Agent: Detects work tasks, deadlines, professional communications
4. COMMUNICATION Agent: Identifies calls, texts, emails, meetings to schedule
5. EMOTIONS Agent: Recognizes stress, anxiety, overwhelm, and emotional needs

For each user input:
1. Extract individual tasks and concerns
2. Categorize each into: HEALTH, ACADEMICS, INTERNSHIP, COMMUNICATION, or EMOTIONS
3. Assign priority: "Very Important", "Important", or "Optional"
4. Extract any dates/deadlines mentioned
5. Detect emotional distress indicators
6. If distress detected, provide 2-3 kind, supportive mental health suggestions

Respond in JSON format:
{
  "tasks": [
    {
      "title": "Brief task title",
      "description": "More details if needed",
      "category": "HEALTH|ACADEMICS|INTERNSHIP|COMMUNICATION|EMOTIONS",
      "priority": "Very Important|Important|Optional",
      "deadline": "extracted date or null"
    }
  ],
  "distressDetected": boolean,
  "mentalHealthSuggestions": ["suggestion1", "suggestion2"] or null
}

Be empathetic and supportive. Turn chaos into clarity.`;

    const userPrompt = `Please parse this user input and organize it into tasks: "${args.input}"`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "user", content: summaryPrompt }
        ],
        temperature: 0.7,
      });

      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error("No response from AI");
      }

      return content;
    } catch (error) {
      console.error("Summary generation error:", error);
      
      // Fallback summary
      return `${args.type === 'daily' ? 'Today' : 'This week'} you've made progress on ${completedTasks.length} tasks and have ${pendingTasks.length} items to focus on. Remember, every step forward counts. You're doing better than you think! 💙`;
    }
  },
}); openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.3,
      });

      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error("No response from AI");
      }

      // Parse the JSON response
      const parsed = JSON.parse(content);
      
      return {
        tasks: parsed.tasks || [],
        distressDetected: parsed.distressDetected || false,
        mentalHealthSuggestions: parsed.mentalHealthSuggestions || [],
      };
    } catch (error) {
      console.error("AI parsing error:", error);
      
      // Fallback: create a simple task from the input
      return {
        tasks: [{
          title: args.input.slice(0, 50) + (args.input.length > 50 ? "..." : ""),
          description: args.input,
          category: "EMOTIONS" as const,
          priority: "Important" as const,
          deadline: null,
        }],
        distressDetected: true,
        mentalHealthSuggestions: [
          "Take a deep breath and remember that it's okay to feel overwhelmed",
          "Consider breaking down your tasks into smaller, manageable steps",
          "Don't forget to take care of your basic needs - rest, food, and hydration"
        ],
      };
    }
  },
});
