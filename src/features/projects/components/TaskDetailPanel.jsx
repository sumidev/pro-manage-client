import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  X,
  Calendar,
  AlignLeft,
  Send,
  Trash2,
  ChevronDown,
  CheckCircle2,
  Hash,
  Paperclip,
  MessageSquare,
  Clock,
} from "lucide-react";
import { AVAILABLE_STAGES } from "../../../constants/projectConstants";
import { useDispatch, useSelector } from "react-redux";
import {
  addComment,
  deleteTask,
  getComments,
  moveTaskStage,
  updateTask,
} from "../../tasks/tasksSlice";
import { moveTaskOptimistically } from "../projectsSlice";
import UserSearchDropdown from "@/features/tasks/components/UserSearchDropdown";
import { Comment } from "@/features/tasks/components/Comments/Comment";
import ConfirmModal from "@/components/ui/ConfirmModal";
import toast from "react-hot-toast";
import { DropdownPortal } from "@/components/ui/DropdownPortal";
import TaskTypeIcon from "@/components/ui/TaskTypeIcon";
import { TASK_TYPE_OPTIONS } from "@/constants/taskConstants";

const priorityConfig = {
  critical: { bg: "#ffebe6", color: "#bf2600", dot: "#de350b", label: "Critical" },
  high:     { bg: "#fff0e6", color: "#974f0c", dot: "#ff991f", label: "High" },
  medium:   { bg: "#fffae6", color: "#7a5200", dot: "#ffc400", label: "Medium" },
  low:      { bg: "#e3fcef", color: "#006644", dot: "#36b37e", label: "Low" },
};

const getStageStyle = (stage = "") => {
  const s = stage.toLowerCase();
  if (s.includes("done") || s.includes("complete")) return { bg: "#e3fcef", color: "#006644" };
  if (s.includes("progress")) return { bg: "#e8f0fe", color: "#0052cc" };
  if (s.includes("review")) return { bg: "#eae6ff", color: "#403294" };
  if (s.includes("bug") || s.includes("issue")) return { bg: "#ffebe6", color: "#bf2600" };
  return { bg: "#f4f5f7", color: "#6b778c" };
};

