"use client";

import { useState, useRef, useEffect } from "react";

interface Region {
  id: string;
  name: string;
  flag: string;
}

interface Language {
  id: string;
  name: string;
  localName: string;
}

const REGIONS: Region[] = [
  { id: "th", name: "泰国", flag: "🇹🇭" },
  { id: "vn", name: "越南", flag: "🇻🇳" },
  { id: "my", name: "马来西亚", flag: "🇲🇾" },
  { id: "id", name: "印尼", flag: "🇮🇩" },
  { id: "hk", name: "香港", flag: "🇭🇰" },
];

const LANGUAGES: Language[] = [
  { id: "zh", name: "中文", localName: "中文" },
  { id: "en", name: "English", localName: "English" },
];

export default function RegionLanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<string>("th");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("zh");
  const containerRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const currentRegion = REGIONS.find((r) => r.id === selectedRegion);
  const currentLanguage = LANGUAGES.find((l) => l.id === selectedLanguage);

  return (
    <div ref={containerRef} className="relative">
      {/* 触发按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg shadow-sm
                   text-sm font-medium text-gray-700
                   hover:bg-gray-50 transition-colors cursor-pointer"
      >
        <svg
          className="w-4 h-4 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>{currentRegion?.name}</span>
        <svg
          className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
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
      </button>

      {/* 弹出气泡 */}
      {isOpen && (
        <div
          className="absolute top-full right-0 mt-2 min-w-[200px] bg-white rounded-xl shadow-lg
                     border border-gray-200 overflow-hidden z-50
                     animate-in fade-in slide-in-from-top-2 duration-200"
        >
          {/* 地区选择 */}
          <div className="p-3 border-b border-gray-100">
            <div className="text-xs font-medium text-gray-500 mb-2 px-2">
              地区
            </div>
            <div className="space-y-0.5">
              {REGIONS.map((region) => (
                <button
                  key={region.id}
                  onClick={() => {
                    setSelectedRegion(region.id);
                    // 不立即关闭，允许继续选择语言
                  }}
                  className={`w-full flex items-center gap-3 px-2 py-2 rounded-lg
                             text-sm transition-colors cursor-pointer ${
                    selectedRegion === region.id
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span className="text-lg">{region.flag}</span>
                  <span className="flex-1 text-left font-medium">
                    {region.name}
                  </span>
                  {selectedRegion === region.id && (
                    <svg
                      className="w-4 h-4 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* 语言选择 */}
          <div className="p-3">
            <div className="text-xs font-medium text-gray-500 mb-2 px-2">
              语言
            </div>
            <div className="space-y-0.5">
              {LANGUAGES.map((language) => (
                <button
                  key={language.id}
                  onClick={() => {
                    setSelectedLanguage(language.id);
                    // 选择语言后关闭弹窗
                    setTimeout(() => setIsOpen(false), 150);
                  }}
                  className={`w-full flex items-center gap-3 px-2 py-2 rounded-lg
                             text-sm transition-colors cursor-pointer ${
                    selectedLanguage === language.id
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span className="flex-1 text-left font-medium">
                    {language.localName}
                  </span>
                  {selectedLanguage === language.id && (
                    <svg
                      className="w-4 h-4 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
