"use client";

import { Line } from "@ant-design/charts";
import { Card } from "antd";

interface MemberData {
  month: string;
  count: number;
}

// Dữ liệu mẫu - Bạn sẽ thay thế bằng cách fetch API
const mockData: MemberData[] = [
  { month: "Tháng 6", count: 35 },
  { month: "Tháng 7", count: 42 },
  { month: "Tháng 8", count: 68 },
  { month: "Tháng 9", count: 50 },
  { month: "Tháng 10", count: 77 },
  { month: "Tháng 11", count: 91 },
];

export default function MemberGrowthChart() {
  // Cấu hình cho biểu đồ đường
  const config = {
    data: mockData,
    xField: "month",
    yField: "count",
    height: 300,
    smooth: true, // Làm mượt đường
    point: {
      size: 5,
      shape: "diamond",
    },
    tooltip: {
      title: "Thành viên mới",
      formatter: (datum: any) => ({
        name: datum.month,
        value: `${datum.count} người`,
      }),
    },
  };

  return (
    <Card title="Thành viên mới (6 tháng qua)">
      <div className="w-full overflow-hidden">
        <Line {...config} />
      </div>
    </Card>
  );
}
