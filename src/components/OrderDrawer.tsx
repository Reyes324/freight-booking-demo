"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { CloseOutlined } from "@ant-design/icons";
import type { Order } from "@/data/mockData";

interface OrderDrawerProps {
  open: boolean;
  order: Order | null;
  onClose: () => void;
}

// 状态配置
const statusInfo = {
  calling_driver: {
    title: "呼叫司机中",
    description: "正在尽力呼叫附近司机，请稍后",
    showAnimation: true,
  },
  in_transit: {
    title: "运输中",
    description: "司机正在配送中，请耐心等待",
    showAnimation: false,
  },
  completed: {
    title: "订单已完成",
    description: "感谢使用，期待下次为您服务",
    showAnimation: false,
  },
  cancelled: {
    title: "订单已取消",
    description: "订单已被取消",
    showAnimation: false,
  },
};

// 优雅的环形 Loading 动画
function LoadingSpinner() {
  return (
    <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="none">
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
        className="opacity-25"
      />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        className="animate-spin origin-center"
        style={{ transformOrigin: "12px 12px" }}
      />
    </svg>
  );
}

export default function OrderDrawer({ open, order, onClose }: OrderDrawerProps) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  // 两阶段动画：先挂载，再触发动画
  useEffect(() => {
    if (open) {
      setMounted(true);
      // 使用 requestAnimationFrame 确保 DOM 已渲染
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setVisible(true);
        });
      });
    } else {
      setVisible(false);
      // 等动画结束后再卸载
      const timer = setTimeout(() => {
        setMounted(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // 防止背景滚动
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [visible]);

  if (!order || !mounted) return null;

  const statusConfig = statusInfo[order.status];

  return (
    <>
      {/* 透明点击区域 - 点击关闭面板 */}
      {visible && (
        <div
          className="fixed top-14 lg:top-16 left-0 right-0 bottom-0 z-20"
          onClick={onClose}
        />
      )}

      {/* 抽屉 - 无蒙层，在导航栏下方 */}
      <div
        className={`fixed top-14 lg:top-16 right-0 bottom-0 w-full lg:w-[48%] bg-gray-50 z-30
                   transform transition-transform duration-300 ease-out shadow-2xl ${
                     visible ? "translate-x-0" : "translate-x-full"
                   }`}
      >
        {/* 头部 - 关闭按钮 */}
        <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6">
          <h2 className="text-base font-semibold text-gray-900">订单详情</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg
                     text-gray-500 hover:text-gray-900 hover:bg-gray-100
                     transition-colors cursor-pointer"
          >
            <CloseOutlined className="text-base" />
          </button>
        </div>

        {/* 内容区域 */}
        <div className="h-[calc(100%-56px)] overflow-y-auto subtle-scroll">
          <div className="p-4 lg:p-6 space-y-6">
            {/* 订单状态卡片 - 白色背景，整体感强 */}
            <div className="border border-gray-200 rounded-xl p-4 bg-white">
              {/* 状态标题 + 动画 */}
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {statusConfig.title}
                </h3>
                {statusConfig.showAnimation && <LoadingSpinner />}
              </div>

              {/* 描述文字 */}
              <p className="text-sm text-gray-500 mb-1">{statusConfig.description}</p>

              {/* 订单号 */}
              <p className="text-xs text-gray-400 mb-3">订单号：{order.orderId}</p>

              {/* 操作按钮区 - 居左，加价突出 */}
              <div className="flex gap-2 pt-3 border-t border-gray-100">
                <button
                  className="h-9 px-4 rounded-lg bg-blue-600 text-white text-sm font-medium
                           hover:bg-blue-700 active:bg-blue-800 transition-colors cursor-pointer"
                >
                  加价
                </button>
                <button
                  className="h-9 px-4 rounded-lg border border-gray-200 bg-white
                           text-sm font-medium text-gray-700 hover:bg-gray-50
                           transition-colors cursor-pointer"
                >
                  订单追踪
                </button>
                <button
                  className="h-9 px-4 rounded-lg border border-gray-200 bg-white
                           text-sm font-medium text-gray-700 hover:bg-gray-50
                           transition-colors cursor-pointer"
                >
                  帮助
                </button>
              </div>
            </div>

            {/* 路线信息 */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">路线信息</h4>
              <div className="flex gap-2.5">
                {/* 左侧标记列 */}
                <div className="flex flex-col items-center" style={{ width: "12px" }}>
                  {/* 起点圆圈 */}
                  <div className="w-3 h-3 rounded-full bg-blue-600 flex-shrink-0 mt-[3px]" />
                  {/* 连接线 */}
                  <div className="w-px flex-1 min-h-[24px] border-l border-dashed border-gray-300 my-2" />
                  {/* 终点圆圈 */}
                  <div className="w-3 h-3 rounded-full border border-gray-400 bg-white flex-shrink-0 mb-[3px]" />
                </div>

                {/* 右侧地址列 */}
                <div className="flex-1 space-y-4 min-w-0">
                  {/* 起点 */}
                  <div>
                    <p className="text-sm text-gray-900 break-words leading-[1.4] mb-1">
                      {order.pickup.address}
                    </p>
                    {(order.pickup.contactName || order.pickup.phone || order.pickup.unit) && (
                      <div className="text-xs text-gray-400 space-y-0.5">
                        {order.pickup.contactName && order.pickup.phone && (
                          <p>
                            {order.pickup.contactName} · {order.pickup.phone}
                          </p>
                        )}
                        {order.pickup.unit && <p>{order.pickup.unit}</p>}
                      </div>
                    )}
                  </div>

                  {/* 终点 */}
                  <div>
                    <p className="text-sm text-gray-900 break-words leading-[1.4] mb-1">
                      {order.dropoff.address}
                    </p>
                    {(order.dropoff.contactName || order.dropoff.phone || order.dropoff.unit) && (
                      <div className="text-xs text-gray-400 space-y-0.5">
                        {order.dropoff.contactName && order.dropoff.phone && (
                          <p>
                            {order.dropoff.contactName} · {order.dropoff.phone}
                          </p>
                        )}
                        {order.dropoff.unit && <p>{order.dropoff.unit}</p>}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 车型信息 */}
            <div className="pt-6 border-t border-gray-100">
              <h4 className="text-sm font-medium text-gray-900 mb-3">车型信息</h4>
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 flex-shrink-0">
                  <Image
                    src={order.vehicle.image}
                    fill
                    alt={order.vehicle.name}
                    className="object-contain"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{order.vehicle.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {order.vehicle.weight || "标准载重"}
                  </p>
                </div>
              </div>
            </div>

            {/* 司机信息（如果有） */}
            {order.driver && (
              <div className="pt-6 border-t border-gray-100 space-y-3">
                <h4 className="text-sm font-medium text-gray-900">司机信息</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">姓名</span>
                    <span className="text-sm text-gray-900">{order.driver.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">电话</span>
                    <span className="text-sm text-gray-900">{order.driver.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">车牌号</span>
                    <span className="text-sm text-gray-900">{order.driver.vehiclePlate}</span>
                  </div>
                </div>
              </div>
            )}

            {/* 订单信息 */}
            <div className="pt-6 border-t border-gray-100 space-y-3">
              <h4 className="text-sm font-medium text-gray-900">订单信息</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">订单编号</span>
                  <span className="text-sm text-gray-900 font-mono">{order.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">用车时间</span>
                  <span className="text-sm text-gray-900">
                    {order.scheduledTime
                      ? order.scheduledTime.toLocaleString("zh-CN", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "立即用车"}
                  </span>
                </div>
                {order.driverNote && (
                  <div className="flex justify-between items-start">
                    <span className="text-sm text-gray-500">订单备注</span>
                    <span className="text-sm text-gray-900 text-right max-w-[200px]">
                      {order.driverNote}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">支付方式</span>
                  <span className="text-sm text-gray-900">账期支付</span>
                </div>
              </div>
            </div>

            {/* 费用明细 */}
            <div className="pt-6 border-t border-gray-100 space-y-3 pb-24">
              <h4 className="text-sm font-medium text-gray-900">费用明细</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">基础运费</span>
                  <span className="font-price text-sm text-gray-900">
                    HK$ {(order.basePrice || order.totalPrice).toFixed(2)}
                  </span>
                </div>
                <div className="pt-2 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900">总计</span>
                  <span className="font-price text-lg font-bold text-gray-900">
                    HK$ {order.totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 底部悬浮按钮 - 灰色边框 */}
        {(order.status === "calling_driver" || order.status === "in_transit") && (
          <div
            className="absolute bottom-0 left-0 right-0 p-4 lg:p-6 bg-white border-t border-gray-200
                       flex justify-end"
          >
            <button
              className="h-11 px-6 rounded-lg border border-gray-200 bg-white
                       text-gray-700 font-medium text-sm hover:bg-gray-50
                       transition-colors cursor-pointer"
            >
              取消订单
            </button>
          </div>
        )}
      </div>
    </>
  );
}
