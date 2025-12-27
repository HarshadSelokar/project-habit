import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { signOut } from "../lib/auth";
import HabitGrid from "@/components/habits/HabitGrid";
import CardSkeleton from "@/components/ui/CardSkeleton";
import { supabase } from "@/lib/supabase";
import type { HabitLog, Goals } from "@/types";
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
  const [habitCount, setHabitCount] = useState(0);
  const [goals, setGoals] = useState<Goals[]>([]);

  const days = getDaysOfMonth(YEAR, MONTH);

  useEffect(() => {
    if (!userId) return;
    fetchData();
    fetchGoals();
  }, [userId]);

  const fetchData = async () => {
    const { data: habits } = await supabase
      .from("habits")
      .select("id")
      .eq("user_id", userId);

    const { data: logs } = await supabase
      .from("habit_logs")
      .select("*")
      .eq("user_id", userId);

    if (habits) setHabitCount(habits.length);
    if (logs) setLogs(logs);
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
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-300">December</h1>
        <button
          onClick={signOut}
          className="text-sm text-gray-400 hover:text-white"
        >
          Logout
        </button>
      </div>

      <div className="bg-card p-4 rounded-xl">
        {logs.length === 0 ? <CardSkeleton /> : userId && <HabitGrid userId={userId} />}
      </div>

      <div className="grid grid-cols-3 gap-4">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card p-4 rounded-xl">
          {logs.length === 0 ? (
            <CardSkeleton />
          ) : (
            <CompletionDonut percentage={overall} />
          )}
        </div>
        <div className="bg-card p-4 rounded-xl">
          {logs.length === 0 ? (
            <CardSkeleton />
          ) : (
            <CompletionChart data={analytics} />
          )}
        </div>
      </div>
    </div>
  );
}
