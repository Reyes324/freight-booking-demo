"use client";

import { DatePicker } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import locale from "antd/locale/zh_CN";
import { useState } from "react";
import "@/styles/datepicker-override.css";

interface DateTimePickerProps {
  value: string;
  onChange: (value: string) => void;
}

export default function DateTimePicker({ value, onChange }: DateTimePickerProps) {
  const [open, setOpen] = useState(false);

  const formatDateTime = (isoString: string) => {
    if (!isoString) return "现在用车";
    const date = dayjs(isoString);
    const month = date.month() + 1;
    const day = date.date();
    const hours = date.hour().toString().padStart(2, "0");
    const minutes = date.minute().toString().padStart(2, "0");
    return `${month}月${day}日 ${hours}:${minutes}`;
  };

  const handleChange = (date: Dayjs | null) => {
    if (date) {
      onChange(date.toISOString());
    } else {
      onChange("");
    }
    setOpen(false);
  };

  const handleNow = () => {
    onChange("");
    setOpen(false);
  };

  const dayjsValue = value ? dayjs(value) : null;

  return (
    <div className="relative">
      <label className="block text-sm text-gray-700 mb-1.5">用车时间</label>

      {/* 自定义触发按钮 */}
      <div
        onClick={() => setOpen(!open)}
        className="w-full h-11 px-3.5 rounded-lg border border-gray-200 bg-white
                 flex items-center justify-between text-sm text-gray-900
                 hover:border-gray-300 transition-colors cursor-pointer"
      >
        <span>{formatDateTime(value)}</span>
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Ant Design DatePicker */}
      <DatePicker
        value={dayjsValue}
        onChange={handleChange}
        showTime={{
          format: "HH:mm",
          minuteStep: 15,
        }}
        format="YYYY-MM-DD HH:mm"
        locale={locale.DatePicker}
        open={open}
        onOpenChange={setOpen}
        placement="bottomLeft"
        className="!absolute !top-full !left-0 !mt-2 !opacity-0 !pointer-events-none"
        popupClassName="datetime-picker-popup"
        style={{ width: 0, height: 0 }}
        renderExtraFooter={() => (
          <div className="border-t border-gray-100 pt-2 mt-2">
            <button
              onClick={handleNow}
              className="w-full h-9 px-4 rounded-lg border-2 border-blue-600 bg-blue-50
                       text-blue-600 font-medium text-sm hover:bg-blue-100
                       transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
              现在用车
            </button>
          </div>
        )}
        disabledDate={(current) => {
          // 禁用今天之前的日期
          return current && current < dayjs().startOf('day');
        }}
      />

    </div>
  );
}
