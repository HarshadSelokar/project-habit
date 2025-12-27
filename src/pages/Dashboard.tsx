import { useEffect, useState } from "react";
import HabitGrid from "../components/habits/HabitGrid";
import { supabase } from "../lib/supabase";
import { HabitLog } from "../types";
import { getDaysOfMonth } from "../utils/dates";
import { calculateDailyCompletion } from "../utils/analytics";
import CompletionChart from "../components/analytics/CompletionChart";
import CompletionDonut from "../components/analytics/CompletionDonut";
import { calculateOverallCompletion } from "../utils/analytics";

const YEAR = 2025;
const MONTH = 12;
const userId = "TEMP_USER_ID";

export default function Dashboard() {
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [habitCount, setHabitCount] = useState(0);

  const days = getDaysOfMonth(YEAR, MONTH);

  useEffect(() => {
    fetchData();
  }, []);

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

  const analytics = calculateDailyCompletion(logs, days, habitCount);
  const overall = calculateOverallCompletion(
    logs,
    habitCount,
    days.length
  );

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">December</h1>

      <div className="bg-card p-4 rounded-xl">
        <HabitGrid />
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-card p-4 rounded-xl col-span-1">
          <CompletionDonut percentage={overall} />
        </div>

        <div className="bg-card p-4 rounded-xl col-span-3">
          <CompletionChart data={analytics} />
        </div>
      </div>
    </div>
  );
}
