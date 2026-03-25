"use client";

import { useEffect } from "react";
import { CloseOutlined } from "@ant-design/icons";

interface PickupProofModalProps {
  open: boolean;
  imageUrl: string;
  onClose: () => void;
}

export default function PickupProofModal({ open, imageUrl, onClose }: PickupProofModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full
                   bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
      >
        <CloseOutlined className="text-lg" />
      </button>
      <img
        src={imageUrl}
        alt="装货证明"
        className="max-w-lg w-[90%] max-h-[80vh] object-contain rounded-xl"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}
