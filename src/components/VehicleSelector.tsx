"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { vehicles, type Vehicle } from "@/data/mockData";

interface VehicleSelectorProps {
  selectedVehicle: Vehicle | null;
  onSelect: (vehicle: Vehicle) => void;
}

export default function VehicleSelector({
  selectedVehicle,
  onSelect,
}: VehicleSelectorProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll]);

  // Each card is w-40 (160px) + gap-3 (12px) = 172px per card, scroll 2 cards
  const scrollDistance = 172 * 2;

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -scrollDistance, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: scrollDistance, behavior: "smooth" });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-900">服务类型</h3>
        <a
          href="https://www.lalamove.com/zh-hk/all-vehicle-pricing-detail"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          更多详情
        </a>
      </div>

      <div className="relative">
        {/* Scroll Left Button */}
        {canScrollLeft && (
          <button
            onClick={scrollLeft}
            className="flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 z-10 w-10 h-10 bg-white rounded-full items-center justify-center hover:opacity-90 transition-opacity p-2.5 cursor-pointer"
            style={{
              boxShadow: '0px 0.643px 11.571px 0px rgba(0,0,0,0.12), 0px 3.857px 6.429px 0px rgba(0,0,0,0.14)'
            }}
          >
            <Image
              src="/chevron-right.svg"
              alt="左滑"
              width={18}
              height={18}
              className="-scale-x-100"
              unoptimized
            />
          </button>
        )}

        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto scrollbar-hide pb-2"
        >
          {vehicles.map((vehicle) => {
            const isSelected = selectedVehicle?.id === vehicle.id;
            const isHovered = hoveredId === vehicle.id;
            const showDetail = isHovered || isSelected;

            return (
              <button
                key={vehicle.id}
                onClick={() => onSelect(vehicle)}
                onMouseEnter={() => setHoveredId(vehicle.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`flex-shrink-0 w-36 lg:w-40 min-h-[200px] lg:min-h-[180px] rounded-xl border p-3 lg:p-3.5 text-center transition-colors duration-200 relative overflow-hidden cursor-pointer ${
                  isSelected
                    ? "border-blue-600 bg-blue-50/50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {/* Checkmark */}
                {isSelected && (
                  <div className="absolute top-2 right-2 z-10">
                    <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                )}

                {/* Default state: Image + Name */}
                <div
                  className={`transition-opacity duration-200 ${
                    showDetail ? "opacity-0" : "opacity-100"
                  }`}
                >
                  <div className="w-12 h-12 lg:w-16 lg:h-16 mx-auto mb-2 relative">
                    <Image
                      src={vehicle.image}
                      alt={vehicle.name}
                      fill
                      className="object-contain"
                      sizes="(max-width: 1024px) 48px, 64px"
                    />
                  </div>
                  <div className="text-sm font-medium text-gray-900 leading-tight">
                    {vehicle.name}
                  </div>
                </div>

                {/* Hover/Selected state: Name + Description */}
                <div
                  className={`absolute inset-0 p-3.5 flex flex-col justify-center transition-opacity duration-200 ${
                    showDetail ? "opacity-100" : "opacity-0 pointer-events-none"
                  }`}
                >
                  <div className="text-sm font-medium text-gray-900 mb-1.5">
                    {vehicle.name}
                  </div>
                  {vehicle.dimensions && (
                    <div className="text-xs text-gray-400 leading-relaxed">
                      {vehicle.dimensions}
                    </div>
                  )}
                  {vehicle.weight && (
                    <div className="text-xs text-gray-400 leading-relaxed">
                      {vehicle.weight}
                    </div>
                  )}
                  {vehicle.description && (
                    <div className="text-xs text-gray-400 mt-1 leading-relaxed">
                      {vehicle.description}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Scroll Right Button */}
        {canScrollRight && (
          <button
            onClick={scrollRight}
            className="flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 z-10 w-10 h-10 bg-white rounded-full items-center justify-center hover:opacity-90 transition-opacity p-2.5 cursor-pointer"
            style={{
              boxShadow: '0px 0.643px 11.571px 0px rgba(0,0,0,0.12), 0px 3.857px 6.429px 0px rgba(0,0,0,0.14)'
            }}
          >
            <Image
              src="/chevron-right.svg"
              alt="右滑"
              width={18}
              height={18}
              unoptimized
            />
          </button>
        )}
      </div>
    </div>
  );
}
