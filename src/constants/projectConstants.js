export const AVAILABLE_STAGES = [
  { id: "backlog", label: "Backlog", defaultSelected: false },
  { id: "todo", label: "To Do", defaultSelected: true },
  { id: "in_progress", label: "In Progress", defaultSelected: true },
  { id: "review", label: "Review / QA", defaultSelected: false },
  { id: "done", label: "Done", defaultSelected: true },
];

export const MASTER_STAGES_ORDER = [
  "backlog",
  "todo",
  "in_progress",
  "review",
  "done",
];
