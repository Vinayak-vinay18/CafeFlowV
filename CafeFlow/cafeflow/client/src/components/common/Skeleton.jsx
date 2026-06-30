export const SkeletonCard = () => (
  <div className="card animate-pulse">
    <div className="h-28 bg-orange-100 dark:bg-gray-700 rounded-xl mb-3" />
    <div className="h-4 bg-orange-100 dark:bg-gray-700 rounded w-3/4 mb-2" />
    <div className="h-3 bg-orange-100 dark:bg-gray-700 rounded w-1/2" />
  </div>
);

export const SkeletonRow = () => (
  <tr className="animate-pulse">
    <td colSpan={6} className="py-4">
      <div className="h-4 bg-orange-100 dark:bg-gray-700 rounded w-full" />
    </td>
  </tr>
);

export const SkeletonStat = () => (
  <div className="card animate-pulse h-24 flex items-center justify-between">
    <div className="space-y-2 w-2/3">
      <div className="h-3 bg-orange-100 dark:bg-gray-700 rounded w-1/2" />
      <div className="h-6 bg-orange-100 dark:bg-gray-700 rounded w-2/3" />
    </div>
    <div className="w-12 h-12 bg-orange-100 dark:bg-gray-700 rounded-2xl" />
  </div>
);
