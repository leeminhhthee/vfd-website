"use client"

import { Pie } from '@ant-design/charts';
import { Card } from 'antd';

// Định nghĩa kiểu dữ liệu
interface TournamentData {
  status: string;
  count: number;
}

// Dữ liệu mẫu - Bạn sẽ thay thế bằng cách fetch API
const mockData: TournamentData[] = [
  { status: 'Sắp diễn ra', count: 3 },
  { status: 'Đang diễn ra', count: 2 },
  { status: 'Đã kết thúc', count: 7 },
];

export default function TournamentStatusChart() {
  const total = mockData.reduce((acc, curr) => acc + curr.count, 0);

  const config = {
    data: mockData,
    angleField: 'count',
    colorField: 'status',
    height: 300,
    radius: 1,
    innerRadius: 0.6,

    // Use G2 v5-style labels (no 'type' like 'spider'/'outer')
    label: {
      text: (d: TournamentData) => {
        const percent = total ? Math.round((d.count / total) * 100) : 0;
        return `${d.status}\n${percent}%`;
      },
      position: 'outside',     // 'inside' | 'outside'
      connector: true,         // draw leader lines (spider-like)
    },

    statistic: {
      title: { content: 'Tổng cộng', style: { fontSize: 16 } },
      content: { content: `${total}`, style: { fontSize: 24, fontWeight: 'bold' } },
    },

    interactions: [{ type: 'element-active' }],
    legend: { position: 'right' },
    tooltip: {
      fields: ['status', 'count'],
      formatter: (d: TournamentData) => ({
        name: d.status,
        value: `${d.count} (${Math.round((d.count / total) * 100)}%)`,
      }),
    },
  };

  return (
    <Card title="Tình trạng Giải đấu">
      <Pie {...config} />
    </Card>
  );
}