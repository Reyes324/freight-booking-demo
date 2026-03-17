"use client";

import { useState, useRef, useEffect } from "react";
import { searchAddress } from "@/services/addressService";
import type { AddressSuggestion } from "@/services/addressService";

interface AddressSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSelectAddress: (address: AddressSuggestion) => void;
  placeholder?: string;
  label?: string;
  onFocus?: () => void;
  onCancel?: () => void; // Called when user clicks outside without selecting
}

export default function AddressSearchInput({
  value,
  onChange,
  onSelectAddress,
  placeholder = "搜索地址",
  label,
  onFocus,
  onCancel,
}: AddressSearchInputProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout>(undefined);
  const justSelectedRef = useRef(false); // 标记是否刚选择了地址

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // 如果是刚选择的地址，不要触发搜索
    if (justSelectedRef.current) {
      justSelectedRef.current = false;
      return;
    }

    // 修复1: 输入1个字就能联想
    if (value.length > 0) {
      setIsLoading(true);
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const results = await searchAddress(value);
          setSuggestions(results);
          // 修复4: 有结果时显示，或者输入>=3个字符但没结果时也显示空状态
          setShowDropdown(results.length > 0 || value.length >= 3);
        } catch (error) {
          console.error('Search failed:', error);
          setSuggestions([]);
          setShowDropdown(value.length >= 3); // 输入够长才显示空状态
        } finally {
          setIsLoading(false);
        }
      }, 200);
    } else {
      setSuggestions([]);
      setShowDropdown(false);
      setIsLoading(false);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowDropdown(false);
        // Call onCancel to notify parent that user cancelled editing
        if (onCancel) {
          onCancel();
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onCancel]);

  // Auto-focus and move cursor to end when value is pre-filled from clicking existing address
  useEffect(() => {
    if (value && inputRef.current && document.activeElement !== inputRef.current && !showDropdown) {
      // Only auto-focus when dropdown is not showing (i.e., user clicked existing address to edit)
      // Delay to ensure it doesn't conflict with selection flow
      const timer = setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          // Move cursor to end
          const length = value.length;
          inputRef.current.setSelectionRange(length, length);
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [value, showDropdown]);

  const handleSelect = (suggestion: AddressSuggestion) => {
    justSelectedRef.current = true; // 标记为刚选择，避免触发搜索
    onChange(suggestion.mainText);
    onSelectAddress(suggestion);
    setShowDropdown(false);
    setSuggestions([]);
  };

  return (
    <div className="relative">
      {label && (
        <label className="block text-sm font-medium text-gray-900 mb-1.5">
          {label}
        </label>
      )}

      {/* Input - No icon */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          placeholder={placeholder}
          className="w-full h-11 px-3.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400
                     transition-all duration-200 ease-out
                     hover:border-gray-300
                     focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
        />

        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
          </div>
        )}
      </div>

      {/* Dropdown Card - Both Desktop and Mobile */}
      {/* 修复2: 最大高度 + 滚动 */}
      {/* 修复3: 移除所有会导致关闭的逻辑，只保留点击外部关闭 */}
      {/* 修复4: 添加空状态显示 */}
      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden
                     animate-in fade-in slide-in-from-top-2 duration-200"
        >
          {suggestions.length > 0 ? (
            <div className="py-1 max-h-64 overflow-y-auto">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  onClick={() => handleSelect(suggestion)}
                  className="w-full px-4 py-2.5 text-left transition-colors duration-150 hover:bg-gray-50 active:bg-gray-100 cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex-shrink-0">
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 leading-snug">
                        {suggestion.mainText}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {suggestion.secondaryText}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="py-8 px-4 text-center">
              <svg
                className="w-12 h-12 mx-auto text-gray-300 mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <p className="text-sm text-gray-500">未找到匹配的地址</p>
              <p className="text-xs text-gray-400 mt-1">请尝试其他关键词</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
