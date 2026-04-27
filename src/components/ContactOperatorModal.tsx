"use client";

import { Modal, Button, Space } from "antd";
import { useT } from "@/hooks/useT";

interface ContactOperatorModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ContactOperatorModal({ open, onClose }: ContactOperatorModalProps) {
  const t = useT();

  return (
    <Modal
      open={open}
      onCancel={onClose}
      width={417}
      centered
      footer={
        <div className="flex justify-end">
          <Button type="primary" onClick={onClose}>
            {t.drawer.gotIt}
          </Button>
        </div>
      }
    >
      <Space direction="vertical" size={24} style={{ width: "100%" }}>
        <Space align="start" size={12}>
          <img
            src="/警告icon.png"
            alt="warning"
            style={{ width: 22, height: 22, marginTop: 2 }}
          />
          <div>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
              {t.drawer.contactOpsTitle}
            </div>
            <div style={{ fontSize: 14, color: "#454c66" }}>
              {t.drawer.contactOpsDesc}
            </div>
          </div>
        </Space>

        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          backgroundColor: "#eef2fb",
          borderRadius: 4,
          overflow: "hidden"
        }}>
          <div style={{
            width: 110,
            height: 110,
            backgroundColor: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <img
              src="/qr-code-operator.png"
              alt="QR Code"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </div>
          <div style={{ fontSize: 12, padding: "8px 12px 8px 0" }}>
            {t.drawer.contactOpsQR}
          </div>
        </div>
      </Space>
    </Modal>
  );
}
