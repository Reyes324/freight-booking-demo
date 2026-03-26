"use client";

import Image from "next/image";
import { InfoCircleOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import { vehicles, type Vehicle } from "@/data/mockData";

interface VehicleSelectorProps {
  selectedVehicle: Vehicle | null;
  onSelect: (vehicle: Vehicle) => void;
}

export default function VehicleSelector({
  selectedVehicle,
  onSelect,
}: VehicleSelectorProps) {
  const current = selectedVehicle ?? vehicles[0];
  const selectedIndex = vehicles.findIndex((v) => v.id === current.id);

  const goToPrev = () => {
    const prevIndex = selectedIndex <= 0 ? vehicles.length - 1 : selectedIndex - 1;
    onSelect(vehicles[prevIndex]);
  };

  const goToNext = () => {
    const nextIndex = selectedIndex >= vehicles.length - 1 ? 0 : selectedIndex + 1;
    onSelect(vehicles[nextIndex]);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-gray-900">服务类型</h2>
        <a
          href="https://www.lalamove.com/zh-hk/all-vehicle-pricing-detail"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
        >
          <InfoCircleOutlined className="text-base" />
          更多详情
        </a>
      </div>

      {/* Tag buttons */}
      <div className="flex flex-wrap gap-x-4 gap-y-2.5 mb-5">
        {vehicles.map((vehicle) => {
          const isSelected = vehicle.id === current.id;
          return (
            <button
              key={vehicle.id}
              onClick={() => onSelect(vehicle)}
              className={`rounded-full border px-5 py-1.5 text-sm font-medium transition-all duration-200 cursor-pointer ${
                isSelected
                  ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                  : "border-gray-200 text-gray-700 hover:border-gray-400"
              }`}
            >
              {vehicle.name}
            </button>
          );
        })}
      </div>

      {/* Vehicle display area */}
      <div className="relative flex items-center justify-center py-2">
        {/* Left arrow — pinned to left edge */}
        <button
          onClick={goToPrev}
          className="absolute left-0 flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-400 hover:border-gray-300 hover:text-gray-600 hover:shadow-sm transition-all cursor-pointer"
        >
          <LeftOutlined className="text-sm" />
        </button>

        {/* Vehicle image + info */}
        <div className="flex flex-col items-center text-center">
          <div className="w-[120px] h-[120px] relative mb-3">
            <Image
              src={current.image}
              alt={current.name}
              fill
              className="object-contain"
              sizes="120px"
            />
          </div>

          {/* Dimensions + weight */}
          {(current.dimensions || current.weight) && (
            <div className="flex items-center gap-3 text-xs text-gray-500 mb-1.5">
              {current.dimensions && <span>{current.dimensions}</span>}
              {current.dimensions && current.weight && (
                <span className="text-gray-300">|</span>
              )}
              {current.weight && <span>载重 {current.weight}</span>}
            </div>
          )}

          {/* Description */}
          {current.description && (
            <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
              {current.description}
            </p>
          )}
        </div>

        {/* Right arrow — pinned to right edge */}
        <button
          onClick={goToNext}
          className="absolute right-0 flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-400 hover:border-gray-300 hover:text-gray-600 hover:shadow-sm transition-all cursor-pointer"
        >
          <RightOutlined className="text-sm" />
        </button>
      </div>
    </div>
  );
}
