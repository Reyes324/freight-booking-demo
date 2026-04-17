"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { CloseOutlined, PhoneOutlined, StarFilled, MessageOutlined, EnvironmentOutlined, QuestionCircleOutlined, InfoCircleOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { Modal, message } from "antd";
import type { Order, PriceAdjustment } from "@/data/mockData";
import { vehicleServicesMap, isServiceGroup } from "@/data/mockData";
import PickupProofModal from "./PickupProofModal";
import PriceIncreaseView from "./PriceIncreaseView";
import AdjustPriceView from "./AdjustPriceView";
import ContactOperatorModal from "./ContactOperatorModal";
import ChangeDriverModal from "./ChangeDriverModal";

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
  const [drawerView, setDrawerView] = useState<"detail" | "priceIncrease" | "adjustPrice">("detail");
  const [priceAdjustment, setPriceAdjustment] = useState<PriceAdjustment | null>(null);
  const [showAdjustTooltip, setShowAdjustTooltip] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [changeDriverModalOpen, setChangeDriverModalOpen] = useState(false);

  // 处理取消订单
  const handleCancelOrder = () => {
    Modal.confirm({
      title: "确认取消订单？",
      icon: <ExclamationCircleOutlined />,
      content: "取消后订单将无法恢复，是否确认取消？",
      okText: "确认取消",
      cancelText: "返回",
      okButtonProps: { danger: true },
      onOk() {
        // Demo 场景：不改变订单状态，只显示 toast
        message.success("订单已取消");
      },
    });
  };

  // 计算额外服务总价
  const additionalServicesTotal = useMemo(() => {
    if (!order) return 0;

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
        setDrawerView("detail");
        setShowAdjustTooltip(false);
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

  // 判断是否已提交费用调整（来自 order 数据或本地状态）
  const hasPriceAdjustment = order.priceAdjustment || priceAdjustment;

  // 按状态决定按钮
  const statusButtons: string[] = (() => {
    switch (order.status) {
      case "calling_driver": return ["加价"];
      case "in_transit": return ["更换司机", "追踪订单", "调整费用"];
      case "delivering": return ["追踪订单", "调整费用"];
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
        {/* 订单详情 - 一级页面（始终渲染） */}
        <>
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
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-semibold text-gray-900">
                    {statusConfig.title}
                  </h3>
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${statusConfig.dotColor} ${statusConfig.showPulse ? "animate-pulse" : ""}`} />
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
                          <span className="bg-gray-100 rounded px-2 py-0.5 text-xs font-medium text-gray-900">
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
                            <span className="text-xs font-medium text-gray-900">{order.driver.rating}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 底部操作按钮区 — 按状态显示不同按钮 */}
              {statusButtons.length > 0 && (
                <div className="flex flex-col gap-2 px-4 pb-4 pt-3 border-t border-gray-100">
                  <div className="flex gap-2">
                    {statusButtons.map((btn, i) => {
                      const isAdjustBtn = btn === "调整费用";
                      const isAdjustDisabled = isAdjustBtn && !!hasPriceAdjustment;

                      return (
                        <div key={btn} className="relative">
                          <button
                            onClick={() => {
                              if (btn === "加价") {
                                setDrawerView("priceIncrease");
                              } else if (btn === "更换司机") {
                                setChangeDriverModalOpen(true);
                              } else if (isAdjustBtn) {
                                if (isAdjustDisabled) {
                                  setShowAdjustTooltip(true);
                                  setTimeout(() => setShowAdjustTooltip(false), 2000);
                                } else {
                                  setContactModalOpen(true);
                                }
                              }
                            }}
                            className={`h-9 px-4 rounded-lg text-sm font-medium transition-colors ${
                              isAdjustDisabled
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                                : i === 0
                                  ? "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 cursor-pointer"
                                  : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 cursor-pointer"
                            }`}
                          >
                            {btn}
                          </button>
                          {/* 审核中提示气泡 */}
                          {isAdjustBtn && showAdjustTooltip && isAdjustDisabled && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-10
                                          bg-gray-800 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap
                                          shadow-lg animate-fade-in">
                              费用调整审核中
                              <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0
                                            border-l-4 border-r-4 border-t-4
                                            border-l-transparent border-r-transparent border-t-gray-800" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* 路线信息 */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">路线信息</h4>
              {/* 构建路线点数组：起点 + 途径点 + 终点 */}
              {(() => {
                const routePoints = [
                  order.pickup,
                  ...(order.waypoints || []),
                  order.dropoff
                ];

                return (
                  <div>
                    {routePoints.map((point, index) => (
                      <div key={index}>
                        {/* 每个路线点：圆圈 + 地址信息 */}
                        <div className="flex gap-2.5">
                          {/* 左侧：时间轴列（圆圈 + 虚线） */}
                          <div className="flex flex-col items-center flex-shrink-0" style={{ width: "18px" }}>
                            {/* 圆圈 - 固定在顶部 */}
                            <div className="flex-shrink-0" style={{ marginTop: "2px" }}>
                              {index === 0 ? (
                                // 起点：填充蓝色 + 白色数字
                                <div className="w-[18px] h-[18px] rounded-full bg-blue-600 flex items-center justify-center">
                                  <span className="text-[10px] font-medium leading-none text-white">
                                    {index + 1}
                                  </span>
                                </div>
                              ) : (
                                // 途径点和终点：白色背景 + 蓝色边框 + 蓝色数字
                                <div className="w-[18px] h-[18px] rounded-full border-[1.5px] border-blue-600 bg-white flex items-center justify-center">
                                  <span className="text-[10px] font-medium leading-none text-blue-600">
                                    {index + 1}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* 向下延伸的虚线（最后一个点不显示） */}
                            {index < routePoints.length - 1 && (
                              <div className="w-px flex-1 border-l border-dashed border-gray-300 mt-2" />
                            )}
                          </div>

                          {/* 右侧：地址信息 */}
                          <div className="flex-1 min-w-0 pb-3">
                            <p className="text-sm text-gray-900 break-words leading-[1.4] mb-1">
                              {point.address}
                            </p>
                            {(point.contactName || point.phone || point.unit) && (
                              <div className="text-xs text-gray-400 space-y-0.5">
                                {point.contactName && point.phone && (
                                  <p>
                                    {point.contactName} · {point.phone}
                                  </p>
                                )}
                                {point.unit && <p>{point.unit}</p>}
                              </div>
                            )}

                            {/* 装货证明（仅起点且有证明照片时显示） */}
                            {index === 0 && order.pickupProofPhoto && (order.status === "completed" || order.status === "delivering") && (
                              <div className="mt-2 bg-gray-50 rounded-lg p-3 flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-medium text-green-600">已装货</p>
                                  {order.actualPickupTime && (
                                    <p className="text-xs text-gray-400 mt-0.5">
                                      {formatPickupTime(order.actualPickupTime)}
                                    </p>
                                  )}
                                </div>
                                <img
                                  src={order.pickupProofPhoto}
                                  alt="装货证明"
                                  className="w-14 h-14 rounded-lg object-cover cursor-pointer hover:opacity-80 transition-opacity"
                                  onClick={() => setProofModalOpen(true)}
                                />
                              </div>
                            )}

                            {/* 卸货证明（仅终点且有证明照片时显示） */}
                            {index === routePoints.length - 1 && order.dropoffProofPhoto && order.status === "completed" && (
                              <div className="mt-2 bg-gray-50 rounded-lg p-3 flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-medium text-green-600">已卸货</p>
                                  {order.actualDropoffTime && (
                                    <p className="text-xs text-gray-400 mt-0.5">
                                      {new Date(order.actualDropoffTime).toLocaleString("zh-CN", {
                                        month: "numeric",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit"
                                      })}
                                    </p>
                                  )}
                                </div>
                                <img
                                  src={order.dropoffProofPhoto}
                                  alt="卸货证明"
                                  className="w-14 h-14 rounded-lg object-cover cursor-pointer hover:opacity-80 transition-opacity"
                                  onClick={() => setProofModalOpen(true)}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
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
                  <span className="text-sm text-gray-400">订单编号</span>
                  <span className="text-sm text-gray-900">{order.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">用车时间</span>
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
                    <span className="text-sm text-gray-400">订单备注</span>
                    <span className="text-sm text-gray-900 text-right max-w-[200px]">
                      {order.driverNote}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">支付方式</span>
                  <span className="text-sm text-gray-900">账期支付</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">下单日期</span>
                  <span className="text-sm text-gray-900">
                    {order.createdAt.toLocaleString("zh-CN", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* 费用明细 */}
            <div className="pt-6 border-t border-gray-100 space-y-3 pb-24">
              <h4 className="text-sm font-medium text-gray-900">费用明细</h4>

              {/* 费用调整审核中提示栏 */}
              {hasPriceAdjustment && (
                <div className="flex items-start gap-2 bg-orange-50 border border-orange-100 rounded-lg p-3">
                  <InfoCircleOutlined className="text-orange-500 text-sm mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-orange-700 leading-relaxed">
                    费用调整至 <span className="font-semibold">฿{(hasPriceAdjustment.adjustedPrice).toFixed(0)}</span>，正在审核中
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">运费</span>
                  <span className="font-price text-sm text-gray-900">
                    ฿{order.basePrice.toFixed(0)}
                  </span>
                </div>
                {additionalServicesTotal > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">额外服务</span>
                    <span className="font-price text-sm text-gray-900">
                      ฿{additionalServicesTotal.toFixed(0)}
                    </span>
                  </div>
                )}
                <div className="pt-2 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900">总计</span>
                  <span className="font-price text-lg font-bold text-gray-900">
                    ฿{order.totalPrice.toFixed(0)}
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
              onClick={handleCancelOrder}
              className="h-11 px-6 rounded-lg border border-gray-200 bg-white
                       text-gray-700 font-medium text-sm hover:bg-gray-50
                       transition-colors cursor-pointer"
            >
              取消订单
            </button>
          </div>
        )}
        </>

        {/* 二级页面覆盖层 */}
        {drawerView === "priceIncrease" && (
          <div className="absolute inset-0 z-20 overflow-hidden">
            <PriceIncreaseView
              order={order}
              onBack={() => setDrawerView("detail")}
              onConfirm={(amount) => {
                console.log("加价金额:", amount);
                setDrawerView("detail");
              }}
            />
          </div>
        )}

        {drawerView === "adjustPrice" && (
          <div className="absolute inset-0 z-20 overflow-hidden">
            <AdjustPriceView
              order={order}
              onBack={() => setDrawerView("detail")}
              onSubmit={(adjustedPrice) => {
                setPriceAdjustment({
                  adjustedPrice,
                  status: "pending",
                  submittedAt: new Date(),
                });
              }}
            />
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

      {/* 联系运营人员弹窗 */}
      <ContactOperatorModal
        open={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
      />

      {/* 更换司机弹窗 */}
      <ChangeDriverModal
        open={changeDriverModalOpen}
        onClose={() => setChangeDriverModalOpen(false)}
        onConfirm={(reason) => {
          console.log("更换司机原因:", reason);
          setChangeDriverModalOpen(false);
          // TODO: 调用更换司机 API
        }}
      />
    </>
  );
}
