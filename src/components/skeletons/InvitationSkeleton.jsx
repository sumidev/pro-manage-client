import Skeleton from "../ui/Skeleton";

/** @param {{ embedded?: boolean }} props — embedded: no outer centering (inside InvitationLayout) */
const InvitationSkeleton = ({ embedded = false }) => {
  const inner = (
    <div className={embedded ? "space-y-5" : "w-full max-w-md rounded-lg p-8 space-y-5"} style={embedded ? undefined : { background: "var(--bg-card)", border: "1px solid var(--border)", boxShadow: "var(--shadow-lg)" }}>
      <div className="flex flex-col items-center gap-3">
        <Skeleton className="w-14 h-14 rounded-lg" />
        <Skeleton className="h-5 rounded w-48" />
        <Skeleton className="h-4 rounded w-full" />
      </div>
      <Skeleton className="h-24 rounded-lg w-full" />
      <div className="flex gap-3 pt-2">
        <Skeleton className="h-10 rounded flex-1" />
        <Skeleton className="h-10 rounded flex-1" />
      </div>
    </div>
  );

  if (embedded) return inner;

  return (
    <div className="flex min-h-dvh items-center justify-center p-4" style={{ background: "var(--bg-app)" }}>
      {inner}
    </div>
  );
};

export default InvitationSkeleton;
