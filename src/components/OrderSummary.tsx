"use client";

import Image from "next/image";
import type { AddressDetail, Vehicle } from "@/data/mockData";

interface OrderSummaryProps {
  pickup: AddressDetail;
  dropoff: AddressDetail;
  vehicle: Vehicle;
  pricingOption: string;
  totalPrice: number;
}

export default function OrderSummary({
  pickup,
  dropoff,
  vehicle,
  pricingOption,
  totalPrice,
}: OrderSummaryProps) {
  const optionLabel = pricingOption === "priority" ? "优先订单" : "标准订单";

  return (
    <div>
      <h3 className="text-sm font-medium text-gray-900 mb-1.5">订单摘要</h3>

      <div className="border border-gray-200 rounded-xl p-3.5 space-y-2.5 bg-white">
        {/* 路线信息 */}
        <div className="flex gap-2.5">
          {/* 左侧标记列 */}
          <div className="flex flex-col" style={{ width: '12px' }}>
            {/* 起点圆圈 */}
            <div className="min-h-[32px] flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-blue-600 flex-shrink-0" />
            </div>
            {/* 连接线 */}
            <div className="h-2 relative flex items-center justify-center">
              <div
                className="absolute left-1/2 -translate-x-1/2 w-px border-l border-dashed border-gray-300"
                style={{
                  top: '-10px',
                  bottom: '-10px'
                }}
              />
            </div>
            {/* 终点圆圈 */}
            <div className="min-h-[32px] flex items-center justify-center">
              <div className="w-3 h-3 rounded-full border border-gray-400 bg-white flex-shrink-0" />
            </div>
          </div>

          {/* 右侧地址列 */}
          <div className="flex-1 space-y-2 min-w-0">
            <div className="min-h-[32px] flex items-center">
              <p className="text-sm text-gray-900 break-words leading-snug">{pickup.address}</p>
            </div>
            <div className="min-h-[32px] flex items-center">
              <p className="text-sm text-gray-900 break-words leading-snug">{dropoff.address}</p>
            </div>
          </div>
        </div>

        {/* 车型和价格 */}
        <div className="flex items-center gap-2.5 pt-2 border-t border-gray-100">
          <div className="relative w-9 h-9 flex-shrink-0">
            <Image
              src={vehicle.image}
              fill
              alt={vehicle.name}
              className="object-contain"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 leading-tight">{vehicle.name}</p>
            <p className="text-xs text-gray-500 leading-tight mt-0.5">{optionLabel}</p>
          </div>
          <p className="text-lg font-bold text-gray-900 flex-shrink-0 leading-none">
            HK$ {totalPrice.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}
