"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { OrderStorage } from "@/lib/orderStorage";
import type { OrderDraft } from "@/data/mockData";

type PricingOption = {
  id: "priority" | "standard" | "discount";
  title: string;
  subtitle: string;
  price: number;
  badge?: boolean;
};

const pricingOptions: PricingOption[] = [
  {
    id: "priority",
    title: "优先订单",
    subtitle: "加快配对司机送货",
    price: 350.0,
    badge: true,
  },
  {
    id: "standard",
    title: "标准订单",
    subtitle: "加快配对司机送货",
    price: 220.0,
  },
];

interface PricingFooterProps {
  orderDraft?: OrderDraft;
  onNext?: () => void;
}

export default function PricingFooter({ orderDraft, onNext }: PricingFooterProps) {
  const [selectedOption, setSelectedOption] = useState<"priority" | "standard" | "discount">("standard");
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);

  const handleNext = () => {
    if (!orderDraft || !onNext) return;
    onNext();
  };

  return (
    <div
      className="bg-white flex flex-col gap-3 items-start justify-center p-4 pb-safe z-50"
      style={{
        boxShadow:
          "0px -3px 6px 0px rgba(0,0,0,0.06), 0px -6px 16px 0px rgba(0,0,0,0.04), 0px -9px 28px 0px rgba(0,0,0,0.02)",
        paddingBottom: `calc(1rem + env(safe-area-inset-bottom))`,
      }}
    >
      {/* 价格选项 */}
      <div className="flex gap-2 w-full">
        {pricingOptions.map((option) => {
          const isSelected = selectedOption === option.id;
          const isHovered = hoveredOption === option.id;
          return (
            <button
              key={option.id}
              onClick={() => setSelectedOption(option.id)}
              onMouseEnter={() => setHoveredOption(option.id)}
              onMouseLeave={() => setHoveredOption(null)}
              className={`flex-1 flex flex-col gap-6 items-start justify-center p-4 rounded-md border relative transition-all duration-200 cursor-pointer ${
                isSelected
                  ? "bg-blue-50 border-blue-600"
                  : "bg-white border-gray-200"
              } ${isHovered && !isSelected ? "border-gray-400" : ""} ${
                isSelected ? "scale-[1.02]" : "scale-100"
              }`}
            >
              {/* 徽章（仅优先订单） */}
              {option.badge && (
                <div className="absolute right-0 top-0 w-11 h-11 transition-transform duration-200 hover:scale-110">
                  <Image
                    src="/priority-badge.svg"
                    alt="优先"
                    width={44}
                    height={44}
                    unoptimized
                  />
                </div>
              )}

              {/* 标题区域 */}
              <div className="flex flex-col items-start text-sm leading-[22px]">
                <p className="text-gray-900 font-medium transition-colors">
                  {option.title}
                </p>
                <p className="text-xs text-gray-400">{option.subtitle}</p>
              </div>

              {/* 价格区域 */}
              <div className="flex gap-2 items-end">
                <p className="font-price text-gray-900 text-2xl leading-[22px] font-bold tracking-tight transition-transform">
                  ฿{option.price.toFixed(0)}
                </p>
                {/* Info icon（仅选中时显示） */}
                {isSelected && (
                  <div className="w-3.5 h-3.5 mb-0.5 animate-in fade-in zoom-in duration-200">
                    <Image
                      src="/info-icon.svg"
                      alt="详情"
                      width={14}
                      height={14}
                      className="hover:scale-125 transition-transform cursor-pointer"
                      unoptimized
                    />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* 下一步按钮 */}
      <button
        onClick={handleNext}
        disabled={!orderDraft}
        className="w-full h-[54px] bg-blue-600 hover:bg-blue-700 active:bg-blue-800
                 rounded-lg flex items-center justify-center transition-all duration-200
                 hover:shadow-lg active:scale-[0.98] group cursor-pointer
                 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="text-white text-base font-medium group-hover:scale-105 transition-transform">
          下一步
        </span>
      </button>
    </div>
  );
}
