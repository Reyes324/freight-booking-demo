"use client";

import { useState } from "react";
import { LeftOutlined, InfoCircleOutlined, CheckCircleFilled } from "@ant-design/icons";
import type { Order } from "@/data/mockData";

interface AdjustPriceViewProps {
  order: Order;
  onBack: () => void;
  onSubmit: (adjustedPrice: number) => void;
}

export default function AdjustPriceView({ order, onBack, onSubmit }: AdjustPriceViewProps) {
  const [inputValue, setInputValue] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const adjustedPrice = parseFloat(inputValue) || 0;
  const isValid = adjustedPrice > 0 && adjustedPrice !== order.totalPrice;

  const handleSubmit = () => {
    if (!isValid) return;
    setSubmitted(true);
    onSubmit(adjustedPrice);
  };

  // 处理返回动画
  const handleBack = () => {
    setIsExiting(true);
    setTimeout(() => {
      onBack();
    }, 250); // 与动画时长一致
  };

  // 提交成功后的审核中页面
  if (submitted) {
    return (
      <div className={`flex flex-col h-full bg-white ${isExiting ? 'slide-out-to-right' : 'slide-in-from-right'}`}>
        {/* 头部 */}
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
          <h2 className="text-base font-semibold text-gray-900 ml-1">调整费用</h2>
        </div>

        {/* 成功提示 */}
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
            <CheckCircleFilled className="text-3xl text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">费用调整审核中</h3>
          <p className="text-sm text-gray-500 text-center leading-relaxed">
            您提交的费用调整申请正在审核中，<br />审核结果将通过消息通知您。
          </p>
          <div className="mt-6 bg-gray-50 rounded-xl p-4 w-full max-w-[300px]">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-500">原订单总价</span>
              <span className="font-price text-sm text-gray-900">
                ฿ {order.totalPrice.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-200">
              <span className="text-sm font-medium text-gray-900">调整至</span>
              <span className="font-price text-sm font-bold text-blue-600">
                ฿ {adjustedPrice.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* 底部返回按钮 */}
        <div className="p-4 lg:p-6 bg-white border-t border-gray-200">
          <button
            onClick={handleBack}
            className="w-full h-11 rounded-lg font-semibold text-sm transition-colors cursor-pointer
                     bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800"
          >
            返回订单详情
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full bg-white ${isExiting ? 'slide-out-to-right' : 'slide-in-from-right'}`}>
      {/* 头部 */}
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
        <h2 className="text-base font-semibold text-gray-900 ml-1">调整费用</h2>
      </div>

      {/* 内容 */}
      <div className="flex-1 overflow-y-auto subtle-scroll">
        <div className="p-4 lg:p-6 space-y-6">
          {/* 提示信息 */}
          <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-lg p-3">
            <InfoCircleOutlined className="text-blue-600 text-sm mt-0.5 flex-shrink-0" />
            <p className="text-sm text-blue-700 leading-relaxed">
              每笔订单仅支持调整一次费用，提交后需等待审核。
            </p>
          </div>

          {/* 当前订单总价 */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">当前订单总价</h4>
            <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
              <span className="text-sm text-gray-500">订单总价</span>
              <span className="font-price text-lg font-bold text-gray-900">
                ฿ {order.totalPrice.toFixed(2)}
              </span>
            </div>
          </div>

          {/* 调整后金额输入 */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">调整后金额</h4>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 select-none">
                ฿
              </span>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="输入调整后的总费用"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full h-11 pl-12 pr-3 border border-gray-300 rounded-lg text-sm
                         focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none
                         transition-colors"
              />
            </div>
            {adjustedPrice > 0 && adjustedPrice !== order.totalPrice && (
              <p className="text-xs text-gray-400 mt-2">
                {adjustedPrice > order.totalPrice
                  ? `将增加 ฿ ${(adjustedPrice - order.totalPrice).toFixed(2)}`
                  : `将减少 ฿ ${(order.totalPrice - adjustedPrice).toFixed(2)}`
                }
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 底部确认按钮 */}
      <div className="p-4 lg:p-6 bg-white border-t border-gray-200">
        <button
          disabled={!isValid}
          onClick={handleSubmit}
          className={`w-full h-11 rounded-lg font-semibold text-sm transition-colors cursor-pointer
                    ${isValid
                      ? "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
        >
          提交调整申请
        </button>
      </div>
    </div>
  );
}
