import type { HabitLog } from "../types";

export type DailyCompletion = {
  date: string;
  percentage: number;
};

export function calculateDailyCompletion(
  logs: HabitLog[],
  days: string[],
  totalHabits: number
): DailyCompletion[] {
  return days.map(date => {
    const dayLogs = logs.filter(l => l.date === date);
    const completed = dayLogs.filter(l => l.completed).length;

    return {
      date,
      percentage: totalHabits
        ? Math.round((completed / totalHabits) * 100)
        : 0
    };
  });
}

// Calculates the overall completion percentage across all days and habits
export function calculateOverallCompletion(
  logs: HabitLog[],
  totalHabits: number,
  totalDays: number
): number {
  if (!totalHabits || !totalDays) return 0;

  const completed = logs.filter(l => l.completed).length;
  const totalPossible = totalHabits * totalDays;

  return Math.round((completed / totalPossible) * 100);
}
