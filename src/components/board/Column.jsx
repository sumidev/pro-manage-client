import React from "react";
import { MoreHorizontal, Plus, Calendar, MessageSquare, UserX } from "lucide-react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import Tooltip from "../ui/ToolTip";
import { getUserColor } from "../../utils/helpers";

// ⚠️ Note: 'stageId' prop zaroor pass karna parent se
const Column = ({ title, count, tasks, color, onTaskClick, stageId }) => {

  return (
    <div className="w-80 flex flex-col h-full bg-gray-100/50 rounded-xl border border-gray-200 shrink-0">
      <div
        className={`p-4 flex items-center justify-between border-t-4 rounded-t-xl bg-white border-b border-gray-100 ${color}`}
      >
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wide">
            {title}
          </h3>
          <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-0.5 rounded-full">
            {count}
          </span>
        </div>
        <button className="text-gray-400 hover:text-gray-600 transition">
          <MoreHorizontal size={16} />
        </button>
      </div>

      {/* === SCROLLABLE TASK LIST (Droppable Area) === */}
      <Droppable droppableId={stageId}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            // Logic: Agar drag ho rha hai to background thoda blue tint hoga, warn original
            className={`flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar transition-colors duration-200 ${
              snapshot.isDraggingOver ? "bg-blue-50/50" : ""
            }`}
            style={{ minHeight: "100px" }} // Zaroori hai empty column ke liye
          >
            {tasks.map((task, index) => (
              // === DRAGGABLE CARD ===
              <Draggable
                key={task.id}
                draggableId={task.id.toString()}
                index={index}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    onClick={() => onTaskClick(task)}
                    style={{ ...provided.draggableProps.style }}
                    className={`
                      bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-pointer 
                      group relative transition-all duration-200
                      ${
                        snapshot.isDragging
                          ? "shadow-2xl ring-2 ring-blue-500 rotate-2 z-50" // Dragging Style
                          : "hover:shadow-md hover:border-blue-400 hover:-translate-y-1" // Normal Hover Style
                      }
                    `}
                  >
                    {/* Priority Tag */}
                    <div className="flex justify-between items-start mb-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide ${
                          task.priority === "high"
                            ? "bg-red-50 text-red-600"
                            : task.priority === "medium"
                              ? "bg-orange-50 text-orange-600"
                              : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {task.priority || "Normal"}
                      </span>
                    </div>

                    {/* Task Title */}
                    <h4 className="text-sm font-semibold text-gray-800 leading-snug mb-3">
                      {task.name}
                    </h4>

                    {/* Footer Info */}
                    <div className="flex items-center justify-between border-t border-gray-50 pt-3 mt-1">
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <div className="flex items-center gap-1 hover:text-gray-600">
                          <Calendar size={13} />
                          {task.due_date || "No Date"}
                        </div>
                        {task.comments > 0 && (
                          <div className="flex items-center gap-1 hover:text-blue-500">
                            <MessageSquare size={13} /> {task.comments}
                          </div>
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
                        <div className={`w-6 h-6 rounded-full text-white flex items-center justify-center text-[10px] font-bold shadow-sm ${getUserColor(task.assigned_to?.id || 'unassigned')}`}>
                          {task.assigned_to !== null
                            ? `${task.assigned_to?.first_name.charAt(0)}${task.assigned_to?.last_name.charAt(0)}`
                            :  <UserX size={10} />}
                        </div>
                      </Tooltip>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}

            {/* Placeholder taaki list shrink na ho */}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Column;
