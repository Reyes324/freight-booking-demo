"use client";

import { useState } from "react";
import { Modal, Button, Space } from "antd";
import { CheckCircleFilled, CheckCircleOutlined } from "@ant-design/icons";

interface ChangeDriverModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

// 模拟从接口返回的原因列表
const REASONS = [
  { id: "late", label: "接口返回：司机迟到" },
  { id: "driver_request", label: "接口返回：司机主动要求换人" },
  { id: "no_response", label: "接口返回：司机无响应" },
  { id: "bad_attitude", label: "接口返回：司机态度恶劣" },
];

export default function ChangeDriverModal({ open, onClose, onConfirm }: ChangeDriverModalProps) {
  const [selectedReason, setSelectedReason] = useState<string>("");

  const handleConfirm = () => {
    if (!selectedReason) return;
    onConfirm(selectedReason);
    // 重置选择
    setSelectedReason("");
  };

  const handleClose = () => {
    setSelectedReason("");
    onClose();
  };

  return (
    <Modal
      title="更换司机"
      open={open}
      onCancel={handleClose}
      width={480}
      centered
      footer={
        <Space>
          <Button onClick={handleClose}>取消</Button>
          <Button type="primary" disabled={!selectedReason} onClick={handleConfirm}>
            确认并更换司机
          </Button>
        </Space>
      }
    >
      <Space direction="vertical" size={16} style={{ width: "100%" }}>
        <div style={{ fontSize: 20, fontWeight: 600 }}>
          请选择更换司机原因
        </div>

        <div style={{
          border: "1px solid #f0f0f0",
          borderRadius: 4,
          overflow: "hidden",
          backgroundColor: "white"
        }}>
          {REASONS.map((reason, index) => (
            <div
              key={reason.id}
              onClick={() => setSelectedReason(reason.id)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "15px 16px",
                cursor: "pointer",
                borderBottom: index < REASONS.length - 1 ? "1px solid #f0f0f0" : "none",
                backgroundColor: selectedReason === reason.id ? "#f0f5ff" : "white",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => {
                if (selectedReason !== reason.id) {
                  e.currentTarget.style.backgroundColor = "#fafafa";
                }
              }}
              onMouseLeave={(e) => {
                if (selectedReason !== reason.id) {
                  e.currentTarget.style.backgroundColor = "white";
                }
              }}
            >
              <span style={{ fontSize: 14, color: "#0f1229" }}>
                {reason.label}
              </span>

              {/* 自定义单选框 */}
              <div style={{
                width: 16,
                height: 16,
                borderRadius: "50%",
                border: selectedReason === reason.id ? "5px solid #2257d4" : "2px solid #d9d9d9",
                transition: "all 0.2s",
              }} />
            </div>
          ))}
        </div>
      </Space>
    </Modal>
  );
}
