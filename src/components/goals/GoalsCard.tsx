import type { Goals } from "../../types";

type Props = {
  title: string;
  goals: Goals[];
  onToggle: (id: string, completed: boolean) => void;
};

export default function GoalsCard({ title, goals, onToggle }: Props) {
  return (
    <div className="bg-card p-4 rounded-xl">
      <h3 className="text-sm font-semibold text-gray-300 mb-3">{title}</h3>

      {goals.length === 0 ? (
        <p className="text-sm text-gray-400">No goals added yet.</p>
      ) : (
        <ul className="space-y-2">
          {goals.map(goal => (
            <li
              key={goal.id}
              className="flex items-center justify-between"
            >
              <span
                className={
                  goal.completed
                    ? "line-through text-gray-400"
                    : ""
                }
              >
                {goal.title}
              </span>

              <input
                type="checkbox"
                checked={goal.completed}
                onChange={() =>
                  onToggle(goal.id, !goal.completed)
                }
                className="accent-blue-500"
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
