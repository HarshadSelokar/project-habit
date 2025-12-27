export default function CardSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-gray-900 p-4 rounded-xl animate-pulse">
          <div className="h-4 bg-gray-800 rounded w-1/2 mb-3" />
          <div className="h-28 bg-gray-800 rounded" />
        </div>
      ))}
    </div>
  );
}
