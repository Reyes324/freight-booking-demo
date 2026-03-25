"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { CloseOutlined, PhoneOutlined, StarFilled, MessageOutlined, EnvironmentOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import type { Order } from "@/data/mockData";
import PickupProofModal from "./PickupProofModal";

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
    dotColor: "bg-blue-500",
    showPulse: true,
  },
  in_transit: {
    title: "前往装货地",
    description: "司机正在前往装货地点",
    dotColor: "bg-blue-500",
    showPulse: false,
  },
  delivering: {
    title: "配送中",
    description: "司机正在配送中，请耐心等待",
    dotColor: "bg-blue-500",
    showPulse: false,
  },
  completed: {
    title: "订单已完成",
    description: "感谢使用，期待下次为您服务",
    dotColor: "bg-green-500",
    showPulse: false,
  },
  cancelled: {
    title: "订单已取消",
    description: "订单已被取消",
    dotColor: "bg-gray-400",
    showPulse: false,
  },
};

// 格式化时间为 "今天, HH:MM" 或 "昨天, HH:MM" 或完整日期
function formatPickupTime(date: Date): string {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const time = date.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", hour12: false });

  if (target.getTime() === today.getTime()) return `今天, ${time}`;
  if (target.getTime() === yesterday.getTime()) return `昨天, ${time}`;
  return date.toLocaleDateString("zh-CN", { month: "2-digit", day: "2-digit" }) + `, ${time}`;
}

export default function OrderDrawer({ open, order, onClose }: OrderDrawerProps) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [proofModalOpen, setProofModalOpen] = useState(false);

  // 两阶段动画：先挂载，再触发动画
  useEffect(() => {
    if (open) {
      setMounted(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setVisible(true);
        });
      });
    } else {
      setVisible(false);
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
  const hasDriver = order.driver && (order.status === "in_transit" || order.status === "delivering" || order.status === "completed");

  // 按状态决定按钮
  const statusButtons: string[] = (() => {
    switch (order.status) {
      case "calling_driver": return ["加价"];
      case "in_transit": return ["更换司机", "追踪订单", "调整费用"];
      case "delivering": return ["追踪订单"];
      case "completed": return ["追踪订单"];
      default: return [];
    }
  })();

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
            {/* 统一状态卡片：状态 header → 司机信息 → 操作按钮 */}
            <div className="border border-gray-200 rounded-xl bg-white overflow-hidden">
              {/* 状态 header */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold text-gray-900">
                      {statusConfig.title}
                    </h3>
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${statusConfig.dotColor} ${statusConfig.showPulse ? "animate-pulse" : ""}`} />
                  </div>
                  <span className="text-xs text-gray-400 flex-shrink-0">{order.orderId}</span>
                </div>
                <p className="text-sm text-gray-500">{statusConfig.description}</p>
              </div>

              {/* 司机信息区（有司机时显示） */}
              {hasDriver && order.driver && (
                <div className="px-4 pb-4 pt-0">
                  <div className="border-t border-gray-100 pt-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-base font-semibold text-gray-900 mb-2">
                          {order.driver.name}
                        </h4>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-gray-100 rounded px-2 py-0.5 text-xs font-medium text-gray-700">
                            {order.driver.vehiclePlate}
                          </span>
                          <span className="text-sm text-gray-500">{order.vehicle.name}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-gray-500">
                          <PhoneOutlined className="text-orange-500 text-xs" />
                          <span>{order.driver.phone}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-center ml-4 flex-shrink-0">
                        {order.driver.avatar ? (
                          <img
                            src={order.driver.avatar}
                            alt={order.driver.name}
                            className="w-14 h-14 rounded-full bg-gray-100 object-cover"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-lg font-medium">
                            {order.driver.name.charAt(0)}
                          </div>
                        )}
                        {order.driver.rating && (
                          <div className="flex items-center gap-0.5 mt-1.5">
                            <StarFilled className="text-orange-500 text-xs" />
                            <span className="text-xs font-medium text-gray-700">{order.driver.rating}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 底部操作按钮区 — 按状态显示不同按钮 */}
              {statusButtons.length > 0 && (
                <div className="flex gap-2 px-4 pb-4 pt-3 border-t border-gray-100">
                  {statusButtons.map((btn, i) => (
                    <button
                      key={btn}
                      className={`h-9 px-4 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                        i === 0
                          ? "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800"
                          : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {btn}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 路线信息 */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">路线信息</h4>
              <div className="flex gap-2.5">
                {/* 左侧标记列 */}
                <div className="flex flex-col items-center" style={{ width: "12px" }}>
                  <div className="w-3 h-3 rounded-full bg-blue-600 flex-shrink-0 mt-[3px]" />
                  <div className="w-px flex-1 min-h-[24px] border-l border-dashed border-gray-300 my-2" />
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

                    {/* 装货证明（已完成订单） */}
                    {order.status === "completed" && order.pickupProofPhoto && (
                      <div className="mt-2 space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-green-600">已装货</span>
                          {order.actualPickupTime && (
                            <span className="text-xs text-gray-400">
                              {formatPickupTime(order.actualPickupTime)}
                            </span>
                          )}
                        </div>
                        <img
                          src={order.pickupProofPhoto}
                          alt="装货证明"
                          className="w-20 h-14 rounded-lg object-cover cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => setProofModalOpen(true)}
                        />
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
        {(order.status === "calling_driver" || order.status === "in_transit" || order.status === "delivering") && (
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

      {/* 装货证明图片弹窗 */}
      {order.pickupProofPhoto && (
        <PickupProofModal
          open={proofModalOpen}
          imageUrl={order.pickupProofPhoto}
          onClose={() => setProofModalOpen(false)}
        />
      )}
    </>
  );
}
