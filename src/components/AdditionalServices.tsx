"use client";

import { useState, useEffect } from "react";
import {
  vehicleServicesMap,
  currencyConfig,
  isServiceGroup,
  type Vehicle,
  type VehicleService,
  type VehicleServiceItem,
  type VehicleServiceGroup,
} from "@/data/mockData";

interface AdditionalServicesProps {
  visible: boolean;
  selectedVehicle: Vehicle | null;
  onSelectionChange?: (selection: {
    itemIds: string[];
    groupSelections: Record<string, string[]>;
  }) => void;
}

export default function AdditionalServices({
  visible,
  selectedVehicle,
  onSelectionChange,
}: AdditionalServicesProps) {
  // Track selected single items and group items separately
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [selectedGroupItems, setSelectedGroupItems] = useState<
    Record<string, Set<string>>
  >({});
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  // Reset selections when vehicle changes
  useEffect(() => {
    setSelectedItems(new Set());
    setSelectedGroupItems({});
    setExpandedGroups(new Set());
  }, [selectedVehicle?.id]);

  // Notify parent of selection changes
  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange({
        itemIds: Array.from(selectedItems),
        groupSelections: Object.fromEntries(
          Object.entries(selectedGroupItems).map(([k, v]) => [k, Array.from(v)])
        ),
      });
    }
  }, [selectedItems, selectedGroupItems, onSelectionChange]);

  if (!visible || !selectedVehicle) return null;

  const services = vehicleServicesMap[selectedVehicle.id] || [];
  if (services.length === 0) return null;

  const { symbol } = currencyConfig;

  const toggleItem = (id: string) => {
    setSelectedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleGroupItem = (groupId: string, itemId: string, maxSelect?: number) => {
    setSelectedGroupItems((prev) => {
      const current = prev[groupId] || new Set<string>();
      const next = new Set(current);

      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        if (maxSelect === 1) {
          // Radio-like: clear all others
          next.clear();
        }
        next.add(itemId);
      }

      return { ...prev, [groupId]: next };
    });
  };

  const toggleExpanded = (groupId: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) next.delete(groupId);
      else next.add(groupId);
      return next;
    });
  };

  const formatPrice = (price: number) => {
    return `+${symbol}${price.toFixed(2)}`;
  };

  // Price display logic:
  //   price > 0 → always show
  //   price === 0 → show only when checked
  const renderPrice = (price: number, isChecked: boolean) => {
    if (price > 0) {
      return (
        <span className="font-price text-xs text-gray-400 flex-shrink-0">
          {formatPrice(price)}
        </span>
      );
    }
    if (price === 0 && isChecked) {
      return (
        <span className="text-xs text-gray-400 flex-shrink-0">
          {formatPrice(0)}
        </span>
      );
    }
    return null;
  };

  const renderSingleItem = (
    item: VehicleServiceItem,
    isChecked: boolean,
    onToggle: () => void,
    isLast: boolean,
    indented = false
  ) => (
    <label
      key={item.id}
      className={`flex items-center gap-3 ${
        indented ? "pl-8 lg:pl-10 pr-4" : "px-4"
      } py-3.5 lg:py-3 cursor-pointer hover:bg-gray-50 transition-colors ${
        isLast ? "" : "border-b border-gray-100"
      }`}
    >
      <input
        type="checkbox"
        checked={isChecked}
        onChange={onToggle}
        className="sr-only peer"
      />
      <div
        className={`w-4 h-4 rounded flex-shrink-0 flex items-center justify-center transition-colors duration-150 ${
          isChecked
            ? "bg-blue-600"
            : "border border-gray-300 bg-white"
        }`}
      >
        {isChecked && (
          <svg
            className="w-2.5 h-2.5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-sm text-gray-900">{item.name}</span>
        {item.description && (
          <p className="text-xs text-gray-400 mt-0.5">{item.description}</p>
        )}
      </div>
      {renderPrice(item.price, isChecked)}
    </label>
  );

  const renderGroup = (
    group: VehicleServiceGroup,
    isLastService: boolean
  ) => {
    const isExpanded = expandedGroups.has(group.id);
    const selected = selectedGroupItems[group.id] || new Set<string>();
    const selectedCount = selected.size;

    return (
      <div
        key={group.id}
        className={isLastService ? "" : "border-b border-gray-100"}
      >
        <button
          onClick={() => toggleExpanded(group.id)}
          className="w-full flex items-center gap-2 px-4 py-3 hover:bg-gray-50 transition-colors text-left cursor-pointer"
        >
          <svg
            className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${
              isExpanded ? "rotate-0" : "-rotate-90"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
          <div className="flex-1 min-w-0">
            <span className="text-sm font-medium text-gray-900">
              {group.name}
            </span>
            {group.maxSelect && (
              <span className="text-xs text-gray-400 ml-2">
                最多选择 {group.maxSelect} 个
              </span>
            )}
          </div>
          {selectedCount > 0 && (
            <span className="text-xs text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-full">
              {selectedCount}
            </span>
          )}
        </button>

        {isExpanded && (
          <div className="border-t border-gray-100">
            {group.items.map((item, idx) => {
              const isChecked = selected.has(item.id);
              const isItemLast = idx === group.items.length - 1;
              return renderSingleItem(
                item,
                isChecked,
                () => toggleGroupItem(group.id, item.id, group.maxSelect),
                isItemLast,
                true
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <h2 className="text-sm font-semibold text-gray-900 mb-3">附加服务</h2>

      <div className="space-y-0 border border-gray-200/60 rounded-xl overflow-hidden bg-white">
        {services.map((service: VehicleService, index: number) => {
          const isLast = index === services.length - 1;

          if (isServiceGroup(service)) {
            return renderGroup(service, isLast);
          }

          // Single item
          const isChecked = selectedItems.has(service.id);
          return renderSingleItem(
            service as VehicleServiceItem,
            isChecked,
            () => toggleItem(service.id),
            isLast
          );
        })}
      </div>
    </div>
  );
}
