import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import type { DailyCompletion } from "../../utils/analytics";
import dayjs from "dayjs";

type Props = {
  data: DailyCompletion[];
};

export default function CompletionChart({ data }: Props) {
  return (
    <div>
      <h2 className="text-sm font-semibold mb-2 text-gray-300">
        Habit Completion %
      </h2>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <XAxis
            dataKey="date"
            tickFormatter={d => dayjs(d).date().toString()}
            stroke="#666"
          />
          <YAxis domain={[0, 100]} stroke="#666" />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="percentage"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
