import React, { useState } from 'react';

export function HealthTracker() {
  const [entries, setEntries] = useState([
    { id: 1, type: 'medication', name: 'Vitamin D', time: '09:00', taken: false },
    { id: 2, type: 'period', date: '2024-01-15', flow: 'medium' },
    { id: 3, type: 'sleep', date: '2024-01-14', hours: 7.5, quality: 'good' },
  ]);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-mono font-semibold">Health Tracker</h3>
      
      <div className="grid gap-4 md:grid-cols-2">
        {/* Medications */}
        <div className="bg-secondary p-4 rounded-lg">
          <h4 className="font-medium mb-3 flex items-center gap-2">
            💊 Medications
          </h4>
          <div className="space-y-2">
            {entries.filter(e => e.type === 'medication').map((med) => (
              <div key={med.id} className="flex items-center justify-between">
                <span className="text-sm">{med.name} - {med.time}</span>
                <button className={`w-6 h-6 rounded border-2 ${
                  med.taken ? 'bg-green-500 border-green-500' : 'border-gray-300'
                }`}>
                  {med.taken && '✓'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Period Tracking */}
        <div className="bg-secondary p-4 rounded-lg">
          <h4 className="font-medium mb-3 flex items-center gap-2">
            🌸 Period Tracking
          </h4>
          <div className="space-y-2">
            <div className="text-sm">
              <span className="text-muted-foreground">Last period:</span> Jan 15
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Next expected:</span> Feb 12
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Cycle length:</span> 28 days
            </div>
          </div>
        </div>

        {/* Sleep Tracking */}
        <div className="bg-secondary p-4 rounded-lg">
          <h4 className="font-medium mb-3 flex items-center gap-2">
            😴 Sleep Tracking
          </h4>
          <div className="space-y-2">
            <div className="text-sm">
              <span className="text-muted-foreground">Last night:</span> 7.5 hours
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Quality:</span> Good
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Average:</span> 7.2 hours
            </div>
          </div>
        </div>

        {/* Quick Add */}
        <div className="bg-secondary p-4 rounded-lg">
          <h4 className="font-medium mb-3">Quick Add</h4>
          <div className="space-y-2">
            <button className="w-full text-left text-sm p-2 bg-background rounded hover:bg-background/80">
              + Log medication taken
            </button>
            <button className="w-full text-left text-sm p-2 bg-background rounded hover:bg-background/80">
              + Record sleep
            </button>
            <button className="w-full text-left text-sm p-2 bg-background rounded hover:bg-background/80">
              + Update period info
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
