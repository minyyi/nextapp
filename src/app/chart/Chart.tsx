import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/component/ui/Card";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

interface Event {
  id: string;
  title: string;
  start: string;
  end: string;
  partnerName: string;
  partnerColor: string;
  user_id?: string;
}

interface Props {
  events: Event[];
}

interface StatsData {
  [key: string]: string | number;
  name: string;
  totalSchedules: number;
  totalHours: number;
}

const PartnerStatsChart = ({ events }: Props) => {
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toLocaleString("ko-KR", { month: "long" })
  );

  if (!events || !Array.isArray(events)) {
    return null;
  }

  // 모든 월 목록 가져오기
  const months = Array.from(
    new Set(
      events.map((event) =>
        new Date(event.start).toLocaleString("ko-KR", { month: "long" })
      )
    )
  );

  // 선택된 월의 데이터만 필터링
  const filteredEvents = events.filter(
    (event) =>
      new Date(event.start).toLocaleString("ko-KR", { month: "long" }) ===
      selectedMonth
  );

  const chartData = Object.values(
    filteredEvents.reduce((acc, event) => {
      const name = event.partnerName;
      if (!acc[name]) {
        acc[name] = {
          name,
          totalSchedules: 0,
          totalHours: 0,
          color: event.partnerColor,
        };
      }

      acc[name].totalSchedules += 1;
      const start = new Date(event.start);
      const end = new Date(event.end);
      const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      acc[name].totalHours += Number(hours.toFixed(1));

      return acc;
    }, {} as Record<string, StatsData>)
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center p-4">
          <div>
            <CardDescription className="text-lg">
              파트너별 일정 수와 총 시간
            </CardDescription>
          </div>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-24 p-2 border rounded-md"
          >
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <XAxis
                dataKey="name"
                tick={{ fill: "#666666" }}
                tickLine={{ stroke: "#666666" }}
              />
              <YAxis
                yAxisId="left"
                label={{
                  value: "일정 수",
                  angle: -90,
                  position: "insideLeft",
                  fill: "#4f46e5",
                }}
                tick={{ fill: "#666666" }}
                tickLine={{ stroke: "#666666" }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                label={{
                  value: "총 시간(시간)",
                  angle: 90,
                  position: "insideRight",
                  fill: "#84cc16",
                }}
                tick={{ fill: "#666666" }}
                tickLine={{ stroke: "#666666" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  padding: "10px",
                }}
              />
              <Bar
                yAxisId="left"
                dataKey="totalSchedules"
                fill="#4f46e5"
                name="일정 수"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                yAxisId="right"
                dataKey="totalHours"
                fill="#84cc16"
                name="총 시간(시간)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PartnerStatsChart;
