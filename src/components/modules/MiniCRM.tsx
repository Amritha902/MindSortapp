import React from 'react';

export function MiniCRM() {
  const contacts = [
    { id: 1, name: 'Mom', lastContact: '2024-01-10', type: 'call', priority: 'high' },
    { id: 2, name: 'Study Group', lastContact: '2024-01-12', type: 'text', priority: 'medium' },
    { id: 3, name: 'Office Hours', lastContact: '2024-01-08', type: 'email', priority: 'high' },
    { id: 4, name: 'Best Friend', lastContact: '2024-01-14', type: 'text', priority: 'low' },
  ];

  const reminders = [
    { id: 1, contact: 'Office Hours', action: 'Email about project', due: 'Today 3:00 AM' },
    { id: 2, contact: 'Mom', action: 'Weekly check-in call', due: 'Tomorrow' },
    { id: 3, contact: 'Study Group', action: 'Confirm meeting time', due: 'Jan 20' },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-mono font-semibold">Mini CRM</h3>
      
      <div className="grid gap-4 md:grid-cols-2">
        {/* Contacts */}
        <div className="bg-secondary p-4 rounded-lg">
          <h4 className="font-medium mb-3 flex items-center gap-2">
            👥 Important Contacts
          </h4>
          <div className="space-y-3">
            {contacts.map((contact) => (
              <div key={contact.id} className="bg-background p-3 rounded">
                <div className="flex items-start justify-between mb-1">
                  <h5 className="text-sm font-medium">{contact.name}</h5>
                  <span className={`text-xs px-2 py-1 rounded ${
                    contact.priority === 'high' 
                      ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                      : contact.priority === 'medium'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
                      : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                  }`}>
                    {contact.priority}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Last {contact.type}: {contact.lastContact}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Reminders */}
        <div className="bg-secondary p-4 rounded-lg">
          <h4 className="font-medium mb-3 flex items-center gap-2">
            ⏰ Communication Reminders
          </h4>
          <div className="space-y-3">
            {reminders.map((reminder) => (
              <div key={reminder.id} className="bg-background p-3 rounded">
                <h5 className="text-sm font-medium">{reminder.contact}</h5>
                <p className="text-sm text-muted-foreground mb-1">{reminder.action}</p>
                <p className="text-xs text-muted-foreground">Due: {reminder.due}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-secondary p-4 rounded-lg">
          <h4 className="font-medium mb-3">Quick Actions</h4>
          <div className="space-y-2">
            <button className="w-full text-left text-sm p-2 bg-background rounded hover:bg-background/80">
              📞 Schedule call
            </button>
            <button className="w-full text-left text-sm p-2 bg-background rounded hover:bg-background/80">
              💬 Send text reminder
            </button>
            <button className="w-full text-left text-sm p-2 bg-background rounded hover:bg-background/80">
              📧 Draft email
            </button>
            <button className="w-full text-left text-sm p-2 bg-background rounded hover:bg-background/80">
              + Add contact
            </button>
          </div>
        </div>

        {/* Communication Stats */}
        <div className="bg-secondary p-4 rounded-lg">
          <h4 className="font-medium mb-3 flex items-center gap-2">
            📊 Communication Stats
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Calls this week:</span>
              <span className="font-medium">5</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Messages sent:</span>
              <span className="font-medium">23</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Pending responses:</span>
              <span className="font-medium">3</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
