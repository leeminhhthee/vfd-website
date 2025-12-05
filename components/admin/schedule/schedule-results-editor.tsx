"use client";

import { getRoundLabel, Round, RoundLabels } from "@/data/constants/constants";
import { tournamentInteractor } from "@/data/datasource/tournament/interactor/tournament.interactor";
import { MatchSchedule, TournamentItem } from "@/data/model/tournament.model";
import { confirmUnsavedChanges, uploadFile } from "@/lib/utils";
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
import dayjs from "dayjs";
import { ArrowLeft, Plus, Sparkles, Trash2, UploadIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface ScheduleResultsEditorProps {
  tournament: TournamentItem;
  onUpdate: (data: Partial<TournamentItem>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

interface MatchFormValues {
  round: string;
  table?: string;
  matchDate: string;
  teamA: string;
  teamB: string;
  scoreA?: number | null;
  scoreB?: number | null;
}

interface ImageItem {
  uid: string;
  url?: string;
  file?: File;
  preview?: string;
}

const ROUND_OPTIONS = Object.values(Round).map((round) => ({
  label: RoundLabels[round],
  value: round,
}));

export default function ScheduleResultsEditor({
  tournament,
  onUpdate,
  onCancel,
  isLoading,
}: ScheduleResultsEditorProps) {
  const [highlightedIds, setHighlightedIds] = useState<number[]>([]);

  const flashHighlights = (ids: number[]) => {
    setHighlightedIds(ids);
    // Sau 3 giây thì xóa danh sách highlight để trở về màu bình thường
    setTimeout(() => {
      setHighlightedIds([]);
    }, 8000);
  };

  useEffect(() => {
    if (highlightedIds.length > 0) {
      // Lấy ID của trận mới nhất (hoặc trận đầu tiên trong danh sách vừa thêm)
      const targetId = highlightedIds[0];

      // Tìm element trong DOM bằng ID đã gán ở Table
      const element = document.getElementById(`match-row-${targetId}`);

      if (element) {
        // Cuộn mượt đến vị trí đó và căn giữa màn hình
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [highlightedIds]);

  const [imageList, setImageList] = useState<ImageItem[]>(
    (tournament.scheduleImg || []).map((url, index) => ({
      uid: `old-${index}`,
      url: url,
      preview: url,
    }))
  );

  const [matches, setMatches] = useState<MatchSchedule[]>(
    tournament.matchSchedules || []
  );

  const sortedMatches = useMemo(() => {
    // 1. Định nghĩa thứ tự ưu tiên (Priority) cho từng vòng
    // Số càng nhỏ thì càng hiển thị lên đầu
    const roundPriority: Record<string, number> = {
      [Round.GROUP_STAGE]: 1, // Vòng bảng
      [Round.ROUND_OF_16]: 2, // Vòng 1/8
      [Round.QUARTER_FINAL]: 3, // Tứ kết
      [Round.SEMI_FINAL]: 4, // Bán kết
      [Round.THRID_PLACE]: 5, // Tranh hạng 3 (Lưu ý: Check kỹ lại typo THRID hay THIRD trong file constants của bạn)
      [Round.FINAL]: 6, // Chung kết
    };

    // Tạo bản sao mảng ([...matches]) để tránh mutate state gốc khi sort
    return [...matches].sort((a, b) => {
      const priorityA = roundPriority[a.round] ?? 99; // Mặc định 99 cho các vòng lạ
      const priorityB = roundPriority[b.round] ?? 99;

      // --- BƯỚC 1: SO SÁNH THEO VÒNG ĐẤU ---
      if (priorityA !== priorityB) {
        return priorityA - priorityB;
        // Nếu khác vòng, vòng nào có priority nhỏ hơn (Vòng bảng=1) sẽ đứng trước
      }

      // --- BƯỚC 2: SO SÁNH THEO THỜI GIAN ---
      // Code chỉ chạy xuống đây khi priorityA === priorityB (tức là CÙNG VÒNG)
      const dateA = new Date(a.matchDate).getTime();
      const dateB = new Date(b.matchDate).getTime();

      return dateA - dateB;
      // Xếp tăng dần: Cũ nhất (nhỏ hơn) -> Mới nhất (lớn hơn)
    });
  }, [matches]);

  const [editingMatch, setEditingMatch] = useState<MatchSchedule | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [form] = Form.useForm();

  // --- HÀM LẤY MÀU SẮC CHO TỪNG VÒNG ---
  const getRoundColor = (round: string) => {
    switch (round) {
      case Round.GROUP_STAGE:
        return "blue";
      case Round.ROUND_OF_16:
        return "cyan";
      case Round.QUARTER_FINAL:
        return "purple";
      case Round.SEMI_FINAL:
        return "orange";
      case Round.THRID_PLACE:
        return "magenta";
      case Round.FINAL:
        return "red";
      default:
        return "default";
    }
  };

  // --- XỬ LÝ CONFIRM EXIT ---
  const handleCancelEditor = () => {
    confirmUnsavedChanges(onCancel);
  };

  const handleCloseDrawer = () => {
    confirmUnsavedChanges(() => {
      setDrawerVisible(false);
    });
  };

  const processPendingImages = async (
    currentList: ImageItem[]
  ): Promise<string[]> => {
    const finalUrls: string[] = [];
    const uploadPromises: Promise<void>[] = [];
    const newList = [...currentList];

    newList.forEach((item, index) => {
      if (item.url) {
        finalUrls.push(item.url);
      } else if (item.file) {
        const promise = uploadFile(item.file).then((res) => {
          newList[index].url = res.link;
          delete newList[index].file;
          finalUrls.push(res.link);
        });
        uploadPromises.push(promise);
      }
    });

    if (uploadPromises.length > 0) {
      setIsUploading(true);
      try {
        await Promise.all(uploadPromises);
        setImageList(newList);
        return finalUrls;
      } catch (error) {
        notification.error({ message: "Lỗi upload ảnh" });
        throw error;
      } finally {
        setIsUploading(false);
      }
    }

    return finalUrls;
  };

  const handleBeforeUpload = (file: RcFile) => {
    const newItem: ImageItem = {
      uid: file.uid,
      file: file,
      preview: URL.createObjectURL(file),
    };
    setImageList((prev) => [...prev, newItem]);
    return false;
  };

  const handleRemoveImage = (uid: string) => {
    setImageList((prev) => prev.filter((item) => item.uid !== uid));
  };

  const handleAutoFillSchedule = async () => {
    if (imageList.length === 0) {
      return notification.warning({ message: "Chưa có ảnh lịch thi đấu" });
    }

    try {
      setIsGenerating(true);
      const allUrls = await processPendingImages(imageList);

      const generatedMatches =
        await tournamentInteractor.generateScheduleFromImages(allUrls);

      if (generatedMatches && generatedMatches.length > 0) {
        setMatches((prev) => [...prev, ...generatedMatches]);
        const newIds = generatedMatches.map((m) => m.id);
        flashHighlights(newIds);
        notification.success({
          message: "Tạo lịch thành công",
          description: `Đã tìm thấy ${generatedMatches.length} trận đấu mới.`,
        });
      } else {
        notification.info({
          message: "Không tìm thấy thông tin trận đấu trong ảnh",
        });
      }
    } catch (error) {
      console.error(error);
      notification.error({ message: "Có lỗi xảy ra khi tạo lịch" });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveChanges = async () => {
    try {
      const finalImageUrls = await processPendingImages(imageList);
      onUpdate({
        matchSchedules: matches,
        scheduleImg: finalImageUrls,
      });
    } catch (error) {}
  };

  const handleAddMatch = () => {
    const newMatch = new MatchSchedule();
    newMatch.id = Date.now();
    newMatch.round = Round.GROUP_STAGE;
    newMatch.matchDate = new Date();
    newMatch.teamA = "";
    newMatch.teamB = "";
    newMatch.scoreA = null;
    newMatch.scoreB = null;

    setEditingMatch(newMatch);
    form.resetFields();
    form.setFieldsValue({
      round: Round.GROUP_STAGE,
      matchDate: dayjs().format("YYYY-MM-DDTHH:mm"),
    });
    setDrawerVisible(true);
  };

  const handleEditMatch = (match: MatchSchedule) => {
    setEditingMatch(match);
    form.setFieldsValue({
      round: match.round,
      table: match.table,
      matchDate: match.matchDate
        ? dayjs(match.matchDate).format("YYYY-MM-DDTHH:mm")
        : "",
      teamA: match.teamA,
      teamB: match.teamB,
      scoreA: match.scoreA,
      scoreB: match.scoreB,
    });
    setDrawerVisible(true);
  };

  const handleSaveMatch = (values: MatchFormValues) => {
    if (editingMatch) {
      const updatedMatch: MatchSchedule = {
        ...editingMatch,
        ...values,
        matchDate: new Date(values.matchDate),
        scoreA:
          values.scoreA !== undefined && values.scoreA !== null
            ? values.scoreA
            : null,
        scoreB:
          values.scoreB !== undefined && values.scoreB !== null
            ? values.scoreB
            : null,
      };

      if (matches.some((m) => m.id === editingMatch.id)) {
        setMatches(
          matches.map((m) => (m.id === editingMatch.id ? updatedMatch : m))
        );
      } else {
        setMatches([...matches, updatedMatch]);
        flashHighlights([updatedMatch.id]);
      }
      setDrawerVisible(false);
      setEditingMatch(null);
    }
  };

  const handleDeleteMatch = (id: number) => {
    Modal.confirm({
      title: "Xóa trận đấu?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => setMatches(matches.filter((m) => m.id !== id)),
    });
  };

  const matchColumns: ColumnsType<MatchSchedule> = [
    {
      title: "Vòng",
      dataIndex: "round",
      key: "round",
      width: 120,
      render: (round: string) => (
        <Tag color={getRoundColor(round)}>{getRoundLabel(round) || round}</Tag>
      ),
    },
    {
      title: "Bảng",
      dataIndex: "table",
      key: "table",
      render: (t) => t || "-",
      width: 80,
    },
    {
      title: "Ngày/Giờ",
      dataIndex: "matchDate",
      key: "matchDate",
      width: 150,
      render: (d: Date) => (d ? dayjs(d).format("HH:mm DD/MM/YYYY") : ""),
    },
    { title: "Đội A", dataIndex: "teamA", key: "teamA" },
    {
      title: "Kết quả",
      key: "result",
      align: "center",
      width: 100,
      render: (_, r) =>
        r.scoreA === null || r.scoreB === null ? (
          <span className="text-xs text-gray-400">Chưa đấu</span>
        ) : (
          <strong>
            {r.scoreA} - {r.scoreB}
          </strong>
        ),
    },
    { title: "Đội B", dataIndex: "teamB", key: "teamB" },
    {
      title: "Hành động",
      key: "action",
      align: "center",
      width: 100,
      render: (_, r) => (
        <Space size="small">
          <Button
            type="text"
            size="small"
            className="text-blue-600"
            onClick={() => handleEditMatch(r)}
          >
            Sửa
          </Button>
          <Button
            type="text"
            size="small"
            danger
            onClick={() => handleDeleteMatch(r.id)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            icon={<ArrowLeft size={20} />}
            onClick={handleCancelEditor}
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

      <div className="flex gap-6 flex-col lg:flex-row">
        <div className="w-full lg:w-[320px]">
          <Card>
            <div className="space-y-4">
              <h3 className="font-bold text-foreground">Ảnh Lịch Thi Đấu</h3>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-700 mb-2">
                  Hệ thống sẽ tự động upload ảnh mới và phân tích lịch thi đấu.
                </p>
                <Button
                  type="primary"
                  block
                  icon={<Sparkles size={16} />}
                  onClick={handleAutoFillSchedule}
                  loading={isGenerating || isUploading}
                  className="bg-blue-600 hover:bg-blue-500"
                  disabled={imageList.length === 0}
                >
                  {isUploading
                    ? "Đang upload..."
                    : isGenerating
                    ? "Đang tạo lịch..."
                    : "Tự động điền Lịch"}
                </Button>
              </div>

              <div className="space-y-2">
                {imageList.map((item) => (
                  <div key={item.uid} className="relative group">
                    <Image
                      src={item.preview || "/placeholder.svg"}
                      alt="Schedule"
                      className="w-full h-40 object-cover rounded border border-border"
                      preview={{ mask: "Phóng to" }}
                    />
                    {!item.url && (
                      <div className="absolute top-1 left-1 bg-yellow-500 text-white text-[10px] px-1 rounded">
                        Chưa lưu
                      </div>
                    )}
                    <Button
                      type="text"
                      danger
                      size="small"
                      icon={<Trash2 size={14} />}
                      onClick={() => handleRemoveImage(item.uid)}
                      className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white"
                    />
                  </div>
                ))}
              </div>

              <Upload
                accept="image/*"
                multiple
                showUploadList={false}
                beforeUpload={handleBeforeUpload}
              >
                <Button icon={<UploadIcon size={16} />} className="w-full">
                  Thêm Ảnh
                </Button>
              </Upload>
            </div>
          </Card>
        </div>

        <div className="flex-1 space-y-6">
          <Card>
            <div className="space-y-4">
              <div className="flex justify-between items-center flex-wrap gap-2">
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
                dataSource={sortedMatches} // Sử dụng danh sách đã sắp xếp
                rowKey="id"
                pagination={false}
                size="small"
                scroll={{ x: 600 }}
                rowClassName={(record) =>
                  highlightedIds.includes(record.id)
                    ? "bg-green-100 transition-colors duration-1000"
                    : "transition-colors duration-1000"
                }
                onRow={(record) => ({
                  id: `match-row-${record.id}`,
                })}
              />
            </div>
          </Card>

          <div className="flex justify-end gap-2 mt-4">
            <Button
              onClick={handleCancelEditor}
              disabled={isLoading || isUploading || isGenerating}
            >
              Quay lại
            </Button>
            <Button
              type="primary"
              onClick={handleSaveChanges}
              loading={isLoading || isUploading}
            >
              {isUploading ? "Đang upload ảnh..." : "Lưu thay đổi"}
            </Button>
          </div>
        </div>
      </div>

      <Drawer
        title={
          editingMatch?.id && matches.some((m) => m.id === editingMatch.id)
            ? "Chỉnh sửa trận đấu"
            : "Thêm trận đấu mới"
        }
        placement="right"
        onClose={handleCloseDrawer}
        open={drawerVisible}
        width={500}
        closeIcon={<ArrowLeft size={20} />}
        maskClosable={true}
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
                <InputNumber placeholder="A" min={0} />
              </Form.Item>
              <span className="font-bold">-</span>
              <Form.Item name="scoreB" noStyle>
                <InputNumber placeholder="B" min={0} />
              </Form.Item>
            </Space>
          </Form.Item>

          <Form.Item style={{ marginTop: 24 }}>
            <Space style={{ width: "100%", justifyContent: "flex-end" }}>
              <Button onClick={handleCloseDrawer}>Hủy</Button>
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
