import React, { useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { toast } from 'sonner';

interface SummaryAIProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SummaryAI({ isOpen, onClose }: SummaryAIProps) {
  const [summaryType, setSummaryType] = useState<'daily' | 'weekly'>('daily');
  const [summary, setSummary] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const tasks = useQuery(api.tasks.getUserTasks) || [];
  const generateSummary = useMutation(api.ai.generateSummary);

  const handleGenerateSummary = async () => {
    setIsGenerating(true);
    try {
      const result = await generateSummary({ type: summaryType });
      setSummary(result);
      toast.success('Summary generated!');
    } catch (error) {
      toast.error('Failed to generate summary');
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-mono font-semibold">AI Summary & Reflection</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-secondary p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-primary">{completedTasks}</div>
              <div className="text-sm text-muted-foreground">Tasks Completed</div>
            </div>
            <div className="bg-secondary p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-primary">{totalTasks}</div>
              <div className="text-sm text-muted-foreground">Total Tasks</div>
            </div>
            <div className="bg-secondary p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-primary">{completionRate}%</div>
              <div className="text-sm text-muted-foreground">Completion Rate</div>
            </div>
          </div>

          {/* Summary Type Selection */}
          <div className="flex gap-2">
            <button
              onClick={() => setSummaryType('daily')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                summaryType === 'daily'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              Today's Digest
            </button>
            <button
              onClick={() => setSummaryType('weekly')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                summaryType === 'weekly'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              Weekly Reflection
            </button>
          </div>

          {/* Generate Summary Button */}
          <button
            onClick={handleGenerateSummary}
            disabled={isGenerating}
            className="w-full bg-primary text-primary-foreground py-3 rounded-md font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {isGenerating ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Generating {summaryType} summary...
              </span>
            ) : (
              `Generate ${summaryType === 'daily' ? 'Today\'s' : 'Weekly'} Summary`
            )}
          </button>

          {/* Summary Display */}
          {summary && (
            <div className="bg-secondary p-4 rounded-lg">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                ✨ Your {summaryType === 'daily' ? 'Daily' : 'Weekly'} Summary
              </h3>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p className="whitespace-pre-wrap text-sm">{summary}</p>
              </div>
            </div>
          )}

          {/* Motivational Quote */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="font-medium mb-2 text-blue-900 dark:text-blue-100">💫 Daily Inspiration</h3>
            <p className="text-sm text-blue-800 dark:text-blue-200 italic">
              "Progress, not perfection. Every small step forward is a victory worth celebrating."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
