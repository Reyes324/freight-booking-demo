"use client";

import { useState } from "react";
import { Modal, Button, Space } from "antd";
import { useT } from "@/hooks/useT";

interface ChangeDriverModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

export default function ChangeDriverModal({ open, onClose, onConfirm }: ChangeDriverModalProps) {
  const t = useT();
  const [selectedReason, setSelectedReason] = useState<string>("");

  const reasons = [
    { id: "late", label: t.drawer.changeDriverReasonLate },
    { id: "driver_request", label: t.drawer.changeDriverReasonRequest },
    { id: "no_response", label: t.drawer.changeDriverReasonNoResponse },
    { id: "bad_attitude", label: t.drawer.changeDriverReasonBadAttitude },
  ];

  const handleConfirm = () => {
    if (!selectedReason) return;
    onConfirm(selectedReason);
    setSelectedReason("");
  };

  const handleClose = () => {
    setSelectedReason("");
    onClose();
  };

  return (
    <Modal
      title={t.drawer.changeDriverTitle}
      open={open}
      onCancel={handleClose}
      width={480}
      centered
      footer={
        <Space>
          <Button onClick={handleClose}>{t.common.cancel}</Button>
          <Button type="primary" disabled={!selectedReason} onClick={handleConfirm}>
            {t.drawer.changeDriverConfirm}
          </Button>
        </Space>
      }
    >
      <Space direction="vertical" size={16} style={{ width: "100%" }}>
        <div style={{ fontSize: 20, fontWeight: 600 }}>
          {t.drawer.changeDriverSelectReason}
        </div>

        <div style={{
          border: "1px solid #f0f0f0",
          borderRadius: 4,
          overflow: "hidden",
          backgroundColor: "white"
        }}>
          {reasons.map((reason, index) => (
            <div
              key={reason.id}
              onClick={() => setSelectedReason(reason.id)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "15px 16px",
                cursor: "pointer",
                borderBottom: index < reasons.length - 1 ? "1px solid #f0f0f0" : "none",
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
