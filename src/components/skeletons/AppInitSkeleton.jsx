import Skeleton from "../ui/Skeleton";

/** Full-screen skeleton while auth/session initializes */
const AppInitSkeleton = () => (
  <div className="app-shell flex font-sans" style={{ background: "var(--bg-app)" }}>
    <aside
      className="w-[220px] shrink-0 hidden md:flex flex-col p-4 gap-3"
      style={{ background: "var(--sidebar-bg)", borderRight: "1px solid var(--sidebar-border)" }}
    >
      <div className="flex items-center gap-2.5 mb-4">
        <Skeleton className="w-7 h-7 rounded" />
        <Skeleton className="h-4 rounded w-24" />
      </div>
      {Array.from({ length: 5 }, (_, i) => (
        <Skeleton key={i} className="h-8 rounded w-full" />
      ))}
    </aside>
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
      <div
        className="h-12 flex items-center px-4 gap-3 shrink-0"
        style={{ background: "var(--topbar-bg)", borderBottom: "1px solid var(--topbar-border)" }}
      >
        <Skeleton className="h-7 rounded w-48" />
        <div className="flex-1" />
        <Skeleton className="w-7 h-7 rounded-full" />
      </div>
      <main className="flex-1 min-h-0 overflow-y-auto p-6">
        <Skeleton className="h-6 rounded w-40 mb-4" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-20 rounded" />
          ))}
        </div>
        <Skeleton className="h-64 rounded w-full" />
      </main>
    </div>
  </div>
);

export default AppInitSkeleton;
