"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { formatCurrency } from "@/lib/format";

// docs/BRAND_GUIDE.md §04 "Debt Breakdown" chart spec: Rich Green, Deep
// Purple, Divider Gray slices. Extended with muted text and two lighter
// tints (color-mix, no new brand hex values) for the schema's other
// liability types when more than three are present.
const SLICE_COLORS = [
  "var(--color-purple-solid)",
  "var(--color-green-solid)",
  "var(--color-border)",
  "var(--color-muted)",
  "color-mix(in srgb, var(--color-purple-solid) 55%, white)",
  "color-mix(in srgb, var(--color-green-solid) 55%, white)",
];

export type DebtBreakdownSlice = { label: string; value: number };

export function DebtBreakdownChart({ data }: { data: readonly DebtBreakdownSlice[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie
          data={data as DebtBreakdownSlice[]}
          dataKey="value"
          nameKey="label"
          innerRadius={64}
          outerRadius={100}
          paddingAngle={2}
          stroke="var(--color-surface)"
          strokeWidth={2}
        >
          {data.map((slice, index) => (
            <Cell key={slice.label} fill={SLICE_COLORS[index % SLICE_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => formatCurrency(typeof value === "number" ? value : Number(value))}
          contentStyle={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "0.5rem",
            color: "var(--color-foreground)",
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
