"use client";

import { ExclamationCircleFilled, CloseOutlined } from "@ant-design/icons";

interface GlobalAlertProps {
  message: string;
  type?: "error" | "warning" | "success" | "info";
  visible: boolean;
  onClose: () => void;
}

export default function GlobalAlert({
  message,
  type = "error",
  visible,
  onClose,
}: GlobalAlertProps) {
  if (!visible) return null;

  return (
    <div
      className="relative w-full px-4 py-3 rounded-lg
                 flex items-center gap-3
                 animate-in slide-in-from-top duration-300 ease-out"
      style={{
        backgroundColor: '#F23041',
        boxShadow: '0 2px 8px rgba(242, 48, 65, 0.15)'
      }}
    >
      {/* 图标 */}
      <ExclamationCircleFilled
        className="text-base flex-shrink-0"
        style={{ color: '#FFFFFF' }}
      />

      {/* 消息文本 */}
      <p className="text-sm text-white flex-1 leading-normal font-medium">
        {message}
      </p>

      {/* 关闭按钮 */}
      <button
        onClick={onClose}
        className="w-5 h-5 flex items-center justify-center rounded
                   text-white hover:bg-white/20
                   transition-all cursor-pointer flex-shrink-0"
        aria-label="关闭提示"
      >
        <CloseOutlined className="text-xs" />
      </button>
    </div>
  );
}
