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
      <h2 className="text-sm font-semibold mb-2 text-blue-200">
        Habit Completion %
      </h2>

      <div className="w-full h-64 bg-gray-900 p-2 rounded-lg">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis
              dataKey="date"
              tickFormatter={d => dayjs(d).date().toString()}
              stroke="#9CA3AF"
            />
            <YAxis domain={[0, 100]} stroke="#9CA3AF" />
            <Tooltip contentStyle={{ background: '#111827', border: 'none' }} itemStyle={{ color: '#fff' }} />
            <Line
              type="monotone"
              dataKey="percentage"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
