export type Habit = {
  id: string;
  name: string;
};

export type HabitLog = {
  id?: string;
  habit_id: string;
  user_id: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
};
