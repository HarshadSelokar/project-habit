export default function FullScreenLoader() {
  return (
    <div className="h-screen flex items-center justify-center bg-bg">
      <div className="animate-pulse text-gray-400">
        Loading dashboard…
      </div>
    </div>
  );
}
