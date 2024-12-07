"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Clock, List, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Activity {
  id: string;
  type: 'create' | 'update' | 'delete' | 'complete';
  taskTitle: string;
  timestamp: string;
  user: string;
}

const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'create',
    taskTitle: 'Implement dashboard layout',
    timestamp: '2024-01-10T10:30:00',
    user: 'John Doe'
  },
  {
    id: '2',
    type: 'update',
    taskTitle: 'Fix navigation bug',
    timestamp: '2024-01-10T11:15:00',
    user: 'Jane Smith'
  },
  {
    id: '3',
    type: 'complete',
    taskTitle: 'Update documentation',
    timestamp: '2024-01-10T12:00:00',
    user: 'John Doe'
  }
];

export default function LastActivities() {
  const [timeFilter, setTimeFilter] = useState<'today' | 'week' | 'month'>('today');
  const [viewMode, setViewMode] = useState<'compact' | 'detailed'>('detailed');

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'create':
        return '🆕';
      case 'update':
        return '📝';
      case 'delete':
        return '🗑️';
      case 'complete':
        return '✅';
      default:
        return '📋';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Clock className="w-6 h-6" />
          Recent Activities
        </h1>

        <div className="flex items-center gap-4">
          <Button
            variant={viewMode === 'compact' ? 'ghost-active' : 'ghost'}
            onClick={() => setViewMode('compact')}
          >
            <List className="w-4 h-4 mr-2" />
            Compact
          </Button>
          <Button
            variant={viewMode === 'detailed' ? 'ghost-active' : 'ghost'}
            onClick={() => setViewMode('detailed')}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Detailed
          </Button>
        </div>
      </div>

      <div className="flex gap-4">
        <Button
          variant={timeFilter === 'today' ? 'ghost-active' : 'ghost'}
          onClick={() => setTimeFilter('today')}
          className="flex items-center gap-2"
        >
          Today
        </Button>
        <Button
          variant={timeFilter === 'week' ? 'ghost-active' : 'ghost'}
          onClick={() => setTimeFilter('week')}
          className="flex items-center gap-2"
        >
          This Week
        </Button>
        <Button
          variant={timeFilter === 'month' ? 'ghost-active' : 'ghost'}
          onClick={() => setTimeFilter('month')}
          className="flex items-center gap-2"
        >
          This Month
        </Button>
      </div>

      <div className="grid gap-4">
        {mockActivities.map((activity) => (
          <Card key={activity.id} className="p-4">
            <div className={cn(
              "flex items-start gap-4",
              viewMode === 'compact' ? 'flex-row' : 'flex-col'
            )}>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{getActivityIcon(activity.type)}</span>
                  <span className="font-medium">{activity.taskTitle}</span>
                  <Badge 
                    variant="secondary"
                    className="ml-2"
                  >
                    {activity.type}
                  </Badge>
                </div>
                {viewMode === 'detailed' && (
                  <div className="text-sm text-gray-500">
                    <p>Modified by {activity.user}</p>
                    <p>{formatTimestamp(activity.timestamp)}</p>
                  </div>
                )}
              </div>
              {viewMode === 'compact' && (
                <div className="text-sm text-gray-500 text-right">
                  <p>{activity.user}</p>
                  <p>{formatTimestamp(activity.timestamp)}</p>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}