"use client";

import {
  Button,
  Card,
  Divider,
  Drawer,
  Form,
  Image,
  Input,
  InputNumber,
  Modal,
  notification,
  Select,
  Space,
  Table,
  Tag,
  Upload,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import type { RcFile } from "antd/es/upload";
import { ArrowLeft, Plus, Trash2, UploadIcon } from "lucide-react";
import { useState } from "react";

interface Tournament {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  location: string;
  teams: number;
  status?: string;
  hasSchedule?: boolean;
  updatedAt?: string;
  matchSchedules?: MatchSchedule[];
  scheduleImg?: string[];
}

interface MatchSchedule {
  id: number;
  round: string;
  table?: string;
  matchDate: string;
  teamA: string;
  teamB: string;
  scoreA?: number | null;
  scoreB?: number | null;
}

interface ScheduleResultsEditorProps {
  tournament: Tournament;
  onUpdate: (tournament: Tournament) => void;
  onCancel: () => void;
}

const ROUND_OPTIONS = [
  { label: "Bảng xếp hạng", value: "group" },
  { label: "Tứ kết", value: "quarter-final" },
  { label: "Bán kết", value: "semi-final" },
  { label: "Tranh hạng 3", value: "third-place" },
  { label: "Chung kết", value: "final" },
];

export default function ScheduleResultsEditor({
  tournament,
  onUpdate,
  onCancel,
}: ScheduleResultsEditorProps) {
  const [scheduleImages, setScheduleImages] = useState<string[]>(
    tournament.scheduleImg || []
  );
  const [matches, setMatches] = useState<MatchSchedule[]>(
    tournament.matchSchedules || []
  );
  const [editingMatch, setEditingMatch] = useState<MatchSchedule | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [form] = Form.useForm();

  const getStatus = (startDate: string, endDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (now < start) return "Chưa bắt đầu";
    if (now > end) return "Đã kết thúc";
    return "Đang diễn ra";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Đang diễn ra":
        return "green";
      case "Chưa bắt đầu":
        return "blue";
      case "Đã kết thúc":
        return "default";
      default:
        return "default";
    }
  };

  const handleImageUpload = async (file: RcFile) => {
    // Simulate file upload - in real app, send to server
    const reader = new FileReader();
    reader.onload = () => {
      const imageUrl = reader.result as string;
      setScheduleImages([...scheduleImages, imageUrl]);
      notification.success({ message: "Upload ảnh thành công!" });
    };
    reader.readAsDataURL(file);
    return false;
  };

  const handleRemoveImage = (index: number) => {
    setScheduleImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddMatch = () => {
    setEditingMatch({
      id: Math.max(...matches.map((m) => m.id), 0) + 1,
      round: "group",
      matchDate: new Date().toISOString(),
      teamA: "",
      teamB: "",
      scoreA: undefined,
      scoreB: undefined,
    });
    form.resetFields();
    setDrawerVisible(true);
  };

  const handleEditMatch = (match: MatchSchedule) => {
    setEditingMatch(match);
    form.setFieldsValue({
      round: match.round,
      table: match.table,
      matchDate: match.matchDate,
      teamA: match.teamA,
      teamB: match.teamB,
      scoreA: match.scoreA,
      scoreB: match.scoreB,
    });
    setDrawerVisible(true);
  };

  const handleSaveMatch = (values: MatchSchedule) => {
    if (editingMatch) {
      if (editingMatch.id && matches.some((m) => m.id === editingMatch.id)) {
        setMatches(
          matches.map((m) =>
            m.id === editingMatch.id ? { ...editingMatch, ...values } : m
          )
        );
      } else {
        setMatches([...matches, { ...editingMatch, ...values }]);
      }
      notification.success({
        message: editingMatch.id
          ? "Cập nhật trận đấu thành công!"
          : "Thêm trận đấu thành công!",
      });
      setDrawerVisible(false);
      setEditingMatch(null);
    }
  };

  const handleDeleteMatch = (id: number) => {
    Modal.confirm({
      title: "Xóa trận đấu?",
      content: "Hành động này không thể hoàn tác.",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => {
        setMatches(matches.filter((m) => m.id !== id));
        notification.success({ message: "Đã xóa trận đấu!" });
      },
    });
  };

  const handleSaveChanges = () => {
    const updatedTournament: Tournament = {
      ...tournament,
      matchSchedules: matches,
      scheduleImg: scheduleImages,
      hasSchedule: matches.length > 0,
      updatedAt: new Date().toISOString().split("T")[0],
    };
    onUpdate(updatedTournament);
  };

  const matchColumns: ColumnsType<MatchSchedule> = [
    {
      title: "Vòng",
      dataIndex: "round",
      key: "round",
      render: (round: string) => {
        const roundLabel =
          ROUND_OPTIONS.find((r) => r.value === round)?.label || round;
        return <Tag>{roundLabel}</Tag>;
      },
      width: 120,
    },
    {
      title: "Bảng",
      dataIndex: "table",
      key: "table",
      render: (table: string) => table || "-",
      width: 80,
    },
    {
      title: "Ngày/Giờ thi đấu",
      dataIndex: "matchDate",
      key: "matchDate",
      render: (date: string) => new Date(date).toLocaleString("vi-VN"),
      width: 150,
    },
    {
      title: "Đội A",
      dataIndex: "teamA",
      key: "teamA",
    },
    {
      title: "Đội B",
      dataIndex: "teamB",
      key: "teamB",
    },
    {
      title: "Kết quả",
      key: "result",
      render: (_, record) => {
        if (record.scoreA === null || record.scoreB === null) {
          return <span className="text-muted-foreground">Chưa diễn ra</span>;
        }
        return (
          <strong>
            {record.scoreA} - {record.scoreB}
          </strong>
        );
      },
      width: 100,
    },
    {
      title: "Hành động",
      key: "action",
      align: "center",
      width: 100,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            size="small"
            onClick={() => handleEditMatch(record)}
            className="text-yellow-600"
          >
            Sửa
          </Button>
          <Button
            type="text"
            size="small"
            danger
            onClick={() => handleDeleteMatch(record.id)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  const status = getStatus(tournament.startDate, tournament.endDate);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            icon={<ArrowLeft size={20} />}
            onClick={onCancel}
            type="text"
          />
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {tournament.name}
            </h2>
            <p className="text-sm text-muted-foreground">
              {tournament.location}
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Left Sidebar: Images */}
        <div style={{ width: 320, minWidth: 220 }}>
          <Card>
            <div className="space-y-4">
              <h3 className="font-bold text-foreground">Ảnh Lịch Thi Đấu</h3>
              <div className="space-y-2">
                {scheduleImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`Schedule ${index}`}
                      className="w-full h-full object-cover rounded border border-border"
                      preview={{
                        mask: "Phóng to",
                      }}
                    />
                    <Button
                      type="text"
                      danger
                      size="small"
                      icon={<Trash2 size={14} />}
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                ))}
              </div>
              <Upload
                accept="image/*"
                maxCount={5}
                showUploadList={false}
                customRequest={({ file }) => handleImageUpload(file as RcFile)}
              >
                <Button icon={<UploadIcon size={16} />} className="w-full">
                  Upload Ảnh
                </Button>
              </Upload>
            </div>
          </Card>
        </div>

        {/* Right Content: Tournament Info & Matches */}
        <div className="flex-1 space-y-6">
          {/* Tournament Info Card */}
          <Card>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase">ID</p>
                <p className="font-bold text-foreground">#{tournament.id}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase">
                  Ngày bắt đầu
                </p>
                <p className="text-foreground">
                  {new Date(tournament.startDate).toLocaleDateString("vi-VN")}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase">
                  Ngày kết thúc
                </p>
                <p className="text-foreground">
                  {new Date(tournament.endDate).toLocaleDateString("vi-VN")}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase">
                  Trạng thái
                </p>
                <Tag color={getStatusColor(status)}>{status}</Tag>
              </div>
            </div>
          </Card>

          <Divider />

          {/* Matches Table */}
          <Card>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-foreground">
                  Lịch Thi Đấu & Kết Quả
                </h3>
                <Button
                  type="primary"
                  icon={<Plus size={16} />}
                  onClick={handleAddMatch}
                >
                  Thêm trận
                </Button>
              </div>

              <Table
                columns={matchColumns}
                dataSource={matches}
                rowKey="id"
                pagination={{ pageSize: 10 }}
                size="small"
              />
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <Button onClick={onCancel}>Quay lại</Button>
            <Button type="primary" onClick={handleSaveChanges}>
              Lưu thay đổi
            </Button>
          </div>
        </div>
      </div>

      {/* Match Edit Drawer */}
      <Drawer
        title={
          editingMatch?.id && matches.some((m) => m.id === editingMatch.id)
            ? "Chỉnh sửa trận đấu"
            : "Thêm trận đấu mới"
        }
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={500}
      >
        <Form form={form} layout="vertical" onFinish={handleSaveMatch}>
          <Form.Item
            label="Vòng thi"
            name="round"
            rules={[{ required: true, message: "Vui lòng chọn vòng thi" }]}
          >
            <Select options={ROUND_OPTIONS} />
          </Form.Item>

          <Form.Item label="Bảng" name="table">
            <Input placeholder="A, B, C..." />
          </Form.Item>

          <Form.Item
            label="Ngày/Giờ thi đấu"
            name="matchDate"
            rules={[{ required: true, message: "Vui lòng nhập ngày giờ" }]}
          >
            <Input type="datetime-local" />
          </Form.Item>

          <Form.Item
            label="Đội A"
            name="teamA"
            rules={[{ required: true, message: "Vui lòng nhập tên đội A" }]}
          >
            <Input placeholder="Tên đội A" />
          </Form.Item>

          <Form.Item
            label="Đội B"
            name="teamB"
            rules={[{ required: true, message: "Vui lòng nhập tên đội B" }]}
          >
            <Input placeholder="Tên đội B" />
          </Form.Item>

          <Divider />

          <Form.Item label="Kết Quả">
            <Space style={{ width: "100%" }}>
              <Form.Item name="scoreA" noStyle>
                <InputNumber placeholder="Điểm A" min={0} />
              </Form.Item>
              <span>-</span>
              <Form.Item name="scoreB" noStyle>
                <InputNumber placeholder="Điểm B" min={0} />
              </Form.Item>
            </Space>
          </Form.Item>

          <Form.Item style={{ marginTop: 24 }}>
            <Space style={{ width: "100%", justifyContent: "flex-end" }}>
              <Button onClick={() => setDrawerVisible(false)}>Hủy</Button>
              <Button type="primary" htmlType="submit">
                Lưu
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
}
