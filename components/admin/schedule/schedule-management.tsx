"use client"

import { useState, useMemo } from "react"
import { Alert, Button, Input, Modal, notification, Space, Table, Tag, Tooltip } from "antd"
import type { ColumnsType } from "antd/es/table"
import { Edit2 } from 'lucide-react'
import ScheduleResultsEditor from "./schedule-results-editor"

interface Tournament {
  id: number
  name: string
  startDate: string
  endDate: string
  location: string
  teams: number
  status?: string
  hasSchedule?: boolean
  updatedAt?: string
  matchSchedules?: MatchSchedule[]
  scheduleImg?: string[]
}

interface MatchSchedule {
  id: number
  round: string
  table?: string
  matchDate: string
  teamA: string
  teamB: string
  scoreA?: number | null
  scoreB?: number | null
}

const getStatus = (startDate: string, endDate: string) => {
  const now = new Date()
  const start = new Date(startDate)
  const end = new Date(endDate)

  if (now < start) return "Chưa bắt đầu"
  if (now > end) return "Đã kết thúc"
  return "Đang diễn ra"
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Đang diễn ra":
      return "green"
    case "Chưa bắt đầu":
      return "blue"
    case "Đã kết thúc":
      return "default"
    default:
      return "default"
  }
}

export default function ScheduleResultsManagement() {
  const [editingMode, setEditingMode] = useState(false)
  const [editingTournament, setEditingTournament] = useState<Tournament | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  // Sample data
  const [tournaments, setTournaments] = useState<Tournament[]>([
    {
      id: 6,
      name: "Giải Bóng chuyền Thanh Niên Đà Nẵng Lần 2 Năm 2023",
      startDate: "2023-11-11",
      endDate: "2023-11-18",
      location: "Trường THCS Trần Đại Nghĩa, Q. Ngũ Hành Sơn, TP. Đà Nẵng",
      teams: 12,
      hasSchedule: true,
      updatedAt: "2023-11-18",
      matchSchedules: [],
      scheduleImg: ["https://res.cloudinary.com/dikzmjuff/image/upload/v1762622647/w5_worjqz.jpg"]
    },
    {
      id: 7,
      name: "Giải bóng chuyền nam TP Đà Nẵng 2024",
      startDate: "2024-11-15",
      endDate: "2024-11-20",
      location: "Nhà thi đấu Quân Ngũ, Đà Nẵng",
      teams: 10,
      hasSchedule: false,
      updatedAt: "2024-11-15",
      matchSchedules: []
    },
  ])

  const filteredTournaments = useMemo(() => {
    const term = searchTerm.toLowerCase()
    return tournaments.filter((item) =>
      (item.name || "").toLowerCase().includes(term) ||
      (item.location || "").toLowerCase().includes(term)
    )
  }, [tournaments, searchTerm])

  const handleShowEditEditor = (record: Tournament) => {
    setEditingTournament(record)
    setEditingMode(true)
  }

  const handleCloseEditor = () => {
    setEditingMode(false)
    setEditingTournament(null)
  }

  const handleUpdateSchedule = (updatedTournament: Tournament) => {
    setTournaments((prev) =>
      prev.map((t) => (t.id === updatedTournament.id ? updatedTournament : t))
    )
    notification.success({ message: "Cập nhật lịch thi đấu thành công!" })
    handleCloseEditor()
  }

  const columns: ColumnsType<Tournament> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 60,
    },
    {
      title: "Tên giải đấu",
      dataIndex: "name",
      key: "name",
      render: (text: string) => <strong className="text-foreground">{text}</strong>,
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      key: "startDate",
      render: (date: string) => new Date(date).toLocaleDateString("vi-VN"),
      width: 130,
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "endDate",
      key: "endDate",
      render: (date: string) => new Date(date).toLocaleDateString("vi-VN"),
      width: 130,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (_, record) => {
        const status = getStatus(record.startDate, record.endDate)
        return <Tag color={getStatusColor(status)}>{status}</Tag>
      },
      width: 120,
    },
    {
      title: "Đã có lịch",
      dataIndex: "hasSchedule",
      key: "hasSchedule",
      render: (hasSchedule: boolean) => (
        <Tag color={hasSchedule ? "green" : "red"}>
          {hasSchedule ? "Có" : "Chưa"}
        </Tag>
      ),
      width: 100,
    },
    {
      title: "Cập nhật gần nhất",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (date: string) => date ? new Date(date).toLocaleDateString("vi-VN") : "-",
      width: 130,
    },
    {
      title: "Hành động",
      key: "action",
      align: "center",
      width: 80,
      render: (_: unknown, record) => (
        <Tooltip title="Cập nhật lịch thi đấu">
          <Button
            type="text"
            icon={<Edit2 size={18} className="text-yellow-600" />}
            onClick={() => handleShowEditEditor(record)}
          />
        </Tooltip>
      ),
    },
  ]

  if (editingMode && editingTournament) {
    return (
      <ScheduleResultsEditor
        tournament={editingTournament}
        onUpdate={handleUpdateSchedule}
        onCancel={handleCloseEditor}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-4">
        <Space.Compact style={{ width: 420 }}>
          <Input
            placeholder="Tìm kiếm tên giải đấu, địa điểm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            allowClear
          />
          <Button type="primary" onClick={() => setSearchTerm(searchTerm)}>
            Tìm
          </Button>
        </Space.Compact>
      </div>

      <div className="bg-white rounded-lg border border-border overflow-hidden">
        <Table
          columns={columns}
          dataSource={filteredTournaments}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </div>
    </div>
  )
}
