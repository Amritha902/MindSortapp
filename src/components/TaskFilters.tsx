import React from 'react';

interface TaskFiltersProps {
  selectedCategory: string;
  selectedPriority: string;
  showCompleted: boolean;
  onCategoryChange: (category: string) => void;
  onPriorityChange: (priority: string) => void;
  onShowCompletedChange: (show: boolean) => void;
  taskCounts: Record<string, number>;
}

const categoryIcons = {
  HEALTH: '🏥',
  ACADEMICS: '📚',
  INTERNSHIP: '💼',
  COMMUNICATION: '💬',
  EMOTIONS: '💙',
};

export function TaskFilters({
  selectedCategory,
  selectedPriority,
  showCompleted,
  onCategoryChange,
  onPriorityChange,
  onShowCompletedChange,
  taskCounts,
}: TaskFiltersProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-4">
      <h3 className="font-mono font-semibold text-sm">Filters</h3>
      
      <div className="space-y-3">
        {/* Category Filter */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-2 block">Category</label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onCategoryChange('all')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              All ({Object.values(taskCounts).reduce((a, b) => a + b, 0)})
            </button>
            {Object.entries(categoryIcons).map(([category, icon]) => (
              <button
                key={category}
                onClick={() => onCategoryChange(category)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors flex items-center gap-1 ${
                  selectedCategory === category
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                <span>{icon}</span>
                {category} ({taskCounts[category] || 0})
              </button>
            ))}
          </div>
        </div>

        {/* Priority Filter */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-2 block">Priority</label>
          <div className="flex flex-wrap gap-2">
            {['all', 'Very Important', 'Important', 'Optional'].map((priority) => (
              <button
                key={priority}
                onClick={() => onPriorityChange(priority)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  selectedPriority === priority
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                {priority === 'all' ? 'All' : priority}
              </button>
            ))}
          </div>
        </div>

        {/* Show Completed Toggle */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="showCompleted"
            checked={showCompleted}
            onChange={(e) => onShowCompletedChange(e.target.checked)}
            className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
          />
          <label htmlFor="showCompleted" className="text-xs font-medium">
            Show completed tasks
          </label>
        </div>
      </div>
    </div>
  );
}
