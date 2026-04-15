"use client";

import { useMemo } from "react";
import { Popover } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { vehicleServicesMap, isServiceGroup, currencyConfig } from "@/data/mockData";
import type { OrderDraft } from "@/data/mockData";

interface ConfirmationFooterProps {
  totalPrice: number;
  orderDraft?: OrderDraft;
  onConfirm: () => void;
  isSubmitting: boolean;
}

export default function ConfirmationFooter({
  totalPrice,
  orderDraft,
  onConfirm,
  isSubmitting,
}: ConfirmationFooterProps) {
  // 动态计算费用明细
  const priceBreakdownItems = useMemo(() => {
    if (!orderDraft) return [];

    const items: { label: string; price: number }[] = [];
    let additionalServicesTotal = 0;

    // 1. 运费（基础价格）
    items.push({
      label: "运费",
      price: orderDraft.basePrice,
    });

    // 2. 计算额外服务总价
    if (orderDraft.selectedServices) {
      const vehicleServices = vehicleServicesMap[orderDraft.vehicle.id] || [];

      // 累加单项服务价格
      orderDraft.selectedServices.itemIds.forEach((itemId) => {
        const service = vehicleServices.find((s) => s.id === itemId);
        if (service && !isServiceGroup(service) && service.price > 0) {
          additionalServicesTotal += service.price;
        }
      });

      // 累加分组服务价格
      Object.entries(orderDraft.selectedServices.groupSelections).forEach(([groupId, selectedItemIds]) => {
        const group = vehicleServices.find((s) => s.id === groupId);
        if (group && isServiceGroup(group)) {
          selectedItemIds.forEach((itemId) => {
            const item = group.items.find((i) => i.id === itemId);
            if (item && item.price > 0) {
              additionalServicesTotal += item.price;
            }
          });
        }
      });

      // 如果有额外服务，添加总和项
      if (additionalServicesTotal > 0) {
        items.push({
          label: "额外服务",
          price: additionalServicesTotal,
        });
      }
    }

    return items;
  }, [orderDraft]);

  // 费用明细内容
  const priceBreakdown = (
    <div className="py-1 space-y-2 min-w-[200px]">
      {priceBreakdownItems.map((item, index) => (
        <div key={index} className="flex justify-between items-center text-sm">
          <span className="text-gray-600">{item.label}</span>
          <span className="font-medium text-gray-900">
            {currencyConfig.symbol}{item.price.toFixed(0)}
          </span>
        </div>
      ))}
      {priceBreakdownItems.length === 0 && (
        <div className="text-sm text-gray-400 text-center py-2">暂无费用明细</div>
      )}
    </div>
  );

  return (
    <div
      className="absolute bottom-0 left-0 right-0 z-50 bg-white p-4"
      style={{
        boxShadow:
          "0px -3px 6px 0px rgba(0,0,0,0.06), 0px -6px 16px 0px rgba(0,0,0,0.04), 0px -9px 28px 0px rgba(0,0,0,0.02)",
      }}
    >
      <div className="flex items-center gap-4">
        {/* 总价显示 */}
        <div className="flex-1">
          <p className="text-xs text-gray-500 mb-0.5">总价</p>
          <div className="flex items-center gap-2">
            <p className="font-price text-2xl font-bold text-gray-900">
              ฿{totalPrice.toFixed(0)}
            </p>
            <Popover
              content={priceBreakdown}
              title="费用明细"
              trigger="click"
              placement="top"
            >
              <InfoCircleOutlined className="text-gray-400 text-base cursor-pointer hover:text-gray-600 transition-colors" />
            </Popover>
          </div>
        </div>

        {/* 确认叫车按钮 */}
        <button
          onClick={onConfirm}
          disabled={isSubmitting}
          className="h-[54px] px-8 rounded-lg bg-blue-600 hover:bg-blue-700
                   active:bg-blue-800 text-white text-base font-semibold
                   flex items-center gap-2 transition-all duration-200
                   disabled:opacity-50 disabled:cursor-not-allowed
                   hover:shadow-lg active:scale-[0.98] cursor-pointer"
        >
          <span>{isSubmitting ? '提交中...' : '确认叫车'}</span>
          {!isSubmitting && (
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
