"use client";

import { Activity, ActivityType } from "@/store/dashboardStore";
import { formatRelativeTime } from "@/lib/utils";
import { 
  MessageSquare, 
  CheckCircle2, 
  Plus, 
  RefreshCw, 
  Trash2, 
  ArrowRightLeft, 
  UserPlus, 
  ArrowUpDown, 
  Tag, 
  Archive 
} from "lucide-react";
import { LucideIcon } from "lucide-react";

interface ActivityItemProps {
  activity: Activity;
}

const activityIcons: Record<ActivityType, LucideIcon> = {
  task_completed: CheckCircle2,
  task_created: Plus,
  comment_added: MessageSquare,
  task_updated: RefreshCw,
  task_deleted: Trash2,
  status_change: ArrowRightLeft,
  assignment: UserPlus,
  priority_change: ArrowUpDown,
  label_added: Tag,
  label_removed: Tag,
  task_archived: Archive
};

export function ActivityItem({ activity }: ActivityItemProps) {
  const Icon = activityIcons[activity.type] || RefreshCw;

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
