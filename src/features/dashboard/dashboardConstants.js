import { Briefcase, Clock, CheckCircle, AlertCircle } from "lucide-react";

// Ye sirf Design configuration hai
export const STATS_CONFIG = [
  {
    key: "totalProjects", // 👈 Ye Backend key se match hona chahiye
    title: "Total Projects",
    icon: Briefcase,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    key: "pendingTasks",
    title: "Tasks Pending",
    icon: Clock,
    color: "text-yellow-600",
    bg: "bg-yellow-50",
  },
  {
    key: "completedTasks",
    title: "Completed",
    icon: CheckCircle,
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    key: "overdueTasks",
    title: "Overdue",
    icon: AlertCircle,
    color: "text-red-600",
    bg: "bg-red-50",
  },
];
