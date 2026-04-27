"use client";

import { serviceOptions, type ServiceOption } from "@/data/mockData";
import { useT } from "@/hooks/useT";

interface ServiceOptionsProps {
  selectedOption: ServiceOption | null;
  onSelect: (option: ServiceOption) => void;
  visible: boolean;
}

export default function ServiceOptions({
  selectedOption,
  onSelect,
  visible,
}: ServiceOptionsProps) {
  const t = useT();
  if (!visible) return null;

  return (
    <div className="space-y-4">
      {/* Service Option Cards */}
      <div className="flex flex-col lg:flex-row gap-3">
        {serviceOptions.map((option) => {
          const isSelected = selectedOption?.id === option.id;
          return (
            <button
              key={option.id}
              onClick={() => onSelect(option)}
              className={`flex-1 rounded-xl border-2 p-4 text-left transition-all duration-200 ${
                isSelected
                  ? "border-blue-600 bg-blue-50/30"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {option.name}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {option.description}
                  </div>
                </div>
                {option.icon && (
                  <span className="text-lg">{option.icon}</span>
                )}
              </div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="font-price text-xl font-bold text-gray-900">
                  {option.currency} {option.price.toFixed(2)}
                </span>
                {option.recommended && (
                  <svg className="w-4 h-4 text-gray-400 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Next Step Button */}
      <button className="w-full h-12 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-colors duration-200">
        {t.serviceOptions.next}
      </button>
    </div>
  );
}
