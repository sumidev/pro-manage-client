import React from "react";
import { MoreHorizontal, Calendar, MessageSquare, UserX } from "lucide-react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import Tooltip from "../ui/Tooltip";
import TaskTypeIcon from "../ui/TaskTypeIcon";
import { getUserColor } from "../../utils/helpers";
import { getMemberAvatarUrl } from "@/utils/memberUtils";

const priorityConfig = {
  critical: { bg: "#ffebe6", color: "#bf2600", dot: "#de350b", label: "Critical" },
  high:     { bg: "#fff0e6", color: "#974f0c", dot: "#ff991f", label: "High"     },
  medium:   { bg: "#fffae6", color: "#7a5200", dot: "#ffc400", label: "Medium"   },
  low:      { bg: "#e3fcef", color: "#006644", dot: "#36b37e", label: "Low"      },
};

const getColumnAccent = (stageId = "") => {
  const s = stageId.toLowerCase();
  if (s.includes("done") || s.includes("complete")) return "#22c55e";
  if (s.includes("progress"))                        return "#6366f1";
  if (s.includes("review"))                          return "#a855f7";
  if (s.includes("backlog"))                         return "#8b5cf6";
  if (s.includes("bug") || s.includes("issue"))      return "#ef4444";
  if (s.includes("todo"))                            return "#94a3b8";
  return "#94a3b8";
};

