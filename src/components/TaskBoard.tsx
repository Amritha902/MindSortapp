import React, { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { TaskCard } from './TaskCard';
import { TaskFilters } from './TaskFilters';
import { Id } from '../../convex/_generated/dataModel';

interface Task {
  _id: Id<"tasks">;
  title: string;
  description?: string;
  category: "HEALTH" | "ACADEMICS" | "INTERNSHIP" | "COMMUNICATION" | "EMOTIONS";
  priority: "Very Important" | "Important" | "Optional";
  deadline?: string;
  completed: boolean;
  originalText: string;
}

interface TaskBoardProps {
  tasks: Task[];
}

const categoryColors = {
  HEALTH: 'bg-red-100 dark:bg-red-950/20 border-red-200 dark:border-red-800',
  ACADEMICS: 'bg-blue-100 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800',
  INTERNSHIP: 'bg-green-100 dark:bg-green-950/20 border-green-200 dark:border-green-800',
  COMMUNICATION: 'bg-yellow-100 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800',
  EMOTIONS: 'bg-purple-100 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800',
};

const categoryIcons = {
  HEALTH: '🏥',
  ACADEMICS: '📚',
  INTERNSHIP: '💼',
  COMMUNICATION: '💬',
  EMOTIONS: '💙',
};

export function TaskBoard({ tasks }: TaskBoardProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [showCompleted, setShowCompleted] = useState(true);

  const toggleComplete = useMutation(api.tasks.toggleTaskComplete);
  const deleteTask = useMutation(api.tasks.deleteTask);

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    if (selectedCategory !== 'all' && task.category !== selectedCategory) return false;
    if (selectedPriority !== 'all' && task.priority !== selectedPriority) return false;
    if (!showCompleted && task.completed) return false;
    return true;
  });

  // Group tasks by category
  const groupedTasks = filteredTasks.reduce((acc, task) => {
    if (!acc[task.category]) {
      acc[task.category] = [];
    }
    acc[task.category].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  const categories = Object.keys(groupedTasks) as Array<keyof typeof categoryColors>;

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🧠</div>
        <h3 className="text-lg font-medium mb-2">Ready to organize your thoughts?</h3>
        <p className="text-muted-foreground">
          Share what's on your mind above, and I'll help you sort it out.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TaskFilters
        selectedCategory={selectedCategory}
        selectedPriority={selectedPriority}
        showCompleted={showCompleted}
        onCategoryChange={setSelectedCategory}
        onPriorityChange={setSelectedPriority}
        onShowCompletedChange={setShowCompleted}
        taskCounts={tasks.reduce((acc, task) => {
          acc[task.category] = (acc[task.category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)}
      />

      {filteredTasks.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No tasks match your current filters.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map(category => (
            <div key={category} className={`rounded-lg border p-4 ${categoryColors[category]}`}>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">{categoryIcons[category]}</span>
                <h2 className="font-mono font-semibold text-lg">{category}</h2>
                <span className="ml-auto bg-white/50 dark:bg-black/20 px-2 py-1 rounded-full text-xs font-medium">
                  {groupedTasks[category].length}
                </span>
              </div>
              
              <div className="space-y-3">
                {groupedTasks[category]
                  .sort((a, b) => {
                    // Sort by priority, then by completion status
                    const priorityOrder = { "Very Important": 0, "Important": 1, "Optional": 2 };
                    if (a.completed !== b.completed) return a.completed ? 1 : -1;
                    return priorityOrder[a.priority] - priorityOrder[b.priority];
                  })
                  .map(task => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onToggleComplete={() => toggleComplete({ taskId: task._id })}
                      onDelete={() => deleteTask({ taskId: task._id })}
                    />
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
