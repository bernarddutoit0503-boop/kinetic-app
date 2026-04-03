export const SkeletonCard = () => (
  <div className="glass-panel rounded-xl overflow-hidden flex flex-col md:flex-row animate-pulse">
    <div className="md:w-1/3 h-48 bg-surface-bright shrink-0"></div>
    <div className="p-6 md:w-2/3 space-y-3">
      <div className="flex gap-2">
        <div className="h-4 bg-surface-bright rounded-full w-16"></div>
        <div className="h-4 bg-surface-bright rounded-full w-12"></div>
      </div>
      <div className="h-5 bg-surface-bright rounded w-4/5"></div>
      <div className="h-4 bg-surface-bright rounded w-full"></div>
      <div className="h-4 bg-surface-bright rounded w-2/3"></div>
    </div>
  </div>
);

export const SkeletonFeatured = () => (
  <div className="h-[480px] w-full rounded-xl bg-surface-bright animate-pulse"></div>
);

export const SkeletonGearCard = () => (
  <div className="bg-surface rounded-xl overflow-hidden animate-pulse border border-outline-variant/5">
    <div className="aspect-video bg-surface-bright"></div>
    <div className="p-8 space-y-4">
      <div className="h-7 bg-surface-bright rounded w-3/4"></div>
      <div className="h-4 bg-surface-bright rounded w-full"></div>
      <div className="h-4 bg-surface-bright rounded w-2/3"></div>
      <div className="flex justify-between pt-2">
        <div className="h-3 bg-surface-bright rounded w-20"></div>
        <div className="h-3 bg-surface-bright rounded w-8"></div>
      </div>
    </div>
  </div>
);
