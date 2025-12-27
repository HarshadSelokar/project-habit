import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import type { Habit, HabitLog } from "../../types";
import { getDaysOfMonth } from "../../utils/dates";
import dayjs from "dayjs";

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

  const toggleHabit = async (habitId: string, date: string) => {
    if (saving) return;

    setSaving(true);

    const existing = logs.find(
      l => l.habit_id === habitId && l.date === date
    );

    const payload: HabitLog = {
      habit_id: habitId,
      user_id: userId,
      date,
      completed: existing ? !existing.completed : true,
    };

    await supabase.from("habit_logs").upsert(payload);

    setSaving(false);
    fetchLogs();
  };

  const isChecked = (habitId: string, date: string) =>
    logs.some(
      l => l.habit_id === habitId && l.date === date && l.completed
    );

  return (
    <div className="overflow-x-auto">
      <h2 className="text-sm font-semibold text-gray-300 mb-2">
        Habits
      </h2>

      {habits.length === 0 ? (
        <p className="text-gray-400">
          Add habits to start tracking.
        </p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="text-left p-2">Habit</th>
              {days.map(d => (
                <th key={d} className="p-1 text-xs text-gray-400">
                  {dayjs(d).date()}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {habits.map(habit => (
              <tr key={habit.id}>
                <td className="p-2 font-medium">{habit.name}</td>
                {days.map(date => (
                  <td key={date} className="text-center">
                    <input
                      type="checkbox"
                      checked={isChecked(habit.id, date)}
                      onChange={() =>
                        toggleHabit(habit.id, date)
                      }
                      className="accent-blue-500 cursor-pointer"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
