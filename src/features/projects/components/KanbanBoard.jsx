import { DragDropContext } from "@hello-pangea/dnd";
import Column from "../../../components/board/Column";

export const KanbanBoard = ({onDragEnd, stages, tasks, onTaskClick}) => {
  return (
    <div className="flex-1 overflow-x-auto overflow-y-hidden p-6">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex h-full gap-6 min-w-max">
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
