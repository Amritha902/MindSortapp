import React, { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
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

interface TaskCardProps {
  task: Task;
  onToggleComplete: () => void;
  onDelete: () => void;
}

const priorityColors = {
  "Very Important": "bg-red-500",
  "Important": "bg-yellow-500",
  "Optional": "bg-green-500",
};

export function TaskCard({ task, onToggleComplete, onDelete }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');
  const [editPriority, setEditPriority] = useState(task.priority);
  const [editDeadline, setEditDeadline] = useState(task.deadline || '');

  const updateTask = useMutation(api.tasks.updateTask);

  const handleSave = async () => {
    try {
      await updateTask({
        taskId: task._id,
        title: editTitle,
        description: editDescription || undefined,
        priority: editPriority,
        deadline: editDeadline || undefined,
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setEditPriority(task.priority);
    setEditDeadline(task.deadline || '');
    setIsEditing(false);
  };

  return (
    <div className={`bg-white dark:bg-gray-900 rounded-md border p-3 transition-all hover:shadow-md ${
      task.completed ? 'opacity-60' : ''
    }`}>
      <div className="flex items-start gap-2 mb-2">
        <button
          onClick={onToggleComplete}
          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
            task.completed 
              ? 'bg-primary border-primary text-primary-foreground' 
              : 'border-gray-300 hover:border-primary'
          }`}
        >
          {task.completed && <span className="text-xs">✓</span>}
        </button>
        
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full text-sm font-medium bg-transparent border-b border-gray-300 focus:border-primary outline-none"
              autoFocus
            />
          ) : (
            <h3 className={`text-sm font-medium ${task.completed ? 'line-through' : ''}`}>
              {task.title}
            </h3>
          )}
        </div>

        <div className="flex items-center gap-1">
          <div 
            className={`w-2 h-2 rounded-full ${priorityColors[task.priority]}`}
            title={task.priority}
          />
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            ✏️
          </button>
          <button
            onClick={onDelete}
            className="text-xs text-muted-foreground hover:text-red-500 transition-colors"
          >
            🗑️
          </button>
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-2">
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            placeholder="Description..."
            className="w-full text-xs bg-transparent border border-gray-300 rounded p-2 focus:border-primary outline-none resize-none"
            rows={2}
          />
          
          <div className="flex gap-2">
            <select
              value={editPriority}
              onChange={(e) => setEditPriority(e.target.value as any)}
              className="text-xs bg-transparent border border-gray-300 rounded px-2 py-1 focus:border-primary outline-none"
            >
              <option value="Very Important">Very Important</option>
              <option value="Important">Important</option>
              <option value="Optional">Optional</option>
            </select>
            
            <input
              type="date"
              value={editDeadline}
              onChange={(e) => setEditDeadline(e.target.value)}
              className="text-xs bg-transparent border border-gray-300 rounded px-2 py-1 focus:border-primary outline-none"
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded hover:bg-primary/90 transition-colors"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-1">
          {task.description && (
            <p className="text-xs text-muted-foreground">{task.description}</p>
          )}
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="capitalize">{task.priority.toLowerCase()}</span>
            {task.deadline && (
              <span className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                📅 {new Date(task.deadline).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
