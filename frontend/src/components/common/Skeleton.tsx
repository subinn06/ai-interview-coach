import clsx from "clsx";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={clsx("animate-pulse bg-slate-200 rounded-lg", className)}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex items-center justify-between">
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-16" />
      </div>
      <Skeleton className="w-12 h-12 rounded-2xl" />
    </div>
  );
}
