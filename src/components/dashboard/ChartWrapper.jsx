import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

const pieColors = ["#FACC15", "#3B82F6", "#22C55E", "#A855F7", "#F97316"];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-md">
      {label ? (
        <p className="text-[12px] font-semibold text-slate-900">{label}</p>
      ) : null}

      {payload.map((entry, index) => (
        <p key={index} className="text-[11px] text-slate-600">
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
}

export default function ChartWrapper({
  title,
  type = "line",
  data = [],
  dataKey,
  xKey = "name",
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
      <div className="border-b border-slate-200 px-4 py-3">
        <h3 className="font-condensed text-[12px] font-bold uppercase tracking-[0.12em] text-slate-900">
          {title}
        </h3>
      </div>

      <div className="h-[300px] p-4 sm:h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          {type === "line" ? (
            <LineChart
              data={data}
              margin={{ top: 8, right: 10, left: -12, bottom: 0 }}
            >
              <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" />
              <XAxis
                dataKey={xKey}
                stroke="#64748B"
                tick={{ fontSize: 11 }}
              />
              <YAxis stroke="#64748B" tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke="#3B82F6"
                strokeWidth={2.5}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          ) : null}

          {type === "bar" ? (
            <BarChart
              data={data}
              margin={{ top: 8, right: 10, left: -12, bottom: 0 }}
            >
              <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" />
              <XAxis
                dataKey={xKey}
                stroke="#64748B"
                tick={{ fontSize: 11 }}
              />
              <YAxis stroke="#64748B" tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey={dataKey}
                radius={[6, 6, 0, 0]}
                fill="#FACC15"
                barSize={28}
              />
            </BarChart>
          ) : null}

          {type === "pie" ? (
            <PieChart>
              <Tooltip content={<CustomTooltip />} />
              <Pie
                data={data}
                dataKey={dataKey || "value"}
                nameKey={xKey}
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={82}
                paddingAngle={3}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={pieColors[index % pieColors.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          ) : null}
        </ResponsiveContainer>
      </div>
    </div>
  );
}