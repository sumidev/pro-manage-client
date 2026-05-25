import Skeleton from "../ui/Skeleton";

const ProjectCardSkeleton = () => (
  <div
    className="rounded border overflow-hidden"
    style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
  >
    <Skeleton className="h-1 w-full rounded-none" />
    <div className="p-4">
      <div className="flex items-center gap-2.5 mb-3">
        <Skeleton className="w-8 h-8 rounded shrink-0" />
        <div className="flex-1 space-y-1.5">
          <Skeleton className="h-3 rounded w-3/4" />
          <Skeleton className="h-2.5 rounded w-1/2" />
        </div>
      </div>
      <div className="space-y-1.5 mb-4">
        <Skeleton className="h-2.5 rounded w-full" />
        <Skeleton className="h-2.5 rounded w-4/5" />
      </div>
      <div
        className="flex items-center justify-between pt-3"
        style={{ borderTop: "1px solid var(--bg-subtle)" }}
      >
        <Skeleton className="h-2.5 rounded w-16" />
        <Skeleton className="h-2.5 rounded w-12" />
      </div>
    </div>
  </div>
);

const ProjectListSkeleton = ({ count = 8 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    {Array.from({ length: count }, (_, i) => (
      <ProjectCardSkeleton key={i} />
    ))}
  </div>
);

export default ProjectListSkeleton;
