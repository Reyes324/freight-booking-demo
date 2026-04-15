"use client";

import { useState, useRef, useEffect } from "react";

interface Region {
  id: string;
  name: string;
  country: string;
  flag: string;
}

interface Language {
  id: string;
  name: string;
  localName: string;
}

// 按国家分组的地区列表
const REGIONS: Region[] = [
  // 泰国
  { id: "th-bangkok", name: "Bangkok（曼谷）", country: "泰国", flag: "🇹🇭" },
  { id: "th-chonburi", name: "Chonburi（春武里）", country: "泰国", flag: "🇹🇭" },
  { id: "th-khonkaen", name: "Khon Kaen（孔敬）", country: "泰国", flag: "🇹🇭" },

  // 马来西亚
  { id: "my-kl", name: "Kuala Lumpur（吉隆坡）", country: "马来西亚", flag: "🇲🇾" },
  { id: "my-johor", name: "Johor & Nearby Districts（柔佛及周边）", country: "马来西亚", flag: "🇲🇾" },
  { id: "my-penang", name: "Penang & Nearby States（槟城及周边）", country: "马来西亚", flag: "🇲🇾" },
  { id: "my-malacca", name: "Malacca（马六甲）", country: "马来西亚", flag: "🇲🇾" },
  { id: "my-kuching", name: "Kuching（古晋）", country: "马来西亚", flag: "🇲🇾" },

  // 印尼
  { id: "id-jakarta", name: "Jakarta（雅加达）", country: "印尼", flag: "🇮🇩" },
  { id: "id-bandung", name: "Bandung（万隆）", country: "印尼", flag: "🇮🇩" },
  { id: "id-surabaya", name: "Surabaya（泗水）", country: "印尼", flag: "🇮🇩" },
  { id: "id-semarang", name: "Semarang（三宝垄）", country: "印尼", flag: "🇮🇩" },
  { id: "id-medan", name: "Medan（棉兰）", country: "印尼", flag: "🇮🇩" },
  { id: "id-malang", name: "Malang（玛琅）", country: "印尼", flag: "🇮🇩" },
  { id: "id-cirebon", name: "Cirebon（井里汶）", country: "印尼", flag: "🇮🇩" },
  { id: "id-yogyakarta", name: "Yogyakarta（日惹）", country: "印尼", flag: "🇮🇩" },

  // 越南
  { id: "vn-hcm", name: "Ho Chi Minh City and Nearby Regions（胡志明市及周边）", country: "越南", flag: "🇻🇳" },
  { id: "vn-hanoi", name: "Hanoi and Nearby Regions（河内及周边）", country: "越南", flag: "🇻🇳" },
  { id: "vn-danang", name: "Da Nang and Central Provinces（岘港及中部省份）", country: "越南", flag: "🇻🇳" },
  { id: "vn-cantho", name: "Can Tho and Mekong Delta Region（芹苴及湄公河三角洲）", country: "越南", flag: "🇻🇳" },
  { id: "vn-thainguyen", name: "Thai Nguyen and Northern Region（太原及北部地区）", country: "越南", flag: "🇻🇳" },
];

const LANGUAGES: Language[] = [
  { id: "zh", name: "中文", localName: "中文" },
  { id: "en", name: "English", localName: "English" },
];

// 按国家分组
const COUNTRIES = ["泰国", "马来西亚", "印尼", "越南"];

export default function RegionLanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<string>("th-bangkok");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("zh");
  const containerRef = useRef<HTMLDivElement>(null);

  // 初始化时从 localStorage 读取语言设置
  useEffect(() => {
    const savedLanguage = localStorage.getItem("appLanguage");
    if (savedLanguage && (savedLanguage === "zh" || savedLanguage === "en")) {
      setSelectedLanguage(savedLanguage);
    }
  }, []);

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
                   hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
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
          className="absolute top-full right-0 mt-2 min-w-[400px] max-w-max bg-white rounded-xl shadow-lg
                     border border-gray-200 overflow-hidden z-50 max-h-[500px] overflow-y-auto
                     animate-in fade-in slide-in-from-top-2 duration-200"
        >
          {/* 语言选择 */}
          <div className="p-3 border-b border-gray-100">
            <div className="text-xs font-medium text-gray-500 mb-2 px-2">
              语言
            </div>
            <div className="space-y-0.5">
              {LANGUAGES.map((language) => (
                <button
                  key={language.id}
                  onClick={() => {
                    setSelectedLanguage(language.id);
                    // 保存到 localStorage
                    localStorage.setItem("appLanguage", language.id);
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

          {/* 地区选择 */}
          <div className="p-3">
            <div className="text-xs font-medium text-gray-500 mb-2 px-2">
              地区
            </div>
            <div className="space-y-3">
              {COUNTRIES.map((country) => {
                const countryRegions = REGIONS.filter(r => r.country === country);
                return (
                  <div key={country}>
                    <div className="text-xs font-medium text-gray-400 mb-1.5 px-2">
                      {countryRegions[0]?.flag} {country}
                    </div>
                    <div className="space-y-0.5">
                      {countryRegions.map((region) => (
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
                          <span className="flex-1 text-left text-xs whitespace-nowrap">
                            {region.name}
                          </span>
                          {selectedRegion === region.id && (
                            <svg
                              className="w-4 h-4 text-blue-600 flex-shrink-0"
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
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
