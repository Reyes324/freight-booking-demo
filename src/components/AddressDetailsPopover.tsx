"use client";

import { useState, useEffect, useRef } from "react";
import type { AddressDetail } from "@/data/mockData";
import { useT } from "@/hooks/useT";

interface AddressDetailsPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (details: AddressDetail) => void;
  addressText: string;
  initialData?: Partial<AddressDetail>;
  coordinates?: { lat?: number; lng?: number };
  anchorRef?: React.RefObject<HTMLElement>;
}

export default function AddressDetailsPopover({
  isOpen,
  onClose,
  onConfirm,
  addressText,
  initialData,
  coordinates,
  anchorRef,
}: AddressDetailsPopoverProps) {
  const [contactName, setContactName] = useState(initialData?.contactName || "");
  const [phone, setPhone] = useState(initialData?.phone || "");
  const [unit, setUnit] = useState(initialData?.unit || "");
  const t = useT();
  const popoverRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [arrowTop, setArrowTop] = useState(24);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Reset form when popover opens
      setContactName(initialData?.contactName || "");
      setPhone(initialData?.phone || "");
      setUnit(initialData?.unit || "");
    }
  }, [isOpen, initialData]);

  // Continuously track anchor position with RAF loop + boundary detection
  useEffect(() => {
    if (!isOpen || !anchorRef?.current) return;

    let rafId: number;
    const update = () => {
      const anchor = anchorRef.current;
      const popover = popoverRef.current;
      if (!anchor || !popover) {
        rafId = requestAnimationFrame(update);
        return;
      }

      const anchorRect = anchor.getBoundingClientRect();
      const popoverHeight = popover.offsetHeight;
      const viewportHeight = window.innerHeight;

      // Ideal position: align with anchor top
      let top = anchorRect.top;

      // Boundary detection: push up if bottom overflows viewport
      if (top + popoverHeight > viewportHeight - 16) {
        top = viewportHeight - popoverHeight - 16;
      }
      // Don't overflow top
      if (top < 16) top = 16;

      const left = anchorRect.right + 16;

      // Arrow offset: always point to anchor center
      const rawArrowTop = anchorRect.top + anchorRect.height / 2 - top;
      // Clamp arrow within popover bounds (12px from edges)
      const clampedArrowTop = Math.max(12, Math.min(rawArrowTop, popoverHeight - 12));

      setPosition({ top, left });
      setArrowTop(clampedArrowTop);

      rafId = requestAnimationFrame(update);
    };

    rafId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafId);
  }, [isOpen, anchorRef]);

  // Control fade-in animation
  useEffect(() => {
    if (isOpen) {
      // Trigger fade-in on next frame to ensure transition works
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        anchorRef?.current &&
        !anchorRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, onClose, anchorRef]);

  const handleSubmit = () => {
    onConfirm({
      address: addressText,
      contactName: contactName.trim(),
      phone: phone.trim(),
      unit: unit.trim() || undefined,
      lat: coordinates?.lat,
      lng: coordinates?.lng,
    });
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Popover - Desktop: positioned to the right of the input */}
      <div
        ref={popoverRef}
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
        }}
        className={`hidden lg:block fixed z-[500] w-80 bg-white border border-gray-200 rounded-xl shadow-xl
                    transition-opacity duration-200 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      >
        {/* Pointer arrow */}
        <div className="absolute left-0 -ml-2 w-4 h-4 bg-white border-l border-t border-gray-200 rotate-[-45deg]" style={{ top: `${arrowTop}px` }} />

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-900">{t.address.detailsTitle}</h3>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-150"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-5 py-4 space-y-4">
          {/* Selected Address (read-only) */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              {t.address.selectedAddress}
            </label>
            <div className="px-3 py-2 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-sm text-gray-700 leading-snug">{addressText}</p>
            </div>
          </div>

          {/* Contact Name */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1.5">
              {t.address.contactName}
            </label>
            <input
              type="text"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder={t.address.contactNamePlaceholder}
              className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400
                         transition-all duration-200 ease-out
                         hover:border-gray-300
                         focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1.5">
              {t.address.contactPhone}
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t.address.contactPhonePlaceholder}
              className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400
                         transition-all duration-200 ease-out
                         hover:border-gray-300
                         focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            />
          </div>

          {/* Unit (optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1.5">
              {t.address.addressNote}
            </label>
            <input
              type="text"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              placeholder="例如：3楼A室，请按门铃"
              className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400
                         transition-all duration-200 ease-out
                         hover:border-gray-300
                         focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2.5 px-5 pb-5 pt-2">
          <button
            onClick={onClose}
            className="flex-1 h-10 px-3 rounded-lg border border-gray-200 text-sm font-medium text-gray-700
                       hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 h-10 px-3 rounded-lg text-sm font-semibold text-white bg-blue-600
                       hover:bg-blue-700 active:bg-blue-800 transition-all duration-150 ease-out"
          >
            确认
          </button>
        </div>
      </div>

      {/* Mobile: Keep bottom drawer (modal style for mobile) */}
      <div className="lg:hidden">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/40 z-[100] animate-in fade-in duration-200"
          onClick={onClose}
        />

        {/* Bottom drawer */}
        <div className="fixed bottom-0 left-0 right-0 z-[110] bg-white rounded-t-2xl shadow-2xl max-h-[85vh] flex flex-col
                        animate-in slide-in-from-bottom duration-300 ease-out">
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-2 flex-shrink-0">
            <div className="w-10 h-1 bg-gray-300 rounded-full" />
          </div>

          {/* Header */}
          <div className="px-4 pb-3 border-b border-gray-100 flex-shrink-0">
            <h3 className="text-base font-semibold text-gray-900">{t.address.detailsTitle}</h3>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {/* Selected Address */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                {t.address.selectedAddress}
              </label>
              <div className="px-3 py-2.5 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-sm text-gray-700">{addressText}</p>
              </div>
            </div>

            {/* Contact Name */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">
                {t.address.contactName}
              </label>
              <input
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder={t.address.contactNamePlaceholder}
                className="w-full h-12 px-3.5 rounded-lg border border-gray-200 bg-white text-base text-gray-900 placeholder:text-gray-400
                           transition-all duration-200 ease-out
                           focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">
                {t.address.contactPhone}
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t.address.contactPhonePlaceholder}
                className="w-full h-12 px-3.5 rounded-lg border border-gray-200 bg-white text-base text-gray-900 placeholder:text-gray-400
                           transition-all duration-200 ease-out
                           focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>

            {/* Unit */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">
                {t.address.addressNote}
              </label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="例如：3楼A室，请按门铃"
                className="w-full h-12 px-3.5 rounded-lg border border-gray-200 bg-white text-base text-gray-900 placeholder:text-gray-400
                           transition-all duration-200 ease-out
                           focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>
          </div>

          {/* Footer - Fixed */}
          <div className="flex gap-3 px-4 pb-safe py-4 border-t border-gray-100 bg-white flex-shrink-0">
            <button
              onClick={onClose}
              className="flex-1 h-12 px-4 rounded-lg border border-gray-200 text-base font-medium text-gray-700
                         active:bg-gray-100 transition-colors duration-150"
            >
              取消
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 h-12 px-4 rounded-lg text-base font-semibold text-white bg-blue-600
                         active:bg-blue-700 transition-all duration-150 ease-out"
            >
              确认
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
