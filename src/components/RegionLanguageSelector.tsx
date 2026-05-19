"use client";

import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useT } from "@/hooks/useT";
import { COUNTRY_GROUPS, findCity } from "@/data/cities";

const LANGUAGES = [
  { id: "zh", localName: "中文" },
  { id: "en", localName: "English" },
];

export default function RegionLanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [panelPos, setPanelPos] = useState({ top: 0, right: 0 });
  const { lang, setLang, cityId, setCityId } = useLanguage();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const t = useT();

  // 点外部关闭
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        triggerRef.current && !triggerRef.current.contains(event.target as Node) &&
        panelRef.current && !panelRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  // 打开时计算按钮位置，让 fixed 面板对齐
  function handleOpen() {
    if (!isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPanelPos({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }
    setIsOpen((v) => !v);
  }

  const selected = findCity(cityId);
  const triggerLabel = selected
    ? `${selected.country.flag} ${lang === "zh" ? selected.city.zhName : selected.city.enName}`
    : "";

  return (
    <div className="relative">
      {/* 触发按钮 */}
      <button
        ref={triggerRef}
        onClick={handleOpen}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg shadow-sm
                   text-sm font-medium text-gray-700
                   hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
      >
        <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>{triggerLabel}</span>
        <svg
          className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* 弹出面板 — fixed 定位，绕过 MapView 的 overflow-hidden */}
      {isOpen && (
        <div
          ref={panelRef}
          style={{ top: panelPos.top, right: panelPos.right }}
          className="fixed w-80 bg-white rounded-xl shadow-lg
                     border border-gray-200 overflow-hidden z-[9999]
                     animate-in fade-in slide-in-from-top-2 duration-200"
        >
          {/* 语言 */}
          <div className="px-3 pt-3 pb-2 border-b border-gray-100">
            <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5 px-1">
              {t.regionSelector.languageLabel}
            </div>
            <div className="space-y-0.5">
              {LANGUAGES.map((l) => {
                const isLangSelected = lang === l.id;
                return (
                  <button
                    key={l.id}
                    onClick={() => setLang(l.id as "zh" | "en")}
                    className={`w-full flex items-center justify-between gap-2 px-2 py-2 rounded-lg
                               transition-colors cursor-pointer text-left ${
                      isLangSelected ? "bg-blue-50" : "hover:bg-gray-50"
                    }`}
                  >
                    <span className={`text-sm font-medium ${isLangSelected ? "text-blue-700" : "text-gray-900"}`}>
                      {l.localName}
                    </span>
                    {isLangSelected && (
                      <svg className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 地区 */}
          <div className="px-3 pt-3 pb-3">
            <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5 px-1">
              {lang === "zh" ? "地区" : "Region"}
            </div>
            <div className="max-h-72 overflow-y-auto -mr-1 pr-1">
              {COUNTRY_GROUPS.map((country, ci) => (
                <div key={country.id} className={ci > 0 ? "mt-3" : ""}>
                  {/* 国家标题 — 父级，不可点击 */}
                  <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-gray-50 mb-1">
                    <span className="text-base leading-none">{country.flag}</span>
                    <div>
                      <span className="text-xs font-semibold text-gray-700">{country.zhName}</span>
                      <span className="text-xs text-gray-400 ml-1">{country.enName}</span>
                    </div>
                  </div>
                  {/* 城市列表 — 子级，缩进 */}
                  <div className="space-y-0.5 pl-3">
                    {country.cities.map((city) => {
                      const isSelected = cityId === city.id;
                      return (
                        <button
                          key={city.id}
                          onClick={() => {
                            setCityId(city.id);
                            setTimeout(() => setIsOpen(false), 150);
                          }}
                          className={`w-full flex items-center justify-between gap-2 px-2 py-2 rounded-lg
                                     transition-colors cursor-pointer text-left ${
                            isSelected ? "bg-blue-50" : "hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex items-baseline gap-1.5 min-w-0">
                            <span className={`text-sm font-medium shrink-0 ${isSelected ? "text-blue-700" : "text-gray-900"}`}>
                              {city.zhName}
                            </span>
                            <span className={`text-xs truncate ${isSelected ? "text-blue-400" : "text-gray-400"}`}>
                              {city.enName}
                            </span>
                          </div>
                          {isSelected && (
                            <svg className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
