import Skeleton from "../ui/Skeleton";
import KanbanBoardSkeleton from "./KanbanBoardSkeleton";

const ProjectBoardHeaderSkeleton = () => (
  <div
    className="shrink-0 px-6 pt-4 pb-0"
    style={{ background: "var(--bg-card)", borderBottom: "1px solid var(--border)" }}
  >
    <div className="flex items-start justify-between gap-4 mb-1">
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <Skeleton className="w-7 h-7 rounded shrink-0 mt-1" />
        <div className="flex-1 space-y-2 min-w-0">
          <Skeleton className="h-6 rounded w-48 max-w-full" />
          <Skeleton className="h-3.5 rounded w-64 max-w-full" />
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0 pt-1">
        <div className="flex -space-x-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="w-7 h-7 rounded-full ring-2 ring-white" />
          ))}
        </div>
        <Skeleton className="h-7 rounded w-24" />
        <Skeleton className="w-8 h-8 rounded" />
      </div>
    </div>
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 rounded w-40" />
        <Skeleton className="h-8 rounded w-24" />
      </div>
      <Skeleton className="h-8 rounded w-28" />
    </div>
  </div>
);

const ProjectBoardSkeleton = () => (
  <div className="flex flex-col flex-1 min-h-0 h-full">
    <ProjectBoardHeaderSkeleton />
    <KanbanBoardSkeleton />
  </div>
);

export default ProjectBoardSkeleton;
