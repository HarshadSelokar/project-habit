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


export type GoalType = "weekly" | "monthly" | "yearly";

export type Goals = {
  id: string;
  title: string;
  type: GoalType;
  completed: boolean;
};