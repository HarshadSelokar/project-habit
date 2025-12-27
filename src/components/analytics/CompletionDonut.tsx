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
    <div className="flex flex-col items-center">
      <h2 className="text-sm font-semibold mb-2 text-gray-300">
        Overall Completion
      </h2>

      <ResponsiveContainer width={180} height={180}>
        <PieChart>
          <Pie
            data={data}
            innerRadius={60}
            outerRadius={80}
            dataKey="value"
            startAngle={90}
            endAngle={-270}
          >
            <Cell fill="#3B82F6" />
            <Cell fill="#2A2A2A" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      <p className="text-xl font-bold mt-2">{percentage}%</p>
    </div>
  );
}
