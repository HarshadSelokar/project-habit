import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

type Props = {
  percentage: number;
};

export default function CompletionDonut({ percentage }: Props) {
  const data = [
    { name: "Completed", value: percentage },
    { name: "Remaining", value: 100 - percentage }
  ];

  return (
    <div className="w-full flex flex-col items-center">
      <h2 className="text-sm font-semibold mb-2 text-blue-200">
        Overall Completion
      </h2>

      <div className="relative w-full max-w-xs">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={data}
              innerRadius={70}
              outerRadius={100}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
            >
              <Cell fill="#3B82F6" />
              <Cell fill="#1F2937" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{percentage}%</div>
            <div className="text-xs text-gray-400">of habits completed</div>
          </div>
        </div>
      </div>
    </div>
  );
}
