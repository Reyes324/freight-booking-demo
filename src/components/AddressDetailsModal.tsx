"use client";

import { useState, useEffect } from "react";
import type { AddressDetail } from "@/data/mockData";

interface AddressDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (details: AddressDetail) => void;
  addressText: string;
  initialData?: Partial<AddressDetail>;
  coordinates?: { lat?: number; lng?: number };
}

export default function AddressDetailsModal({
  isOpen,
  onClose,
  onConfirm,
  addressText,
  initialData,
  coordinates,
}: AddressDetailsModalProps) {
  const [contactName, setContactName] = useState(initialData?.contactName || "");
  const [phone, setPhone] = useState(initialData?.phone || "");
  const [unit, setUnit] = useState(initialData?.unit || "");

  useEffect(() => {
    if (isOpen) {
      // Reset form when modal opens
      setContactName(initialData?.contactName || "");
      setPhone(initialData?.phone || "");
      setUnit(initialData?.unit || "");
    }
  }, [isOpen, initialData]);

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
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-[100] animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal - Desktop centered */}
      <div className="hidden lg:flex fixed inset-0 z-[110] items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md pointer-events-auto
                     animate-in fade-in zoom-in-95 duration-200 ease-out"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-6 pb-4">
            <h2 className="text-lg font-semibold text-gray-900">填写地址详情</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-150"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="px-6 pb-6 space-y-4">
            {/* Selected Address (read-only) */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                选择的地址
              </label>
              <div className="px-3.5 py-2.5 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-sm text-gray-700">{addressText}</p>
              </div>
            </div>

            {/* Contact Name */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">
                收货人姓名
              </label>
              <input
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="请输入收货人姓名"
                className="w-full h-11 px-3.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400
                           transition-all duration-200 ease-out
                           hover:border-gray-300
                           focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">
                电话号码
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="请输入电话号码"
                className="w-full h-11 px-3.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400
                           transition-all duration-200 ease-out
                           hover:border-gray-300
                           focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>

            {/* Unit (optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">
                门牌号
              </label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="例如：3楼A室"
                className="w-full h-11 px-3.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400
                           transition-all duration-200 ease-out
                           hover:border-gray-300
                           focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 px-6 pb-6">
            <button
              onClick={onClose}
              className="flex-1 h-11 px-4 rounded-lg border border-gray-200 text-sm font-medium text-gray-700
                         hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150"
            >
              取消
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 h-11 px-4 rounded-lg text-sm font-semibold text-white bg-blue-600
                         hover:bg-blue-700 active:bg-blue-800 transition-all duration-150 ease-out"
            >
              确认
            </button>
          </div>
        </div>
      </div>

      {/* Modal - Mobile bottom drawer */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[110] bg-white rounded-t-2xl shadow-2xl max-h-[85vh] flex flex-col
                      animate-in slide-in-from-bottom duration-300 ease-out">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2 flex-shrink-0">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-4 pb-3 border-b border-gray-100 flex-shrink-0">
          <h3 className="text-base font-semibold text-gray-900">填写地址详情</h3>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {/* Selected Address */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              选择的地址
            </label>
            <div className="px-3 py-2.5 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-sm text-gray-700">{addressText}</p>
            </div>
          </div>

          {/* Contact Name */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1.5">
              收货人姓名
            </label>
            <input
              type="text"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="请输入收货人姓名"
              className="w-full h-12 px-3.5 rounded-lg border border-gray-200 bg-white text-base text-gray-900 placeholder:text-gray-400
                         transition-all duration-200 ease-out
                         focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1.5">
              电话号码
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="请输入电话号码"
              className="w-full h-12 px-3.5 rounded-lg border border-gray-200 bg-white text-base text-gray-900 placeholder:text-gray-400
                         transition-all duration-200 ease-out
                         focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            />
          </div>

          {/* Unit */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1.5">
              门牌号
            </label>
            <input
              type="text"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              placeholder="例如：3楼A室"
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
    </>
  );
}
