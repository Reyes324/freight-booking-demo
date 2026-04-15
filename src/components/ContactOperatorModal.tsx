"use client";

import { Modal, Button, Space } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

interface ContactOperatorModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ContactOperatorModal({ open, onClose }: ContactOperatorModalProps) {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      width={417}
      centered
      footer={
        <div className="flex justify-end">
          <Button type="primary" onClick={onClose}>
            知道了
          </Button>
        </div>
      }
    >
      <Space direction="vertical" size={24} style={{ width: "100%" }}>
        {/* 警告提示内容 */}
        <Space align="start" size={12}>
          <img
            src="/警告icon.png"
            alt="警告"
            style={{ width: 22, height: 22, marginTop: 2 }}
          />
          <div>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
              请联系运营人员更改价格
            </div>
            <div style={{ fontSize: 14, color: "#454c66" }}>
              卸货完成前可商议调整价格
            </div>
          </div>
        </Space>

        {/* 二维码区域 */}
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
              alt="运营人员企业微信"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </div>
          <div style={{ fontSize: 12, padding: "8px 12px 8px 0" }}>
            扫描二维码，添加运营人员企业微信
          </div>
        </div>
      </Space>
    </Modal>
  );
}
