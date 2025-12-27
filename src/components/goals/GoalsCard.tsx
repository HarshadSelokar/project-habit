import type { Goals } from "../../types";

type Props = {
  title: string;
  goals: Goals[];
  onToggle: (id: string, completed: boolean) => void;
};

export default function GoalsCard({ title, goals, onToggle }: Props) {
  // Helper to get icon for goal type
  const getIcon = (type: string) => {
    if (type === "weekly") return (
      <svg className="w-5 h-5 text-blue-400 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
    );
    if (type === "monthly") return (
      <svg className="w-5 h-5 text-purple-400 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    );
    if (type === "yearly") return (
      <svg className="w-5 h-5 text-yellow-400 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    );
    return null;
  };

  return (
    <div className="bg-gray-950 p-4 rounded-xl shadow-lg">
      <h3 className="text-lg font-semibold text-blue-300 mb-3 flex items-center gap-2">
        {getIcon(goals[0]?.type || "")}
        {title}
      </h3>

      {goals.length === 0 ? (
        <p className="text-sm text-gray-400">No goals added yet.</p>
      ) : (
        <ul className="space-y-2">
          {goals.map(goal => (
            <li
              key={goal.id}
              className="flex items-center justify-between bg-gray-900 rounded-lg px-3 py-2"
            >
              <span
                className={
                  goal.completed
                    ? "line-through text-gray-400"
                    : "text-white"
                }
              >
                {goal.title}
              </span>

              <button
                onClick={() => onToggle(goal.id, !goal.completed)}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-150
                  ${goal.completed ? 'bg-blue-500 border-blue-500' : 'bg-gray-900 border-gray-700'}
                  hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400`}
                title={goal.completed ? "Mark as incomplete" : "Mark as complete"}
              >
                {goal.completed && (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
