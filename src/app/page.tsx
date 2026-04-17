"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import RouteSection from "@/components/RouteSection";
import VehicleSelector from "@/components/VehicleSelector";
import AdditionalServices from "@/components/AdditionalServices";
import MapView from "@/components/MapView";
import PricingFooter from "@/components/PricingFooter";
import PricingFooterSkeleton from "@/components/PricingFooterSkeleton";
import OrderSummary from "@/components/OrderSummary";
import DateTimePicker from "@/components/DateTimePicker";
import DriverNoteInput from "@/components/DriverNoteInput";
import PaymentMethodSelector from "@/components/PaymentMethodSelector";
import OrderContactPhone from "@/components/OrderContactPhone";
import ConfirmationFooter from "@/components/ConfirmationFooter";
import { OrderStorage } from "@/lib/orderStorage";
import { vehicles as vehicleList, vehicleServicesMap, isServiceGroup } from "@/data/mockData";
import type { Vehicle, AddressDetail, OrderDraft, OrderConfirmation } from "@/data/mockData";
import GlobalAlert from "@/components/GlobalAlert";

type ViewMode = "configure" | "confirm";

export default function OrderPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<ViewMode>("configure");
  const [pickupAddress, setPickupAddress] = useState<AddressDetail | null>(null);
  const [dropoffAddress, setDropoffAddress] = useState<AddressDetail | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(vehicleList[0]);
  const [isPricingLoading, setIsPricingLoading] = useState(false);
  const [selectedServices, setSelectedServices] = useState<{
    itemIds: string[];
    groupSelections: Record<string, string[]>;
  }>({ itemIds: [], groupSelections: {} });

  // 确认页状态
  const [contactPhone, setContactPhone] = useState<string>("+66 812345678");
  const [scheduledTime, setScheduledTime] = useState<string>("");
  const [driverNote, setDriverNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactPhoneError, setContactPhoneError] = useState<string>("");

  // 全局提示状态
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [showAlert, setShowAlert] = useState(false);

  // 防止浏览器 scrollIntoView 静默滚动父容器（checkbox 获取焦点时会触发）
  const leftColRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = leftColRef.current;
    if (!el) return;
    const handler = () => { el.scrollTop = 0; };
    el.addEventListener('scroll', handler);
    return () => el.removeEventListener('scroll', handler);
  }, []);

  // 保存/恢复配置面板滚动位置（返回时恢复）
  const configScrollRef = useRef<HTMLDivElement>(null);
  const savedScrollTop = useRef(0);

  // 页面加载时清除旧的草稿数据
  useEffect(() => {
    OrderStorage.clear();
  }, []);

  // 价格显示条件：2个地址（且address字段不为空）+ 1个车型
  const showPricing =
    pickupAddress !== null &&
    pickupAddress.address &&
    dropoffAddress !== null &&
    dropoffAddress.address &&
    selectedVehicle !== null;

  // 构建订单草稿
  const orderDraft: OrderDraft | null = useMemo(() => {
    if (!showPricing || !pickupAddress || !dropoffAddress || !selectedVehicle) {
      return null;
    }

    // TODO: 实际价格计算逻辑（包含附加服务）
    const basePrice = 74.0; // 临时硬编码
    const totalPrice = 74.0; // 临时硬编码

    return {
      pickup: pickupAddress,
      dropoff: dropoffAddress,
      vehicle: selectedVehicle,
      pricingOption: 'standard',
      selectedServices,
      basePrice,
      totalPrice,
    };
  }, [pickupAddress, dropoffAddress, selectedVehicle, selectedServices, showPricing]);


  // 当价格模块应该显示时，先显示loading，然后加载真实内容
  useEffect(() => {
    if (showPricing) {
      setIsPricingLoading(true);
      const timer = setTimeout(() => {
        setIsPricingLoading(false);
      }, 500); // 500ms的loading时间
      return () => clearTimeout(timer);
    } else {
      setIsPricingLoading(false);
    }
  }, [showPricing]);

  const handleVehicleSelect = useCallback((vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
  }, []);

  const handleNext = useCallback(() => {
    if (!orderDraft) return;
    // 保存配置面板滚动位置
    if (configScrollRef.current) {
      savedScrollTop.current = configScrollRef.current.scrollTop;
    }
    OrderStorage.save(orderDraft);
    setCurrentStep("confirm");
  }, [orderDraft]);

  const handleBack = useCallback(() => {
    setCurrentStep("configure");
    // 恢复配置面板滚动位置（等 DOM 渲染完成）
    requestAnimationFrame(() => {
      if (configScrollRef.current) {
        configScrollRef.current.scrollTop = savedScrollTop.current;
      }
    });
  }, []);

  const handleConfirm = useCallback(async () => {
    if (!orderDraft) return;

    // 校验联系电话
    setContactPhoneError("");
    if (!contactPhone || !contactPhone.trim()) {
      setContactPhoneError("请输入联系电话");
      return;
    }

    // 提取电话号码部分（去掉区号）
    const phoneNumberPart = contactPhone.split(" ").slice(1).join(" ").trim();
    if (!phoneNumberPart) {
      setContactPhoneError("请输入电话号码");
      return;
    }

    // Demo 场景：检查是否选择了最后一个额外服务
    console.log("🔍 开始验证附加服务...");
    console.log("orderDraft.selectedServices:", orderDraft.selectedServices);
    console.log("orderDraft.vehicle.id:", orderDraft.vehicle.id);

    if (orderDraft.selectedServices) {
      const vehicleServices = vehicleServicesMap[orderDraft.vehicle.id] || [];
      const lastService = vehicleServices[vehicleServices.length - 1];

      console.log("vehicleServices:", vehicleServices);
      console.log("lastService:", lastService);

      if (lastService) {
        // 检查单项服务
        if (!isServiceGroup(lastService)) {
          console.log("检查单项服务，lastService.id:", lastService.id);
          console.log("selectedServices.itemIds:", orderDraft.selectedServices.itemIds);
          if (orderDraft.selectedServices.itemIds.includes(lastService.id)) {
            console.log("🚨 触发错误提示！");
            setAlertMessage("订单提交失败：该附加服务暂不支持，请重新选择");
            setShowAlert(true);
            return;
          }
        }
        // 检查分组服务（如果最后一个是分组）
        else {
          console.log("检查分组服务，lastService.id:", lastService.id);
          const groupSelections = orderDraft.selectedServices.groupSelections[lastService.id];
          console.log("groupSelections:", groupSelections);
          if (groupSelections && groupSelections.length > 0) {
            console.log("🚨 触发错误提示！");
            setAlertMessage("订单提交失败：该附加服务暂不支持，请重新选择");
            setShowAlert(true);
            return;
          }
        }
      }
    }

    console.log("✅ 验证通过，继续提交...");

    setIsSubmitting(true);

    const confirmation: OrderConfirmation = {
      contactPhone,
      scheduledTime: scheduledTime ? new Date(scheduledTime) : undefined,
      driverNote,
      paymentMethod: "credit",
    };

    const completeOrder = {
      ...orderDraft,
      ...confirmation,
      orderId: `ORD-${Date.now()}`,
      createdAt: new Date(),
    };

    console.log("提交订单:", completeOrder);

    // TODO: 保存订单到数据库或本地存储
    // 目前使用 mock 数据，实际应该调用 API 保存订单

    await new Promise((resolve) => setTimeout(resolve, 1000));

    OrderStorage.clear();
    setIsSubmitting(false);

    // 跳转到订单记录页面
    router.push('/orders');
  }, [orderDraft, contactPhone, scheduledTime, driverNote, router]);

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 to-gray-100">
      <Navbar />

      {/* Main Content: Left Panel + Right Map */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 overflow-hidden relative">
        {/* Map - Mobile background (full screen) + Desktop right panel (3/5 = 60%) */}
        <div className="absolute inset-0 lg:relative lg:col-span-3 lg:col-start-3 lg:row-start-1">
          <MapView pickupAddress={pickupAddress} dropoffAddress={dropoffAddress} />

          {/* 测试按钮（地图左侧） */}
          <button
            onClick={() => {
              setAlertMessage("订单提交失败：该附加服务暂不支持，请重新选择");
              setShowAlert(true);
            }}
            className="absolute top-4 left-4 px-3 py-1.5
                       bg-white/90 backdrop-blur-sm
                       text-gray-700 text-xs rounded-lg
                       shadow-md hover:shadow-lg
                       border border-gray-200
                       transition-all cursor-pointer z-10"
          >
            测试报错
          </button>
        </div>

        {/* Left Panel — Form (floats on mobile, fixed on desktop, 2/5 = 40%) */}
        <div ref={leftColRef} className="relative overflow-hidden h-full lg:col-span-2 lg:border-r lg:border-slate-200/60 z-10">
          {/* 配置模式 */}
          {currentStep === "configure" && (
            <div
              ref={configScrollRef}
              className="h-full overflow-y-scroll subtle-scroll bg-white relative
                         animate-in fade-in slide-in-from-left-8 duration-300"
              style={{ paddingBottom: showPricing ? 'calc(320px + env(safe-area-inset-bottom))' : '24px' }}
            >
              {/* 报错栏（固定悬浮在顶部，不占空间） */}
              {showAlert && (
                <div className="sticky top-0 z-50 h-0 overflow-visible">
                  <div className="px-4 lg:px-6 pt-4">
                    <GlobalAlert
                      message={alertMessage}
                      type="error"
                      visible={showAlert}
                      onClose={() => setShowAlert(false)}
                    />
                  </div>
                </div>
              )}

              <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
                {/* 页面标题 */}
                <div className="pb-4 border-b border-gray-100">
                  <h1 className="text-lg font-semibold text-gray-900">
                    下单叫车
                  </h1>
                  <p className="text-sm text-gray-500 mt-1.5">
                    填写装卸货信息，快速匹配司机
                  </p>
                </div>

                <VehicleSelector
                  selectedVehicle={selectedVehicle}
                  onSelect={handleVehicleSelect}
                />

                <RouteSection
                  pickupAddress={pickupAddress}
                  dropoffAddress={dropoffAddress}
                  onPickupChange={setPickupAddress}
                  onDropoffChange={setDropoffAddress}
                />

                <AdditionalServices
                  visible={selectedVehicle !== null}
                  selectedVehicle={selectedVehicle}
                  onSelectionChange={setSelectedServices}
                />
              </div>
            </div>
          )}

          {/* 确认模式 */}
          {currentStep === "confirm" && orderDraft && (
            <div
              className="h-full overflow-y-scroll subtle-scroll bg-white relative
                         animate-in fade-in slide-in-from-right-8 duration-300"
            >
              {/* 固定顶部导航: 返回按钮 + 确认订单标题 */}
              <div
                className="sticky top-0 z-10 bg-white px-4 lg:px-6 border-b border-gray-200 flex items-center h-14"
                style={{
                  boxShadow: "0px 1px 3px 0px rgba(0,0,0,0.04)"
                }}
              >
                <button
                  onClick={handleBack}
                  className="-ml-2 w-8 h-8 flex items-center justify-center rounded-lg
                           text-gray-500 hover:text-gray-900 hover:bg-gray-100
                           transition-colors cursor-pointer"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <h1 className="text-base font-semibold text-gray-900 ml-1">确认订单</h1>
              </div>

              {/* 报错栏（固定悬浮在导航栏下方，不占空间） */}
              {showAlert && (
                <div className="sticky top-14 z-50 h-0 overflow-visible">
                  <div className="px-4 lg:px-6 pt-4">
                    <GlobalAlert
                      message={alertMessage}
                      type="error"
                      visible={showAlert}
                      onClose={() => setShowAlert(false)}
                    />
                  </div>
                </div>
              )}

              {/* 内容区 */}
              <div className="p-4 lg:p-6" style={{ paddingBottom: "120px" }}>
              <div className="mb-4">
                <OrderSummary
                  pickup={orderDraft.pickup}
                  dropoff={orderDraft.dropoff}
                  vehicle={orderDraft.vehicle}
                  pricingOption={orderDraft.pricingOption}
                  totalPrice={orderDraft.totalPrice}
                />
              </div>

              <div className="mb-4">
                <OrderContactPhone value={contactPhone} onChange={setContactPhone} error={contactPhoneError} />
              </div>

              <div className="mb-4">
                <DateTimePicker value={scheduledTime} onChange={setScheduledTime} />
              </div>

              <div className="mb-4">
                <DriverNoteInput value={driverNote} onChange={setDriverNote} />
              </div>

              <div>
                <PaymentMethodSelector />
              </div>
              </div>
            </div>
          )}

          {/* 价格模块（配置模式底部） */}
          {currentStep === "configure" && showPricing && (
            <div className="absolute bottom-0 left-0 right-0 z-20 transition-opacity duration-300 ease-out">
              {isPricingLoading ? (
                <PricingFooterSkeleton />
              ) : (
                <PricingFooter orderDraft={orderDraft || undefined} onNext={handleNext} />
              )}
            </div>
          )}

          {/* 确认按钮（确认模式底部） */}
          {currentStep === "confirm" && orderDraft && (
            <ConfirmationFooter
              totalPrice={orderDraft.totalPrice}
              orderDraft={orderDraft}
              onConfirm={handleConfirm}
              isSubmitting={isSubmitting}
            />
          )}
        </div>
      </div>
    </div>
  );
}
