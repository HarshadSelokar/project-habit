import dayjs from "dayjs";

export const getDaysOfMonth = (year: number, month: number) => {
  const daysInMonth = dayjs(`${year}-${month}-01`).daysInMonth();
  return Array.from({ length: daysInMonth }, (_, i) =>
    dayjs(`${year}-${month}-${i + 1}`).format("YYYY-MM-DD")
  );
};
