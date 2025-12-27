import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { signOut } from "../lib/auth";
import HabitGrid from "@/components/habits/HabitGrid";
import AddHabitForm from "@/components/habits/AddHabitForm";
import CardSkeleton from "@/components/ui/CardSkeleton";
import { supabase } from "@/lib/supabase";
import type { Habit, HabitLog, Goals } from "@/types";
import { getDaysOfMonth } from "@/utils/dates";
import { calculateDailyCompletion, calculateOverallCompletion } from "@/utils/analytics";
import CompletionChart from "@/components/analytics/CompletionChart";
import CompletionDonut from "@/components/analytics/CompletionDonut";
import GoalsCard from "@/components/goals/GoalsCard";

const YEAR = 2025;
const MONTH = 12;

export default function Dashboard() {
  const { user } = useAuth();
  const userId = user?.id;

  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitCount, setHabitCount] = useState(0);
  const [loadingData, setLoadingData] = useState(true);
  const [goals, setGoals] = useState<Goals[]>([]);

  const days = getDaysOfMonth(YEAR, MONTH);

  useEffect(() => {
    if (!userId) return;
    fetchData();
    fetchGoals();
  }, [userId]);

  const fetchData = async () => {
    setLoadingData(true);
    const { data: habits } = await supabase
      .from("habits")
      .select("id")
      .eq("user_id", userId);

    const { data: logs } = await supabase
      .from("habit_logs")
      .select("*")
      .eq("user_id", userId);

    if (habits) {
      setHabitCount(habits.length);
    }
    if (logs) setLogs(logs);
    // fetch full habit records for empty state handling
    const { data: fullHabits } = await supabase
      .from("habits")
      .select("*")
      .eq("user_id", userId);
    if (fullHabits) setHabits(fullHabits);
    setLoadingData(false);
  };

  const fetchGoals = async () => {
    const { data } = await supabase
      .from("goals")
      .select("*")
      .eq("user_id", userId);

    if (data) setGoals(data);
  };

  const toggleGoal = async (id: string, completed: boolean) => {
    await supabase.from("goals").update({ completed }).eq("id", id);
    fetchGoals();
  };

  const analytics = calculateDailyCompletion(logs, days, habitCount);
  const overall = calculateOverallCompletion(logs, habitCount, days.length);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Navigation Bar */}
      <nav className="w-full px-4 py-3 flex items-center justify-between bg-gray-950 shadow-md sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-wide text-blue-400">Habit Analytics</span>
          <span className="hidden sm:inline text-xs text-gray-400 ml-2">{user?.email}</span>
        </div>
        <button
          onClick={signOut}
          className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-sm font-semibold transition"
        >
          Logout
        </button>
      </nav>

      <main className="max-w-6xl mx-auto px-2 sm:px-6 py-8 space-y-8">
        {/* Month Header & Stats */}
        <section className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold text-blue-300">December Overview</h1>
          <div className="flex gap-4">
            <div className="bg-gray-900 rounded-lg px-4 py-2 text-center">
              <div className="text-lg font-bold">{habitCount}</div>
              <div className="text-xs text-gray-400">Habits</div>
            </div>
            <div className="bg-gray-900 rounded-lg px-4 py-2 text-center">
              <div className="text-lg font-bold">{overall}%</div>
              <div className="text-xs text-gray-400">Completion</div>
            </div>
          </div>
        </section>

        {/* Habits Section */}
        <section>
          <h2 className="text-xl font-semibold mb-3 text-blue-200">Your Habits</h2>
          <AddHabitForm userId={userId || ""} onCreated={fetchData} />
          <div className="bg-gray-900 p-4 rounded-xl shadow-lg">
            {loadingData ? (
              <CardSkeleton />
            ) : habits.length === 0 ? (
              <div className="py-8 text-center text-gray-400">
                <p className="mb-4">You don't have any habits yet.</p>
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={async () => {
                      if (!userId) return;
                      // seed demo data for quick testing
                      await supabase.from('habits').insert([
                        { user_id: userId, name: 'Drink Water' },
                        { user_id: userId, name: 'Morning Walk' }
                      ]);
                      const today = days[0];
                      // Insert logs for the created habits by selecting their ids
                      const { data: created } = await supabase.from('habits').select('id').eq('user_id', userId).in('name', ['Drink Water','Morning Walk']);
                      if (created && created.length > 0) {
                        await supabase.from('habit_logs').insert(created.map((h:any) => ({ user_id: userId, habit_id: h.id, date: today, completed: true })));
                      }
                      fetchData();
                    }}
                    className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500"
                  >
                    Add Demo Data
                  </button>

                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 rounded border border-gray-700"
                  >
                    Refresh
                  </button>
                </div>
              </div>
            ) : (
              userId && <HabitGrid userId={userId} />
            )}
          </div>
        </section>

        {/* Goals Section */}
        <section>
          <h2 className="text-xl font-semibold mb-3 text-blue-200">Your Goals</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <GoalsCard
              title="Weekly Goals"
              goals={goals.filter(g => g.type === "weekly")}
              onToggle={toggleGoal}
            />
            <GoalsCard
              title="Monthly Goals"
              goals={goals.filter(g => g.type === "monthly")}
              onToggle={toggleGoal}
            />
            <GoalsCard
              title="Annual Goals"
              goals={goals.filter(g => g.type === "yearly")}
              onToggle={toggleGoal}
            />
          </div>
        </section>

        {/* Analytics Section */}
        <section>
          <h2 className="text-xl font-semibold mb-3 text-blue-200">Analytics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-900 p-4 rounded-xl shadow-lg flex flex-col items-center">
              {loadingData ? (
                <CardSkeleton />
              ) : habitCount === 0 ? (
                <div className="py-8 text-center text-gray-400">
                  <p className="mb-2">No habits yet — add a habit to see analytics.</p>
                </div>
              ) : logs.length === 0 ? (
                <div className="py-8 text-center text-gray-400">
                  <p className="mb-2">No logs recorded yet — mark habits to populate analytics.</p>
                </div>
              ) : (
                <CompletionDonut percentage={overall} />
              )}
            </div>
            <div className="bg-gray-900 p-4 rounded-xl shadow-lg">
              {loadingData ? (
                <CardSkeleton />
              ) : habitCount === 0 ? (
                <div className="py-8 text-center text-gray-400">
                  <p className="mb-2">No habits yet — add a habit to see analytics.</p>
                </div>
              ) : logs.length === 0 ? (
                <div className="py-8 text-center text-gray-400">
                  <p className="mb-2">No logs recorded yet — mark habits to populate analytics.</p>
                </div>
              ) : (
                <CompletionChart data={analytics} />
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
