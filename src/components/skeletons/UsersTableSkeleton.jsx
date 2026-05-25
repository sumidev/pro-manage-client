import Skeleton from "../ui/Skeleton";

const UserRowSkeleton = () => (
  <div
    className="grid grid-cols-12 px-4 py-3 items-center"
    style={{ borderBottom: "1px solid var(--bg-subtle)" }}
  >
    <div className="col-span-4 flex items-center gap-2.5">
      <Skeleton className="w-7 h-7 rounded-full shrink-0" />
      <Skeleton className="h-3.5 rounded w-28" />
    </div>
    <div className="col-span-5">
      <Skeleton className="h-3.5 rounded w-40" />
    </div>
    <div className="col-span-3">
      <Skeleton className="h-7 rounded w-24" />
    </div>
  </div>
);

const UsersTableSkeleton = ({ rows = 6 }) => (
  <>
    {Array.from({ length: rows }, (_, i) => (
      <UserRowSkeleton key={i} />
    ))}
  </>
);

export default UsersTableSkeleton;