const TaskDetailPanel = ({ task, stages, onClose, members, projectId }) => {
  const [comment, setComment] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const statusRef = useRef(null);
  const dispatch = useDispatch();

  const taskId = task?.id;
  const allTasksMap = useSelector((state) => state.projects.project?.tasks);

  const liveTask = useMemo(() => {
    if (!allTasksMap) return null;
    for (const stageKey of Object.keys(allTasksMap)) {
      const found = allTasksMap[stageKey].find((t) => t.id === taskId);
      if (found) return { ...found, stage: stageKey };
    }
    return null;
  }, [allTasksMap, taskId]);

  const taskToRender = liveTask || task;
  const [taskForm, setTaskForm] = useState(taskToRender);

  useEffect(() => { setTaskForm(taskToRender); }, [taskToRender]);

  useEffect(() => {
    const payload = { id: taskId, type: "task" };
    dispatch(getComments({ payload, taskId, stage: taskForm.stage }));
  }, [taskId, dispatch, taskForm.stage]);

  const handleStatus = (stageId, stage, oldStage) => {
    dispatch(moveTaskOptimistically({ taskId: stageId, fromStage: oldStage, toStage: stage, newIndex: 0 }));
    dispatch(moveTaskStage({ taskId: stageId, newStage: stage, newIndex: 0 }));
    setIsStatusOpen(false);
  };

  const handleFieldSave = (key, value) => {
    dispatch(updateTask({ id: taskId, data: { [key]: value } }));
  };

  const handleComment = () => {
    if (!comment.trim() && !selectedFile) return;
    
    let payload;
    if (selectedFile) {
      payload = new FormData();
      payload.append("commentable_id", taskId);
      payload.append("commentable_type", "task");
      payload.append("description", comment);
      payload.append("attachment", selectedFile);
    } else {
      payload = {
        commentable_id: taskId,
        commentable_type: "task",
        description: comment,
        parent_id: null,
      };
    }
    
    dispatch(addComment({ payload, taskId, stage: taskForm.stage }));
    setComment("");
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleInlineReply = (parentId, replyText, replyFile) => {
    let payload;
    if (replyFile) {
      payload = new FormData();
      payload.append("commentable_id", taskId);
      payload.append("commentable_type", "task");
      payload.append("description", replyText);
      payload.append("parent_id", parentId);
      payload.append("attachment", replyFile);
    } else {
      payload = {
        commentable_id: taskId,
        commentable_type: "task",
        description: replyText,
        parent_id: parentId,
      };
    }
    dispatch(addComment({ payload, taskId, stage: taskForm.stage }));
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await toast.promise(
        dispatch(deleteTask({ id: taskForm.id, stage: taskForm.stage })).unwrap(),
        {
          loading: "Deleting issue...",
          success: "Issue deleted",
          error: (err) => `Error: ${err}`,
        }
      );
      setIsModalOpen(false);
      if (onClose) onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!task) return null;

  const stageStyle = getStageStyle(taskForm.stage);
  const pc = priorityConfig[taskForm.priority] || priorityConfig.medium;
  const commentCount = Array.isArray(taskForm.comments) ? taskForm.comments.length : 0;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[60]"
        style={{ background: "rgba(9,30,66,0.54)" }}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="fixed inset-y-0 right-0 z-[70] flex flex-col slide-in-right"
        style={{
          width: "min(680px, 100vw)",
          background: "#fff",
          borderLeft: "1px solid #dfe1e6",
          boxShadow: "-4px 0 24px rgba(9,30,66,0.15)",
        }}
      >
        {/* ===== PANEL HEADER ===== */}
        <div
          className="flex items-center justify-between px-5 py-3 shrink-0"
          style={{ borderBottom: "1px solid #dfe1e6", background: "#fff" }}
        >
          <div className="flex items-center gap-3">
            <TaskTypeIcon type={taskForm.type} size={14} />
            {/* Issue ID */}
            <div
              className="flex items-center gap-1 px-2 py-1 rounded text-xs font-mono font-semibold"
              style={{ background: "#f4f5f7", color: "#6b778c" }}
            >
              <Hash size={11} />
              {taskForm.id}
            </div>

            {/* Stage dropdown */}
            <div className="relative" ref={statusRef}>
              <button
                onClick={() => setIsStatusOpen(!isStatusOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wide transition-all"
                style={{ background: stageStyle.bg, color: stageStyle.color }}
              >
                {taskForm.stage}
                <ChevronDown
                  size={12}
                  className={`transition-transform ${isStatusOpen ? "rotate-180" : ""}`}
                />
              </button>

              <DropdownPortal
                anchorRef={statusRef}
                open={isStatusOpen}
                onClose={() => setIsStatusOpen(false)}
                align="left"
                minWidth={176}
              >
                <div
                  className="w-44 rounded shadow-xl border py-1 fade-in"
                  style={{ background: "#fff", borderColor: "#dfe1e6" }}
                >
                  {stages.map((stageId) => {
                    const stageObj = AVAILABLE_STAGES.find((s) => s.id === stageId);
                    const label = stageObj ? stageObj.label : stageId;
                    const ss = getStageStyle(stageId);
                    return (
                      <button
                        key={stageId}
                        onClick={() => handleStatus(taskForm.id, stageObj?.id || stageId, taskForm.stage)}
                        className="w-full flex items-center justify-between px-3 py-2 text-sm transition-all text-left"
                        style={{ color: "#172b4d" }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "#f4f5f7"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = ""; }}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase"
                            style={{ background: ss.bg, color: ss.color }}
                          >
                            {label}
                          </span>
                        </div>
                        {stageId === taskForm.stage && (
                          <CheckCircle2 size={14} style={{ color: "#0052cc" }} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </DropdownPortal>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsModalOpen(true)}
              className="p-1.5 rounded transition-all"
              style={{ color: "#97a0af" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#ffebe6"; e.currentTarget.style.color = "#de350b"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = ""; e.currentTarget.style.color = "#97a0af"; }}
            >
              <Trash2 size={15} />
            </button>
            <div style={{ width: "1px", height: "20px", background: "#dfe1e6", margin: "0 4px" }} />
            <button
              onClick={onClose}
              className="p-1.5 rounded transition-all"
              style={{ color: "#6b778c" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#f4f5f7"; e.currentTarget.style.color = "#172b4d"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = ""; e.currentTarget.style.color = "#6b778c"; }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* ===== SCROLLABLE BODY ===== */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="px-6 py-5 max-w-2xl">

            {/* Issue Title */}
            <div className="flex items-start gap-2.5 mb-4">
              <TaskTypeIcon type={taskForm.type} size={16} className="mt-1" />
              <textarea
              rows={1}
              value={taskForm.name}
              onChange={(e) => setTaskForm({ ...taskForm, name: e.target.value })}
              onBlur={() => handleFieldSave("name", taskForm.name)}
              className="inline-edit flex-1 min-w-0 text-xl font-bold leading-snug resize-none"
              style={{ color: "#172b4d" }}
              placeholder="Issue summary"
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = e.target.scrollHeight + "px";
              }}
            />
            </div>

            {/* Properties Grid */}
            <div
              className="rounded border mb-5"
              style={{ borderColor: "#dfe1e6", background: "#fafbfc" }}
            >
              <div
                className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider"
                style={{ borderBottom: "1px solid #dfe1e6", color: "#6b778c" }}
              >
                Details
              </div>

              <div className="divide-y" style={{ borderColor: "#f4f5f7" }}>
                {/* Issue type */}
                <div className="flex items-center px-4 py-2.5 gap-4">
                  <span className="pm-label w-24 shrink-0">Type</span>
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <TaskTypeIcon type={taskForm.type} size={13} showTooltip={false} />
                    <select
                      value={taskForm.type || "task"}
                      onChange={(e) => {
                        setTaskForm({ ...taskForm, type: e.target.value });
                        handleFieldSave("type", e.target.value);
                      }}
                      className="pm-input flex-1 text-sm py-1.5"
                      style={{ maxWidth: "200px" }}
                    >
                      {TASK_TYPE_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Assignee */}
                <div className="flex items-center px-4 py-2.5 gap-4">
                  <span className="pm-label w-24 shrink-0">Assignee</span>
                  <UserSearchDropdown
                    label=""
                    users={members}
                    projectId={projectId}
                    selectedUserId={taskForm.assigned_to ? taskForm.assigned_to.id : null}
                    onSelect={(user) => {
                      setTaskForm({ ...taskForm, assigned_to: user });
                      handleFieldSave("assigned_to", user?.id ?? null);
                    }}
                  />
                </div>

                {/* Priority */}
                <div className="flex items-center px-4 py-2.5 gap-4">
                  <span className="pm-label w-24 shrink-0">Priority</span>
                  <div className="relative inline-flex items-center">
                    <span
                      className="absolute left-2 w-2 h-2 rounded-full pointer-events-none z-10"
                      style={{ background: pc.dot }}
                    />
                    <select
                      value={taskForm.priority}
                      onChange={(e) => {
                        setTaskForm({ ...taskForm, priority: e.target.value });
                        handleFieldSave("priority", e.target.value);
                      }}
                      className="pl-6 pr-8 py-1 text-xs font-semibold rounded border outline-none cursor-pointer appearance-none"
                      style={{
                        background: pc.bg,
                        color: pc.color,
                        border: "1px solid transparent",
                      }}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                    <ChevronDown size={11} className="absolute right-2 pointer-events-none" style={{ color: pc.color }} />
                  </div>
                </div>

                {/* Due Date */}
                <div className="flex items-center px-4 py-2.5 gap-4">
                  <span className="pm-label w-24 shrink-0">Due date</span>
                  <div className="relative flex items-center">
                    <Calendar size={13} className="absolute left-2 pointer-events-none" style={{ color: "#97a0af" }} />
                    <input
                      type="date"
                      value={taskForm.due_date ? taskForm.due_date.split("T")[0] : ""}
                      onChange={(e) => setTaskForm({ ...taskForm, due_date: e.target.value })}
                      onBlur={(e) => handleFieldSave("due_date", e.target.value)}
                      className="pl-7 pr-2 py-1 text-xs rounded border-0 outline-none cursor-pointer"
                      style={{ background: "transparent", color: "#172b4d" }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <AlignLeft size={14} style={{ color: "#6b778c" }} />
                <h3 className="text-sm font-semibold" style={{ color: "#172b4d" }}>
                  Description
                </h3>
              </div>
              <textarea
                className="pm-input resize-none min-h-[100px] text-sm leading-relaxed"
                placeholder="Add a description..."
                defaultValue={taskForm.description}
                onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                onBlur={() => handleFieldSave("description", taskForm.description)}
              />
            </div>

            {/* Activity / Comments */}
            <div style={{ borderTop: "1px solid #dfe1e6", paddingTop: "20px" }}>
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare size={14} style={{ color: "#6b778c" }} />
                <h3 className="text-sm font-semibold" style={{ color: "#172b4d" }}>
                  Activity
                </h3>
                {commentCount > 0 && (
                  <span
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                    style={{ background: "#e8f0fe", color: "#0052cc" }}
                  >
                    {commentCount}
                  </span>
                )}
              </div>

              {/* Comment input */}
              <div className="flex gap-3 mb-5">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5"
                  style={{ background: "#0052cc" }}
                >
                  ME
                </div>
                <div
                  className="flex-1 rounded border overflow-hidden"
                  style={{ borderColor: "#dfe1e6" }}
                  onFocusCapture={(e) => { e.currentTarget.style.borderColor = "#4c9aff"; e.currentTarget.style.boxShadow = "0 0 0 2px #4c9aff40"; }}
                  onBlurCapture={(e) => { e.currentTarget.style.borderColor = "#dfe1e6"; e.currentTarget.style.boxShadow = ""; }}
                >
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleComment();
                    }}
                    className="w-full p-3 text-sm outline-none resize-none"
                    style={{ background: "#fafbfc", color: "#172b4d", minHeight: "64px" }}
                    placeholder="Add a comment... (Ctrl+Enter to submit)"
                  />
                  
                  {selectedFile && (
                    <div className="px-3 py-2 flex items-center gap-2 text-xs" style={{ background: "#f4f5f7" }}>
                      <Paperclip size={12} style={{ color: "#6b778c" }} />
                      <span className="truncate flex-1 font-medium" style={{ color: "#172b4d" }}>{selectedFile.name}</span>
                      <button onClick={() => { setSelectedFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }} className="p-1 hover:bg-gray-200 rounded">
                        <X size={12} />
                      </button>
                    </div>
                  )}

                  <div
                    className="flex items-center justify-between px-3 py-2"
                    style={{ background: "#f4f5f7", borderTop: "1px solid #dfe1e6" }}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="p-1 rounded transition-all"
                      style={{ color: "#97a0af" }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = "#172b4d"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = "#97a0af"; }}
                    >
                      <Paperclip size={13} />
                    </button>
                    <button
                      disabled={!comment.trim() && !selectedFile}
                      onClick={handleComment}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{ background: "#0052cc" }}
                      onMouseEnter={(e) => { if (comment.trim()) e.currentTarget.style.background = "#0065ff"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "#0052cc"; }}
                    >
                      <Send size={11} />
                      Save
                    </button>
                  </div>
                </div>
              </div>

              {/* Comments list */}
              <div className="space-y-4">
                {taskForm?.comments && taskForm.comments.length > 0 ? (
                  taskForm.comments.map((commentItem) => (
                    <Comment
                      key={commentItem.id}
                      comment={commentItem}
                      onSubmitReply={handleInlineReply}
                    />
                  ))
                ) : (
                  <div
                    className="flex flex-col items-center justify-center py-8 rounded border-2 border-dashed text-center"
                    style={{ borderColor: "#dfe1e6" }}
                  >
                    <MessageSquare size={20} className="mb-2" style={{ color: "#dfe1e6" }} />
                    <p className="text-xs" style={{ color: "#97a0af" }}>
                      No comments yet. Start the discussion!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
        title="Delete issue?"
        message={`Are you sure you want to delete "${taskForm.name}"? This action cannot be undone.`}
      />
    </>
  );
};

export default TaskDetailPanel;
