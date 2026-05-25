import { Bug, BookOpen, Sparkles, ListTodo } from "lucide-react";
import { getTaskTypeConfig } from "@/constants/taskConstants";

const ICON_MAP = {
  Bug,
  BookOpen,
  Sparkles,
  ListTodo,
};

/**
 * Issue type icon (task, bug, feature, story) — Jira-style.
 */
export default function TaskTypeIcon({ type, size = 14, showTooltip = true, className = "" }) {
  const config = getTaskTypeConfig(type);
  const Icon = ICON_MAP[config.icon] || ListTodo;
  const box = size + 6;

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded ${className}`}
      style={{
        width: box,
        height: box,
        background: config.bg,
        color: config.color,
      }}
      title={showTooltip ? config.label : undefined}
      aria-label={config.label}
    >
      <Icon size={size} strokeWidth={2.25} />
    </span>
  );
}
