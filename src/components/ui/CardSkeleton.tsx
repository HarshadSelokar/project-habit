export default function CardSkeleton() {
  return (
    <div className="bg-card p-4 rounded-xl animate-pulse">
      <div className="h-4 bg-muted rounded w-1/3 mb-3" />
      <div className="h-20 bg-muted rounded" />
    </div>
  );
}
