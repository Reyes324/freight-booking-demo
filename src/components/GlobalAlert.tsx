"use client";

import { ExclamationCircleOutlined, CloseOutlined } from "@ant-design/icons";

interface GlobalAlertProps {
  message: string;
  type?: "error" | "warning" | "success" | "info";
  visible: boolean;
  onClose: () => void;
}

const alertStyles = {
  error: {
    bg: "bg-red-50",
    border: "border-red-500",
    text: "text-red-700",
    icon: "text-red-500",
    hoverBg: "hover:bg-red-100",
  },
  warning: {
    bg: "bg-yellow-50",
    border: "border-yellow-500",
    text: "text-yellow-700",
    icon: "text-yellow-500",
    hoverBg: "hover:bg-yellow-100",
  },
  success: {
    bg: "bg-green-50",
    border: "border-green-500",
    text: "text-green-700",
    icon: "text-green-500",
    hoverBg: "hover:bg-green-100",
  },
  info: {
    bg: "bg-blue-50",
    border: "border-blue-500",
    text: "text-blue-700",
    icon: "text-blue-500",
    hoverBg: "hover:bg-blue-100",
  },
};

export default function GlobalAlert({
  message,
  type = "error",
  visible,
  onClose,
}: GlobalAlertProps) {
  if (!visible) return null;

  const styles = alertStyles[type];

  return (
    <div
      className={`fixed top-14 lg:top-16 left-0 right-0 z-40
                  ${styles.bg} border-l-4 ${styles.border}
                  px-4 lg:px-6 py-3
                  shadow-md
                  animate-in slide-in-from-top duration-300 ease-out`}
    >
      <div className="flex items-start gap-3 max-w-6xl mx-auto">
        {/* 图标 */}
        <ExclamationCircleOutlined
          className={`${styles.icon} text-base mt-0.5 flex-shrink-0`}
        />

        {/* 消息文本 */}
        <p className={`text-sm ${styles.text} flex-1 leading-relaxed`}>
          {message}
        </p>

        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className={`w-6 h-6 flex items-center justify-center rounded
                     text-red-400 hover:text-red-600 ${styles.hoverBg}
                     transition-colors cursor-pointer flex-shrink-0`}
          aria-label="关闭提示"
        >
          <CloseOutlined className="text-xs" />
        </button>
      </div>
    </div>
  );
}
