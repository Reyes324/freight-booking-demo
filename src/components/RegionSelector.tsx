"use client";

import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { COUNTRY_GROUPS, findCity } from "@/data/cities";

export default function RegionSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [panelPos, setPanelPos] = useState({ top: 0, right: 0 });
  const { lang, cityId, setCityId } = useLanguage();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

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
        className="flex items-start gap-2 px-4 py-2.5 bg-white rounded-xl
                   text-sm font-medium text-gray-700
                   hover:bg-gray-50 transition-colors cursor-pointer"
        style={{
          boxShadow: "0 8px 24px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)",
          // globals.css 里 `* { max-width: 100% }` 是无 @layer 包裹的全局规则，
          // 优先级高于 Tailwind 的 @layer utilities（包括 max-w-[...]），只能用内联样式覆盖
          maxWidth: 240,
        }}
      >
        <span className="text-left leading-[1.57]">{triggerLabel}</span>
        <svg
          className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
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
          className="fixed w-96 bg-white rounded-xl shadow-lg
                     border border-gray-200 overflow-hidden z-[9999]
                     animate-in fade-in slide-in-from-top-2 duration-200"
        >
          {/* 地区 */}
          <div className="px-3 py-3">
            <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5 px-1">
              {lang === "zh" ? "地区" : "Region"}
            </div>
            <div className="max-h-[420px] overflow-y-auto -mr-1 pr-1">
              {COUNTRY_GROUPS.map((country, ci) => (
                <div key={country.id} className={ci > 0 ? "mt-3" : ""}>
                  {/* 国家标题 — 父级，不可点击 */}
                  <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-gray-50 mb-1">
                    <span className="text-base leading-none">{country.flag}</span>
                    <span className="text-xs font-semibold text-gray-700">
                      {lang === "zh" ? country.zhName : country.enName}
                    </span>
                  </div>
                  {/* 城市列表 — 子级，缩进 */}
                  <div className="space-y-1 pl-3">
                    {country.cities.map((city) => {
                      const isSelected = cityId === city.id;
                      return (
                        <button
                          key={city.id}
                          onClick={() => {
                            setCityId(city.id);
                            setTimeout(() => setIsOpen(false), 150);
                          }}
                          className={`w-full flex items-start justify-between gap-2 px-2 py-2 rounded-lg
                                     transition-colors cursor-pointer text-left ${
                            isSelected ? "bg-blue-50" : "hover:bg-gray-50"
                          }`}
                        >
                          <span className={`min-w-0 flex-1 text-sm font-normal leading-[1.57] ${isSelected ? "text-blue-700" : "text-gray-900"}`}>
                            {lang === "zh" ? city.zhName : city.enName}
                          </span>
                          {isSelected && (
                            <svg className="w-3.5 h-3.5 mt-0.5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
