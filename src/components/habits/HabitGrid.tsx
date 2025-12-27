import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import type { Habit, HabitLog } from "../../types";
import { getDaysOfMonth } from "../../utils/dates";
// import dayjs from "dayjs"; // Removed unused import

const YEAR = 2025;
const MONTH = 12;

type Props = {
  userId: string;
};

export default function HabitGrid({ userId }: Props) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [saving, setSaving] = useState(false);

  const days = getDaysOfMonth(YEAR, MONTH);

  useEffect(() => {
    if (!userId) return;
    fetchHabits();
    fetchLogs();
  }, [userId]);

  const fetchHabits = async () => {
    const { data } = await supabase
      .from("habits")
      .select("*")
      .eq("user_id", userId);

    if (data) setHabits(data);
  };

  const fetchLogs = async () => {
    const { data } = await supabase
      .from("habit_logs")
      .select("*")
      .eq("user_id", userId);

    if (data) setLogs(data);
  };

  const toggleHabit = async (habitId: string, date: string, completed: boolean) => {
    setSaving(true);
    await supabase
      .from("habit_logs")
      .upsert({ habit_id: habitId, user_id: userId, date, completed });
    fetchLogs();
    setSaving(false);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col gap-6">
        {habits.length === 0 ? (
          <div className="text-center text-gray-400 py-8">No habits found.</div>
        ) : (
          habits.map(habit => {
            const completedDays = days.filter(day => {
              const log = logs.find(l => l.habit_id === habit.id && l.date === day);
              return log?.completed;
            }).length;
            const percent = Math.round((completedDays / days.length) * 100);
            return (
              <div key={habit.id} className="bg-gray-950 rounded-xl shadow p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-blue-300">{habit.name}</span>
                  <span className="text-xs text-gray-400">{percent}% complete</span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {days.map(day => {
                    const log = logs.find(l => l.habit_id === habit.id && l.date === day);
                    return (
                      <button
                        key={day}
                        disabled={saving}
                        onClick={() => toggleHabit(habit.id, day, !log?.completed)}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-150
                          ${log?.completed ? 'bg-blue-500 border-blue-500' : 'bg-gray-900 border-gray-700'}
                          hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400`}
                        title={`Mark ${habit.name} as ${log?.completed ? 'incomplete' : 'complete'} for ${day}`}
                      >
                        {log?.completed && (
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
