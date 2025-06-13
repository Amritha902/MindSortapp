import React from 'react';

export function StudyPlanner() {
  const assignments = [
    { id: 1, course: 'RISC-V Architecture', task: 'Complete lab 3', due: '2024-01-20', priority: 'high' },
    { id: 2, course: 'Java Programming', task: 'Project milestone 2', due: '2024-01-22', priority: 'high' },
    { id: 3, course: 'CNVD Security', task: 'Read chapters 5-7', due: '2024-01-25', priority: 'medium' },
  ];

  const schedule = [
    { time: '09:00', subject: 'RISC-V Lecture', location: 'Room 101' },
    { time: '11:00', subject: 'Java Lab', location: 'Computer Lab' },
    { time: '14:00', subject: 'Study Group', location: 'Library' },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-mono font-semibold">Study Planner</h3>
      
      <div className="grid gap-4 md:grid-cols-2">
        {/* Assignments */}
        <div className="bg-secondary p-4 rounded-lg">
          <h4 className="font-medium mb-3 flex items-center gap-2">
            📝 Upcoming Assignments
          </h4>
          <div className="space-y-3">
            {assignments.map((assignment) => (
              <div key={assignment.id} className="bg-background p-3 rounded">
                <div className="flex items-start justify-between mb-1">
                  <h5 className="text-sm font-medium">{assignment.course}</h5>
                  <span className={`text-xs px-2 py-1 rounded ${
                    assignment.priority === 'high' 
                      ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
                  }`}>
                    {assignment.priority}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{assignment.task}</p>
                <p className="text-xs text-muted-foreground">Due: {assignment.due}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="bg-secondary p-4 rounded-lg">
          <h4 className="font-medium mb-3 flex items-center gap-2">
            📅 Today's Schedule
          </h4>
          <div className="space-y-3">
            {schedule.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="text-sm font-mono bg-primary text-primary-foreground px-2 py-1 rounded">
                  {item.time}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.subject}</p>
                  <p className="text-xs text-muted-foreground">{item.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Study Stats */}
        <div className="bg-secondary p-4 rounded-lg">
          <h4 className="font-medium mb-3 flex items-center gap-2">
            📊 Study Stats
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Hours this week:</span>
              <span className="font-medium">24.5</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Assignments completed:</span>
              <span className="font-medium">8/12</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Average grade:</span>
              <span className="font-medium">87%</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-secondary p-4 rounded-lg">
          <h4 className="font-medium mb-3">Quick Actions</h4>
          <div className="space-y-2">
            <button className="w-full text-left text-sm p-2 bg-background rounded hover:bg-background/80">
              + Add assignment
            </button>
            <button className="w-full text-left text-sm p-2 bg-background rounded hover:bg-background/80">
              + Schedule study session
            </button>
            <button className="w-full text-left text-sm p-2 bg-background rounded hover:bg-background/80">
              + Set reminder
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
