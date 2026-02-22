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
import { formatDate } from "../../../utils/dateUtils";
import { AVAILABLE_STAGES } from "../../../constants/projectConstants";
import { useDispatch, useSelector } from "react-redux";
import { moveTaskStage } from "../../tasks/tasksSlice";
import { moveTaskOptimistically } from "../projectsSlice";

// --- HELPER: Stage Colors ---
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

const TaskDetailPanel = ({ task, stages, onClose, onUpdateTask }) => {
  const [comment, setComment] = useState("");
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const statusRef = useRef(null);
  const dispatch = useDispatch();

  const taskId = task?.id;
  const allTasksMap = useSelector((state) => state.projects.project?.tasks);

  console.log("task : ",allTasksMap);

  const liveTask = useMemo(() => {
    if (!allTasksMap) return null;

    // Heavy Loop Logic
    for (const stageKey of Object.keys(allTasksMap)) {
      const foundTask = allTasksMap[stageKey].find((t) => t.id === taskId);
      if (foundTask) {
        return { ...foundTask, stage: stageKey };
      }
    }
    return null;
  }, [allTasksMap, taskId]); // Dependency: Sirf jab Redux data ya ID badle tab chalega

  const taskToRender = liveTask || initialTask;

  console.log("taskToRender",taskToRender);
  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (statusRef.current && !statusRef.current.contains(event.target)) {
        setIsStatusOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleStatus = (stageId, stage, oldStage) => {
    dispatch(
      moveTaskOptimistically({
        taskId: stageId,
        fromStage: oldStage,
        toStage: stage,
        newIndex: 0,
      }),
    );
    dispatch(
      moveTaskStage({
        taskId: stageId,
        newStage: stage,
        newIndex: 0,
      }),
    );

    setIsStatusOpen(false);
  };

  if (!task) return null;

  return (
    <>
      {/* 1. Dark Overlay */}
      <div
        className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[60] transition-opacity duration-300"
        onClick={onClose}
      />

      {/* 2. Slide-Over Panel */}
      <div className="fixed inset-y-0 right-0 w-full md:w-[650px] bg-white shadow-2xl z-[70] transform transition-transform duration-300 ease-out flex flex-col border-l border-gray-100">
        {/* === HEADER === */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <div className="flex items-center gap-4">
            {/* ID Badge */}
            <div className="flex items-center gap-1.5 text-xs font-mono text-gray-400 bg-gray-50 px-2 py-1 rounded border border-gray-200">
              <Layout size={12} />
              <span>TASK-{taskToRender.id}</span>
            </div>

            {/* ✨ CUSTOM STATUS DROPDOWN ✨ */}
            <div className="relative" ref={statusRef}>
              <button
                onClick={() => setIsStatusOpen(!isStatusOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wide border transition-all duration-200 ${getStageStyles(task.stage)}`}
              >
                {taskToRender.stage}
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${isStatusOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Dropdown Menu */}
              {isStatusOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden py-1 animate-in fade-in zoom-in-95 duration-200">
                  {stages.map((stageId) => {
                    // ✅ 1. Match ID to get Label
                    const stageObj = AVAILABLE_STAGES.find(
                      (s) => s.id === stageId,
                    );
                    const label = stageObj ? stageObj.label : taskToRender.stage; // Agar label na mile to ID dikha do

                    return (
                      <button
                        key={stageId}
                        onClick={() => {
                          handleStatus(taskToRender.id, stageObj.id, taskToRender.stage);
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-between group"
                      >
                        {/* ✅ 2. Use Label Here */}
                        <span>{label}</span>

                        {stageId === taskToRender.stage && (
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
              title="Delete Task"
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
            {/* Title Input */}
            <div className="mb-8 group">
              <textarea
                rows={1}
                defaultValue={taskToRender.name}
                className="w-full text-3xl font-bold text-gray-900 border-none focus:ring-0 p-0 placeholder-gray-300 resize-none bg-transparent group-hover:bg-gray-50/50 rounded transition-colors -ml-2 px-2 py-1 leading-tight"
                placeholder="Task Title"
                onInput={(e) => {
                  e.target.style.height = "auto";
                  e.target.style.height = e.target.scrollHeight + "px";
                }}
              />
            </div>

            {/* Properties Grid */}
            <div className="grid grid-cols-2 gap-y-6 gap-x-12 mb-10 p-5 bg-gray-50/50 rounded-xl border border-gray-100/50">
              {/* Assignee */}
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
                        {taskToRender.assigned_to.first_name} {taskToRender.assigned_to.last_name}
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

              {/* Due Date */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Due Date
                </label>
                <div className="flex items-center gap-2 group cursor-pointer hover:bg-gray-100 p-1.5 -ml-1.5 rounded-lg transition-colors">
                  <Calendar
                    size={16}
                    className="text-gray-400 group-hover:text-gray-600"
                  />
                  <span
                    className={`text-sm font-medium ${taskToRender.due_date ? "text-gray-700" : "text-gray-400"}`}
                  >
                    {taskToRender.due_date ? formatDate(taskToRender.due_date) : "Set date"}
                  </span>
                </div>
              </div>

              {/* Priority */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Priority
                </label>
                <div className="relative ">
                  <select
                    defaultValue={taskToRender.priority}
                    className="appearance-none bg-transparent pl-2 pr-8 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                    <option value="critical">Critical 🔥</option>
                  </select>
                  {/* Custom Priority Indicator */}
                  <div
                    className={`absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full 
                                ${taskToRender.priority === "high" ? "bg-red-500" : taskToRender.priority === "medium" ? "bg-yellow-500" : "bg-blue-400"}`}
                  ></div>
                </div>
              </div>

              {/* Reporter (Optional extra field) */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Reporter
                </label>
                <div className="flex items-center gap-2 p-1.5 -ml-1.5">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold">
                    ME
                  </div>
                  <span className="text-sm text-gray-600">You</span>
                </div>
              </div>
            </div>

            {/* Description */}
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
                  defaultValue={taskToRender.description}
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

              {/* Comment Input */}
              <div className="flex gap-4 mb-8">
                <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold shadow-sm shrink-0">
                  ME
                </div>
                <div className="flex-1">
                  <div className="relative shadow-sm bg-white rounded-xl border border-gray-200 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full rounded-t-xl p-3 text-sm focus:outline-none min-h-[60px] resize-none"
                      placeholder="Write a comment..."
                    ></textarea>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded-b-xl border-t border-gray-100">
                      <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded transition">
                        <Paperclip size={16} />
                      </button>
                      <button
                        disabled={!comment.trim()}
                        className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition flex items-center gap-2 shadow-sm"
                      >
                        Send <Send size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline / History */}
              <div className="space-y-6 relative before:absolute before:left-4 before:top-2 before:bottom-0 before:w-0.5 before:bg-gray-100">
                {/* Dummy Action (Status Change) */}
                <div className="relative pl-12">
                  <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-white border-2 border-gray-100 flex items-center justify-center z-10">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  </div>
                  <div className="pt-1">
                    <p className="text-sm text-gray-800">
                      <span className="font-semibold">Rahul</span> changed
                      status from
                      <span className="mx-1 px-1.5 py-0.5 bg-gray-100 rounded text-xs font-medium text-gray-600">
                        Todo
                      </span>
                      to
                      <span className="mx-1 px-1.5 py-0.5 bg-blue-50 rounded text-xs font-medium text-blue-600">
                        In Progress
                      </span>
                    </p>
                    <span className="text-xs text-gray-400 mt-1 block">
                      2 hours ago
                    </span>
                  </div>
                </div>

                {/* Dummy Comment */}
                <div className="relative pl-12">
                  <img
                    src="https://ui-avatars.com/api/?name=John+Doe&background=0D8ABC&color=fff"
                    className="absolute left-0 top-0 w-8 h-8 rounded-full border-2 border-white shadow-sm z-10"
                    alt=""
                  />
                  <div className="bg-white border border-gray-200 p-3 rounded-lg rounded-tl-none shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-bold text-gray-900">
                        John Doe
                      </span>
                      <span className="text-xs text-gray-400">Yesterday</span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Please check the Figma file for updated color codes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskDetailPanel;