const TaskCard = ({ task, onTaskClick, provided, snapshot }) => {
  const pc = priorityConfig[task.priority] || priorityConfig.medium;
  const commentCount = Array.isArray(task.comments)
    ? task.comments.length
    : (task.comments || 0);

  const getDueDateStyle = () => {
    if (!task.due_date) return { color: "var(--text-muted)" };
    const diff = (new Date(task.due_date) - new Date()) / (1000 * 60 * 60 * 24);
    if (diff < 0)  return { color: "var(--red)",    fontWeight: "600" };
    if (diff <= 2) return { color: "var(--orange)",  fontWeight: "600" };
    return { color: "var(--text-muted)" };
  };

  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      onClick={() => onTaskClick(task)}
      style={{
        ...provided.draggableProps.style,
        background: "#fff",
        border: snapshot.isDragging
          ? "2px solid var(--accent)"
          : "1px solid var(--border)",
        borderRadius: "var(--radius-sm)",
        boxShadow: snapshot.isDragging
          ? "var(--shadow-lg)"
          : "var(--shadow-sm)",
        cursor: "pointer",
        userSelect: "none",
      }}
      className="p-3 group"
      onMouseEnter={(e) => {
        if (!snapshot.isDragging) {
          e.currentTarget.style.boxShadow = "var(--shadow-md)";
          e.currentTarget.style.borderColor = "#c8cdd4";
        }
      }}
      onMouseLeave={(e) => {
        if (!snapshot.isDragging) {
          e.currentTarget.style.boxShadow = "var(--shadow-sm)";
          e.currentTarget.style.borderColor = "var(--border)";
        }
      }}
    >
      {/* Priority + menu */}
      <div className="flex items-center justify-between mb-2">
        <span
          className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide"
          style={{ background: pc.bg, color: pc.color }}
        >
          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: pc.dot }} />
          {pc.label}
        </span>
        <button
          className="opacity-0 group-hover:opacity-100 p-0.5 rounded transition-all"
          style={{ color: "var(--text-muted)" }}
          onClick={(e) => e.stopPropagation()}
          onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg-hover)"; e.currentTarget.style.color = "var(--text-primary)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = ""; e.currentTarget.style.color = "var(--text-muted)"; }}
        >
          <MoreHorizontal size={13} />
        </button>
      </div>

      {/* Type + title */}
      <div className="flex items-start gap-2 mb-3 min-w-0">
        <TaskTypeIcon type={task.type} size={13} className="mt-0.5" />
        <h4
          className="text-sm font-medium leading-snug flex-1 min-w-0"
          style={{ color: "var(--text-primary)" }}
        >
          {task.name}
        </h4>
      </div>

      {/* Footer */}
      <div
        className="flex items-center justify-between pt-2"
        style={{ borderTop: "1px solid var(--bg-hover)" }}
      >
        <div className="flex items-center gap-2.5">
          {task.due_date && (
            <span className="flex items-center gap-1 text-[11px]" style={getDueDateStyle()}>
              <Calendar size={11} />
              {task.due_date.split("T")[0]}
            </span>
          )}
          {commentCount > 0 && (
            <span className="flex items-center gap-1 text-[11px]" style={{ color: "var(--text-muted)" }}>
              <MessageSquare size={11} />
              {commentCount}
            </span>
          )}
        </div>

        <Tooltip
          text={
            task.assigned_to
              ? `${task.assigned_to.first_name} ${task.assigned_to.last_name}`
              : "Unassigned"
          }
          position="left"
        >
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white ring-1 ring-white overflow-hidden ${
              task.assigned_to ? getUserColor(task.assigned_to.id) : "bg-gray-300"
            }`}
          >
            {task.assigned_to ? (
              getMemberAvatarUrl(task.assigned_to) ? (
                <img
                  src={
                    task.assigned_to.profile_pic.startsWith("http")
                      ? task.assigned_to.profile_pic
                      : `/storage/${task.assigned_to.profile_pic}`
                  }
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                `${task.assigned_to.first_name?.charAt(0) ?? ""}${task.assigned_to.last_name?.charAt(0) ?? ""}`
              )
            ) : (
              <UserX size={9} style={{ color: "#94a3b8" }} />
            )}
          </div>
        </Tooltip>
      </div>
    </div>
  );
};

const Column = ({ title, tasks = [], onTaskClick, stageId }) => {
  const accent = getColumnAccent(stageId);

  return (
    // h-full so column fills the board row height; flex-col so header + list stack
    <div
      className="w-[272px] flex flex-col shrink-0 rounded h-full min-h-0"
      style={{ background: "var(--bg-hover)", border: "1px solid var(--border)" }}
    >
      {/* Header */}
      <div
        className="px-3 py-2.5 flex items-center justify-between shrink-0 rounded-t"
        style={{
          borderTop: `3px solid ${accent}`,
          background: "var(--bg-card)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="flex items-center gap-2">
          <h3
            className="text-xs font-bold uppercase tracking-wide"
            style={{ color: "var(--text-primary)" }}
          >
            {title}
          </h3>
          <span
            className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
            style={{ background: "var(--bg-hover)", color: "var(--text-secondary)" }}
          >
            {tasks.length}
          </span>
        </div>
        <button
          className="p-1 rounded transition-all"
          style={{ color: "var(--text-muted)" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg-hover)"; e.currentTarget.style.color = "var(--text-primary)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = ""; e.currentTarget.style.color = "var(--text-muted)"; }}
        >
          <MoreHorizontal size={14} />
        </button>
      </div>

      {/* Droppable — flex-1 so it fills remaining column height, overflow-y-auto for scroll */}
      <Droppable droppableId={stageId}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar"
            style={{
              minHeight: "60px",
              background: snapshot.isDraggingOver
                ? "var(--accent-light)"
                : "transparent",
              transition: "background 0.15s",
            }}
          >
            {tasks.map((task, index) => (
              <Draggable
                key={task.id}
                draggableId={task.id.toString()}
                index={index}
              >
                {(provided, snapshot) => (
                  <TaskCard
                    task={task}
                    onTaskClick={onTaskClick}
                    provided={provided}
                    snapshot={snapshot}
                  />
                )}
              </Draggable>
            ))}
            {provided.placeholder}

            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <div
                className="flex items-center justify-center py-8 rounded border-2 border-dashed text-xs"
                style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
              >
                No issues
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Column;
