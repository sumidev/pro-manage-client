import { DragDropContext } from "@hello-pangea/dnd";
import Column from "../../../components/board/Column";

export const KanbanBoard = ({ onDragEnd, stages, tasks, onTaskClick }) => {
  return (
    // flex-1 + overflow-hidden so it fills remaining height from parent
    <div className="flex-1 min-h-0 overflow-hidden board-scroll" style={{ background: "var(--bg-app)" }}>
      <DragDropContext onDragEnd={onDragEnd}>
        {/* Full height flex row — columns scroll horizontally */}
        <div
          className="flex gap-3 p-4 h-full min-h-0"
          style={{ minWidth: "max-content" }}
        >
          {stages.map((stageName) => (
            <Column
              key={stageName}
              stageId={stageName}
              title={stageName}
              tasks={tasks[stageName] || []}
              onTaskClick={onTaskClick}
            />
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};
