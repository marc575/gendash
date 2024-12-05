"use client";

import { Activity } from "@/store/dashboardStore";
import { formatRelativeTime } from "@/lib/utils";
import { MessageSquare, CheckCircle2, Plus } from "lucide-react";

interface ActivityItemProps {
  activity: Activity;
}

const activityIcons = {
  task_completed: CheckCircle2,
  task_created: Plus,
  comment_added: MessageSquare,
  task_updated: CheckCircle2,
  task_deleted: CheckCircle2,
};

export function ActivityItem({ activity }: ActivityItemProps) {
  const Icon = activityIcons[activity.type];

  return (
    <div className="flex items-start space-x-3">
      <div className="flex-shrink-0">
        <div className="p-2 bg-muted rounded-full">
          <Icon className="w-4 h-4 text-foreground" />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground">
          <span className="font-medium">{activity.action}</span>{" "}
          <span className="text-muted-foreground">{activity.task}</span>
        </p>
        <p className="text-xs text-muted-foreground">
          {formatRelativeTime(activity.time)}
        </p>
      </div>
    </div>
  );
}
