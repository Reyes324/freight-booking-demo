"use client";

import { useEffect, useRef, useState } from "react";
import { Drawer, Popover } from "antd";
import { CodeOutlined } from "@ant-design/icons";

export interface UsagePage {
  url: string;
  label: string;
  selector: string;   // CSS selector to highlight, e.g. '[data-ds="Table"]'
  snippet: string;    // code snippet shown on click
}

interface Highlight {
  top: number;
  left: number;
  width: number;
  height: number;
  label: string;
  snippet: string;
}

interface UsageViewerProps {
  open: boolean;
  onClose: () => void;
  componentName: string;
  pages: UsagePage[];
}

export default function UsageViewer({ open, onClose, componentName, pages }: UsageViewerProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [iframeReady, setIframeReady] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const activePage = pages[activeIdx];

  // Reset on page switch
  useEffect(() => {
    setHighlights([]);
    setIframeReady(false);
  }, [activeIdx, open]);

  // Reset active tab when drawer opens
  useEffect(() => {
    if (open) setActiveIdx(0);
  }, [open]);

  function computeHighlights() {
    const iframe = iframeRef.current;
    const wrapper = wrapperRef.current;
    if (!iframe || !wrapper) return;

    try {
      const doc = iframe.contentDocument;
      if (!doc || !activePage) return;

      const els = doc.querySelectorAll<HTMLElement>(activePage.selector);
      const wrapperRect = wrapper.getBoundingClientRect();
      const iframeRect = iframe.getBoundingClientRect();
      const offsetY = iframeRect.top - wrapperRect.top;
      const offsetX = iframeRect.left - wrapperRect.left;

      const found: Highlight[] = [];
      els.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) return;
        found.push({
          top: r.top + offsetY,
          left: r.left + offsetX,
          width: r.width,
          height: r.height,
          label: el.getAttribute("data-ds-label") || componentName,
          snippet: el.getAttribute("data-ds-snippet") || activePage.snippet,
        });
      });
      setHighlights(found);
    } catch {
      // cross-origin guard — should not happen since same localhost
    }
  }

  function handleIframeLoad() {
    setIframeReady(true);
    // small delay to let page paint
    setTimeout(computeHighlights, 400);
  }

  return (
    <Drawer
      title={
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-[#2257D4] bg-[#EEF2FB] px-2 py-0.5 rounded-md">用例</span>
          <span className="text-sm font-semibold text-neutral-800">{componentName} 真实用例</span>
          <span className="text-xs text-neutral-400 font-normal">{pages.length} 处使用</span>
        </div>
      }
      placement="right"
      width="72vw"
      open={open}
      onClose={onClose}
      styles={{ body: { padding: 0, display: "flex", flexDirection: "column" } }}
    >
      {/* 页面标签栏 */}
      <div className="flex items-center gap-1 px-4 py-3 border-b border-[#ECEAE8] bg-[#F8F7F6] shrink-0">
        {pages.map((p, i) => (
          <button
            key={p.url}
            onClick={() => setActiveIdx(i)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              i === activeIdx
                ? "bg-white text-neutral-800 shadow-sm border border-[#ECEAE8]"
                : "text-neutral-500 hover:text-neutral-700 hover:bg-white/60"
            }`}
          >
            {p.label}
          </button>
        ))}
        <span className="ml-auto font-mono text-[10px] text-neutral-300">{activePage?.url}</span>
      </div>

      {/* iframe 区域 */}
      <div ref={wrapperRef} className="relative flex-1 overflow-hidden bg-[#ECEAE8]">
        {/* 加载提示 */}
        {!iframeReady && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-[#ECEAE8]">
            <div className="text-xs text-neutral-400 font-mono">加载中...</div>
          </div>
        )}

        {activePage && (
          <iframe
            ref={iframeRef}
            src={activePage.url}
            onLoad={handleIframeLoad}
            className="w-full h-full border-0"
            style={{ minHeight: 0 }}
          />
        )}

        {/* 高亮覆盖层 */}
        {highlights.map((h, i) => (
          <Popover
            key={i}
            trigger="click"
            placement="left"
            content={
              <div style={{ maxWidth: 360 }}>
                <div className="flex items-center gap-2 mb-2">
                  <CodeOutlined className="text-[#2257D4]" />
                  <span className="text-xs font-medium text-neutral-700">{h.label}</span>
                </div>
                <pre className="text-[11px] bg-[#F8F7F6] rounded-lg p-3 overflow-x-auto text-neutral-600 leading-relaxed m-0 whitespace-pre-wrap">
                  {h.snippet}
                </pre>
              </div>
            }
          >
            <div
              className="absolute cursor-pointer group/hl"
              style={{
                top: h.top,
                left: h.left,
                width: h.width,
                height: h.height,
                outline: "2px solid #2257D4",
                borderRadius: 4,
                backgroundColor: "rgba(34,87,212,0.06)",
                zIndex: 20,
              }}
            >
              {/* 标签 */}
              <div
                className="absolute -top-5 left-0 bg-[#2257D4] text-white text-[10px] font-mono px-2 py-0.5 rounded-t-md whitespace-nowrap pointer-events-none"
                style={{ lineHeight: "18px" }}
              >
                {h.label} · 点击查看代码
              </div>
            </div>
          </Popover>
        ))}
      </div>

      {/* 底栏说明 */}
      <div className="shrink-0 px-4 py-2.5 border-t border-[#ECEAE8] bg-[#F8F7F6] flex items-center gap-2">
        <div
          className="w-3 h-3 rounded-sm shrink-0"
          style={{ border: "2px solid #2257D4", backgroundColor: "rgba(34,87,212,0.06)" }}
        />
        <span className="text-[10px] text-neutral-400">蓝框 = 组件使用位置，点击查看代码片段</span>
        {highlights.length > 0 && (
          <span className="ml-auto text-[10px] font-mono text-neutral-300">
            找到 {highlights.length} 个实例
          </span>
        )}
      </div>
    </Drawer>
  );
}
