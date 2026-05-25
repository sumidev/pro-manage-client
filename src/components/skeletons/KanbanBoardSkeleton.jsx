import Skeleton from "../ui/Skeleton";

const TaskCardSkeleton = () => (
  <div
    className="p-3 rounded space-y-2.5"
    style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
  >
    <Skeleton className="h-3.5 rounded w-full" />
    <Skeleton className="h-3 rounded w-2/3" />
    <div className="flex items-center justify-between pt-1">
      <Skeleton className="h-5 rounded w-14" />
      <div className="flex gap-1.5">
        <Skeleton className="w-5 h-5 rounded-full" />
        <Skeleton className="h-3 rounded w-8" />
      </div>
    </div>
  </div>
);

const ColumnSkeleton = ({ taskCount = 3 }) => (
  <div
    className="flex flex-col w-72 shrink-0 rounded"
    style={{ background: "var(--bg-subtle)", border: "1px solid var(--border)", maxHeight: "100%" }}
  >
    <div
      className="flex items-center justify-between px-3 py-2.5 shrink-0"
      style={{ borderBottom: "1px solid var(--border)" }}
    >
      <div className="flex items-center gap-2">
        <Skeleton className="w-1 h-4 rounded-full" />
        <Skeleton className="h-3.5 rounded w-20" />
        <Skeleton className="h-4 w-5 rounded-full" />
      </div>
      <Skeleton className="w-6 h-6 rounded" />
    </div>
    <div className="flex-1 p-2 space-y-2 overflow-hidden">
      {Array.from({ length: taskCount }, (_, i) => (
        <TaskCardSkeleton key={i} />
      ))}
    </div>
  </div>
);

const KanbanBoardSkeleton = ({ columns = 4 }) => (
  <div className="flex-1 overflow-hidden" style={{ background: "var(--bg-app)" }}>
    <div className="flex gap-3 p-4 h-full" style={{ minWidth: "max-content" }}>
      {Array.from({ length: columns }, (_, i) => (
        <ColumnSkeleton key={i} taskCount={i % 2 === 0 ? 3 : 2} />
      ))}
    </div>
  </div>
);

export default KanbanBoardSkeleton;
