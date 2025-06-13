import React, { useState } from 'react';
import { HealthTracker } from './modules/HealthTracker';
import { StudyPlanner } from './modules/StudyPlanner';
import { MiniCRM } from './modules/MiniCRM';

interface LifeModulesProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LifeModules({ isOpen, onClose }: LifeModulesProps) {
  const [activeModule, setActiveModule] = useState<string | null>(null);

  if (!isOpen) return null;

  const modules = [
    { id: 'health', name: 'Health Tracker', icon: '🏥', description: 'Track periods, medications, sleep' },
    { id: 'study', name: 'Study Planner', icon: '📚', description: 'Organize coursework and deadlines' },
    { id: 'crm', name: 'Mini CRM', icon: '💬', description: 'Remember to check in with people' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-mono font-semibold">Life Modules</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            ✕
          </button>
        </div>

        {!activeModule ? (
          <div className="grid gap-4 md:grid-cols-3">
            {modules.map((module) => (
              <button
                key={module.id}
                onClick={() => setActiveModule(module.id)}
                className="p-4 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors text-left"
              >
                <div className="text-2xl mb-2">{module.icon}</div>
                <h3 className="font-medium mb-1">{module.name}</h3>
                <p className="text-sm text-muted-foreground">{module.description}</p>
              </button>
            ))}
          </div>
        ) : (
          <div>
            <button
              onClick={() => setActiveModule(null)}
              className="mb-4 text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              ← Back to modules
            </button>
            
            {activeModule === 'health' && <HealthTracker />}
            {activeModule === 'study' && <StudyPlanner />}
            {activeModule === 'crm' && <MiniCRM />}
          </div>
        )}
      </div>
    </div>
  );
}
