import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  X,
  Calendar,
  User,
  AlignLeft,
  Paperclip,
  Send,
  Clock,
  Trash2,
  ChevronDown,
  CheckCircle2,
  Layout,
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

const getStageStyles = (stage) => {
  const s = stage?.toLowerCase() || "";
  if (s.includes("done") || s.includes("complete"))
    return "bg-green-100 text-green-700 border-green-200 hover:bg-green-200";
  if (s.includes("progress"))
    return "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200";
  if (s.includes("review"))
    return "bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200";
  if (s.includes("bug") || s.includes("issue"))
    return "bg-red-100 text-red-700 border-red-200 hover:bg-red-200";
  return "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200";
};

const TaskDetailPanel = ({ task, stages, onClose, members, openOnce }) => {
  const [comment, setComment] = useState("");
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
      const foundTask = allTasksMap[stageKey].find((t) => t.id === taskId);
      if (foundTask) {
        return { ...foundTask, stage: stageKey };
      }
    }
    return null;
  }, [allTasksMap, taskId]);

  const taskToRender = liveTask || task;
  const [taskForm, setTaskForm] = useState(taskToRender);

  useEffect(() => {
    setTaskForm(taskToRender);
  }, [taskToRender]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (statusRef.current && !statusRef.current.contains(event.target)) {
        setIsStatusOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const payload = { id: taskId, type: "task" };
    const stage = taskForm.stage;
    dispatch(getComments({ payload, taskId, stage }));
  }, [taskId]);

  const handleStatus = (stageId, stage, oldStage, members) => {
    dispatch(
      moveTaskOptimistically({
        taskId: stageId,
        fromStage: oldStage,
        toStage: stage,
        newIndex: 0,
      }),
    );
    dispatch(moveTaskStage({ taskId: stageId, newStage: stage, newIndex: 0 }));
    setIsStatusOpen(false);
  };

  const handleFieldSave = (key, value) => {
    const payload = { id: taskId, data: { [key]: value } };
    dispatch(updateTask(payload));
  };

  // ✨ MAIN COMMENT SUBMIT (Parent ID is null)
  const handleComment = () => {
    const payload = {
      commentable_id: taskId,
      commentable_type: "task",
      description: comment,
      parent_id: null,
    };
    dispatch(addComment({ payload, taskId, stage: taskForm.stage }));
    setComment("");
  };

  const handleInlineReply = (parentId, replyText) => {
    const payload = {
      commentable_id: taskId,
      commentable_type: "task",
      description: replyText,
      parent_id: parentId,
    };
    dispatch(addComment({ payload, taskId, stage: taskForm.stage }));
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await toast.promise(
        dispatch(
          deleteTask({ id: taskForm.id, stage: taskForm.stage }),
        ).unwrap(),
        {
          loading: "Deleting Task...",
          success: "Task Deleted!",
          error: (err) => `Error: ${err}`,
        },
      );
      setIsModalOpen(false);
    } catch (error) {
      console.error(`Error : ${error}`);
    } finally {
      setIsDeleting(false);
      if (onClose) onClose();
    }
  };

  if (!task) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[60] transition-opacity duration-300"
        onClick={onClose}
      />
      <div className="fixed inset-y-0 right-0 w-full md:w-[650px] bg-white shadow-2xl z-[70] transform transition-transform duration-300 ease-out flex flex-col border-l border-gray-100">
        {/* === HEADER === */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs font-mono text-gray-400 bg-gray-50 px-2 py-1 rounded border border-gray-200">
              <Layout size={12} />
              <span>TASK-{taskForm.id}</span>
            </div>
            <div className="relative" ref={statusRef}>
              <button
                onClick={() => setIsStatusOpen(!isStatusOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wide border transition-all duration-200 ${getStageStyles(task.stage)}`}
              >
                {taskForm.stage}
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${isStatusOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isStatusOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden py-1 animate-in fade-in zoom-in-95 duration-200">
                  {stages.map((stageId) => {
                    const stageObj = AVAILABLE_STAGES.find(
                      (s) => s.id === stageId,
                    );
                    const label = stageObj ? stageObj.label : taskForm.stage;
                    return (
                      <button
                        key={stageId}
                        onClick={() =>
                          handleStatus(taskForm.id, stageObj.id, taskForm.stage)
                        }
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-between group"
                      >
                        <span>{label}</span>
                        {stageId === taskForm.stage && (
                          <CheckCircle2 size={16} className="text-blue-600" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
              onClick={() => setIsModalOpen(true)}
            >
              <Trash2 size={18} />
            </button>
            <div className="w-px h-6 bg-gray-200 mx-1"></div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* === SCROLLABLE BODY === */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-8 max-w-3xl mx-auto">
            <textarea
              rows={1}
              value={taskForm.name}
              onChange={(e) =>
                setTaskForm({ ...taskForm, name: e.target.value })
              }
              onBlur={() => handleFieldSave("name", taskForm.name)}
              className="w-full text-3xl font-bold text-gray-900 border border-transparent focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50 hover:bg-gray-50/50 resize-none px-2 py-1 -ml-2 rounded transition-all duration-200 outline-none placeholder-gray-300 leading-tight"
              placeholder="Task Title"
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = e.target.scrollHeight + "px";
              }}
            />

            {/* Properties Grid */}
            <div className="grid grid-cols-2 gap-y-6 gap-x-12 mb-10 p-5 bg-gray-50/50 rounded-xl border border-gray-100/50 mt-6">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Assignee
                </label>
                <div className="flex items-center gap-2 group cursor-pointer hover:bg-gray-100 p-1.5 -ml-1.5 rounded-lg transition-colors">
                  {taskToRender.assigned_to ? (
                    <>
                      <img
                        src={
                          taskToRender.assigned_to.profile_pic ||
                          `https://ui-avatars.com/api/?name=${taskToRender.assigned_to.first_name} ${taskToRender.assigned_to.last_name}&background=random`
                        }
                        alt="User"
                        className="w-6 h-6 rounded-full ring-2 ring-white"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        {taskToRender.assigned_to.first_name}{" "}
                        {taskToRender.assigned_to.last_name}
                      </span>
                    </>
                  ) : (
                    <>
                      <div className="w-6 h-6 rounded-full bg-white border border-dashed border-gray-300 flex items-center justify-center text-gray-400">
                        <User size={12} />
                      </div>
                      <span className="text-sm text-gray-400 group-hover:text-blue-600 transition-colors">
                        Select Assignee
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Due Date
                </label>
                <div className="relative flex items-center group -ml-1.5 rounded-lg transition-colors">
                  <Calendar
                    size={16}
                    className="absolute left-2 text-gray-400 group-hover:text-gray-600 pointer-events-none transition-colors"
                  />
                  <input
                    type="date"
                    value={
                      taskForm.due_date ? taskForm.due_date.split("T")[0] : ""
                    }
                    onChange={(e) =>
                      setTaskForm({ ...taskForm, due_date: e.target.value })
                    }
                    onBlur={(e) => handleFieldSave("due_date", e.target.value)}
                    className="w-full pl-8 pr-2 py-1.5 bg-transparent text-sm font-medium text-gray-700 cursor-pointer rounded-md outline-none transition-all duration-200 hover:bg-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Priority
                </label>
                <div className="relative ">
                  <select
                    defaultValue={taskForm.priority}
                    onChange={(e) =>
                      handleFieldSave("priority", e.target.value)
                    }
                    className="appearance-none bg-transparent pl-2 pr-8 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                    <option value="critical">Critical 🔥</option>
                  </select>
                  <div
                    className={`absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full ${taskForm.priority === "high" ? "bg-red-500" : taskForm.priority === "medium" ? "bg-yellow-500" : "bg-blue-400"}`}
                  ></div>
                </div>
              </div>
              <UserSearchDropdown
                label="Assignee"
                users={members}
                selectedUserId={
                  taskForm.assigned_to ? taskForm.assigned_to.id : null
                }
                onSelect={(userId) => {
                  setTaskForm({ ...taskForm, assigned_to: userId });
                  handleFieldSave("assigned_to", userId.id);
                }}
              />
            </div>

            <div className="mb-10">
              <div className="flex items-center gap-2 mb-3">
                <AlignLeft size={18} className="text-gray-500" />
                <h3 className="text-base font-semibold text-gray-800">
                  Description
                </h3>
              </div>
              <div className="relative group">
                <textarea
                  className="w-full text-sm text-gray-700 leading-7 border border-gray-200 rounded-xl p-4 min-h-[120px] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none shadow-sm group-hover:border-gray-300"
                  placeholder="Add a detailed description..."
                  defaultValue={taskForm.description}
                  onChange={(e) =>
                    setTaskForm({ ...taskForm, description: e.target.value })
                  }
                  onBlur={() =>
                    handleFieldSave("description", taskForm.description)
                  }
                />
                <div className="absolute bottom-2 right-2 text-[10px] text-gray-300 pointer-events-none">
                  Markdown supported
                </div>
              </div>
            </div>

            {/* Activity / Comments */}
            <div className="pt-8 border-t border-gray-100">
              <h3 className="text-base font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <Clock size={18} className="text-gray-500" /> Activity
              </h3>

              {/* Main Comment Input (Bottom) */}
              <div className="flex gap-4 mb-8 items-start">
                <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold shadow-sm shrink-0 mt-1">
                  ME
                </div>
                <div className="flex-1 relative">
                  <div className="relative shadow-sm bg-white rounded-xl border border-gray-200 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full rounded-t-xl p-3 text-sm focus:outline-none min-h-[70px] resize-none bg-transparent"
                      placeholder="Write a comment..."
                    ></textarea>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded-b-xl border-t border-gray-100">
                      <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded transition">
                        <Paperclip size={16} />
                      </button>
                      <button
                        disabled={!comment.trim()}
                        className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-xs font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition flex items-center gap-2 shadow-sm"
                        onClick={handleComment}
                      >
                        Post <Send size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline / History */}
              <div className="space-y-6 relative before:absolute before:left-4 before:top-2 before:bottom-0 before:w-0.5 before:bg-gray-100">
                {taskForm?.comments && taskForm.comments.length > 0 ? (
                  taskForm.comments.map((commentItem) => (
                    <Comment
                      key={commentItem.id}
                      comment={commentItem}
                      onSubmitReply={handleInlineReply} // ✨ PASSING INLINE HANDLER
                    />
                  ))
                ) : (
                  <div className="text-sm text-gray-400 pl-10 py-4 italic">
                    No comments yet. Be the first to start the discussion!
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
        title="Delete Task?"
        message={`Are you sure you want to delete "${taskForm.name}"? This cannot be undone.`}
      />
    </>
  );
};

export default TaskDetailPanel;
