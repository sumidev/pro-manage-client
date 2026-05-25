import Skeleton from "../ui/Skeleton";

const StatCardSkeleton = () => (
  <div className="stat-card">
    <div className="space-y-2 flex-1">
      <Skeleton className="h-3 rounded w-20" />
      <Skeleton className="h-7 rounded w-14" />
    </div>
    <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
  </div>
);

const ProjectRowSkeleton = () => (
  <div
    className="grid grid-cols-12 px-4 py-3 items-center"
    style={{ borderBottom: "1px solid var(--bg-subtle)" }}
  >
    <div className="col-span-5 flex items-center gap-2.5">
      <Skeleton className="w-7 h-7 rounded shrink-0" />
      <Skeleton className="h-3.5 rounded w-32" />
    </div>
    <div className="col-span-3">
      <Skeleton className="h-5 rounded w-16" />
    </div>
    <div className="col-span-4">
      <Skeleton className="h-3 rounded w-24" />
    </div>
  </div>
);

const TaskRowSkeleton = () => (
  <div
    className="flex items-start gap-3 px-4 py-3"
    style={{ borderBottom: "1px solid var(--bg-subtle)" }}
  >
    <Skeleton className="w-4 h-4 rounded-full shrink-0 mt-0.5" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-3.5 rounded w-4/5" />
      <div className="flex gap-2">
        <Skeleton className="h-5 rounded w-14" />
        <Skeleton className="h-3 rounded w-20" />
      </div>
    </div>
  </div>
);

const DashboardSkeleton = () => (
  <div className="p-6 max-w-7xl mx-auto space-y-6">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="space-y-2">
        <Skeleton className="h-6 rounded w-56" />
        <Skeleton className="h-4 rounded w-72" />
      </div>
      <Skeleton className="h-9 rounded w-32 shrink-0" />
    </div>

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }, (_, i) => (
        <StatCardSkeleton key={i} />
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div className="lg:col-span-2">
        <div className="flex items-center justify-between mb-3">
          <Skeleton className="h-4 rounded w-28" />
          <Skeleton className="h-3 rounded w-16" />
        </div>
        <div
          className="rounded border overflow-hidden"
          style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
        >
          <div
            className="grid grid-cols-12 px-4 py-2"
            style={{ background: "var(--bg-subtle)", borderBottom: "1px solid var(--border)" }}
          >
            <Skeleton className="col-span-5 h-2.5 rounded" />
            <Skeleton className="col-span-3 h-2.5 rounded" />
            <Skeleton className="col-span-4 h-2.5 rounded" />
          </div>
          {Array.from({ length: 5 }, (_, i) => (
            <ProjectRowSkeleton key={i} />
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <Skeleton className="h-4 rounded w-20" />
          <Skeleton className="h-5 rounded w-8" />
        </div>
        <div
          className="rounded border overflow-hidden"
          style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
        >
          {Array.from({ length: 4 }, (_, i) => (
            <TaskRowSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default DashboardSkeleton;
