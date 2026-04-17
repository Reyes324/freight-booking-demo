"use client";

import { useState, useMemo } from "react";
import { LeftOutlined } from "@ant-design/icons";
import type { Order } from "@/data/mockData";
import { vehicleServicesMap, isServiceGroup } from "@/data/mockData";

interface PriceIncreaseViewProps {
  order: Order;
  onBack: () => void;
  onConfirm: (amount: number) => void;
}

export default function PriceIncreaseView({ order, onBack, onConfirm }: PriceIncreaseViewProps) {
  const [inputValue, setInputValue] = useState("");
  const [isExiting, setIsExiting] = useState(false);

  const increaseAmount = parseFloat(inputValue) || 0;
  const basePrice = order.basePrice || order.totalPrice;
  const total = order.totalPrice + increaseAmount;
  const isValid = increaseAmount > 0;

  // 处理返回动画
  const handleBack = () => {
    setIsExiting(true);
    setTimeout(() => {
      onBack();
    }, 250); // 与动画时长一致
  };

  // 计算额外服务总价
  const additionalServicesTotal = useMemo(() => {
    let total = 0;
    const vehicleServices = vehicleServicesMap[order.vehicle.id] || [];

    // 累加单项服务价格
    order.selectedServices?.itemIds.forEach((itemId) => {
      const service = vehicleServices.find((s) => s.id === itemId);
      if (service && !isServiceGroup(service) && service.price > 0) {
        total += service.price;
      }
    });

    // 累加分组服务价格
    if (order.selectedServices?.groupSelections) {
      Object.entries(order.selectedServices.groupSelections).forEach(([groupId, selectedItemIds]) => {
        const group = vehicleServices.find((s) => s.id === groupId);
        if (group && isServiceGroup(group)) {
          selectedItemIds.forEach((itemId) => {
            const item = group.items.find((i) => i.id === itemId);
            if (item && item.price > 0) {
              total += item.price;
            }
          });
        }
      });
    }

    return total;
  }, [order]);

  return (
    <div className={`flex flex-col h-full bg-white ${isExiting ? 'slide-out-to-right' : 'slide-in-from-right'}`}>
      {/* 头部导航栏 */}
      <div
        className="sticky top-0 z-10 bg-white px-4 lg:px-6 border-b border-gray-200 flex items-center h-14"
        style={{ boxShadow: "0px 1px 3px 0px rgba(0,0,0,0.04)" }}
      >
        <button
          onClick={handleBack}
          className="-ml-2 w-8 h-8 flex items-center justify-center rounded-lg
                   text-gray-500 hover:text-gray-900 hover:bg-gray-100
                   transition-colors cursor-pointer"
        >
          <LeftOutlined className="text-sm" />
        </button>
        <h2 className="text-base font-semibold text-gray-900 ml-1">加价</h2>
      </div>

      {/* 内容 */}
      <div className="flex-1 overflow-y-auto subtle-scroll">
        <div className="p-4 lg:p-6 space-y-6">
          {/* 加价金额输入 */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">加价金额</h4>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 select-none">
                HK$
              </span>
              <input
                type="number"
                min="0"
                step="1"
                placeholder="输入加价金额"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full h-11 pl-12 pr-3 border border-gray-300 rounded-lg text-sm
                         focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none
                         transition-colors"
              />
            </div>
          </div>

          {/* 费用明细 */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">费用明细</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">运费</span>
                <span className="font-price text-sm text-gray-900">
                  HK$ {order.basePrice.toFixed(2)}
                </span>
              </div>
              {additionalServicesTotal > 0 && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">额外服务</span>
                  <span className="font-price text-sm text-gray-900">
                    HK$ {additionalServicesTotal.toFixed(2)}
                  </span>
                </div>
              )}
              {increaseAmount > 0 && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">加价</span>
                  <span className="font-price text-sm text-blue-600">
                    HK$ {increaseAmount.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="pt-2 border-t border-gray-100 flex justify-between items-center">
                <span className="text-sm font-medium text-gray-900">总计</span>
                <span className="font-price text-lg font-bold text-gray-900">
                  HK$ {total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 底部确认按钮 */}
      <div className="p-4 lg:p-6 bg-white border-t border-gray-200">
        <button
          disabled={!isValid}
          onClick={() => isValid && onConfirm(increaseAmount)}
          className={`w-full h-11 rounded-lg font-semibold text-sm transition-colors cursor-pointer
                    ${isValid
                      ? "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
        >
          确认加价
        </button>
      </div>
    </div>
  );
}
