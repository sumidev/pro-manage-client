export const PRIORITY = [
  { id: "low", label: "low" },
  { id: "medium", label: "medium" },
  { id: "high", label: "high" },
  { id: "critical", label: "critical" },
];

export const TASK_TYPES = {
  task: {
    label: "Task",
    icon: "ListTodo",
    color: "#4338ca",
    bg: "#eef2ff",
  },
  bug: {
    label: "Bug",
    icon: "Bug",
    color: "#b91c1c",
    bg: "#fef2f2",
  },
  feature: {
    label: "Feature",
    icon: "Sparkles",
    color: "#7e22ce",
    bg: "#faf5ff",
  },
  story: {
    label: "Story",
    icon: "BookOpen",
    color: "#15803d",
    bg: "#dcfce7",
  },
};

export const TASK_TYPE_OPTIONS = Object.entries(TASK_TYPES).map(([value, cfg]) => ({
  value,
  label: cfg.label,
  icon: cfg.icon,
  color: cfg.color,
  bg: cfg.bg,
}));

export const getTaskTypeConfig = (type) =>
  TASK_TYPES[type] || TASK_TYPES.task;
