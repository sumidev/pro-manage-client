import { AlertCircle, Clock, CalendarDays, CircleDashed } from "lucide-react";

export const dueDates = [
  {
    label: "Overdue",
    value: "overdue",
    icon: AlertCircle,
    color: "text-red-600 bg-red-50 border-red-100",
  },
  {
    label: "Today",
    value: "today",
    icon: Clock,
    color: "text-orange-600 bg-orange-50 border-orange-100",
  },
  {
    label: "This Week",
    value: "week",
    icon: CalendarDays,
    color: "text-blue-600 bg-blue-50 border-blue-100",
  },
  {
    label: "No Date",
    value: "no_date",
    icon: CircleDashed,
    color: "text-gray-500 bg-gray-50 border-gray-200",
  },
];

export const priorities = [
  { label: "Low", color: "bg-gray-100 text-gray-700 hover:bg-gray-200" },
  {
    label: "Medium",
    color: "bg-orange-50 text-orange-700 hover:bg-orange-100",
  },
  { label: "High", color: "bg-red-50 text-red-700 hover:bg-red-100" },
  { label: "Critical", color: "bg-red-100 text-red-800 hover:bg-red-200" },
];

export const unAssignedMember = {
    id : 'unassigned',
    firstName : 'Unassigned',
    LastName : 'None',
}
