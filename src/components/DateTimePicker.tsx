"use client";

import { DatePicker, Button } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import zhCN from "antd/locale/zh_CN";
import { useState } from "react";

dayjs.extend(utc);
dayjs.extend(timezone);

interface DateTimePickerProps {
  value: string;
  onChange: (value: string) => void;
}

const BANGKOK_TZ = "Asia/Bangkok";

export default function DateTimePicker({ value, onChange }: DateTimePickerProps) {
  const [open, setOpen] = useState(false);

  const handleChange = (date: Dayjs | null) => {
    if (date) {
      // 将用户选择的时间解释为曼谷时间（忽略用户本地时区）
      const bangkokTime = dayjs.tz(
        date.format("YYYY-MM-DD HH:mm"),
        BANGKOK_TZ
      );
      onChange(bangkokTime.toISOString());
      setOpen(false);
    }
  };

  const handleNow = () => {
    onChange("");
    setOpen(false);
  };

  // 将存储的 ISO 时间转换为曼谷时区显示
  const dayjsValue = value ? dayjs(value).tz(BANGKOK_TZ) : null;

  // 自定义显示文本
  const displayText = value
    ? dayjs(value).tz(BANGKOK_TZ).format("YYYY-MM-DD HH:mm")
    : "立即用车";

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-900 mb-3">
        用车时间 <span className="text-gray-500 font-normal">(曼谷时间 GMT+7)</span>
      </label>

      <div className="relative">
        {/* 自定义显示输入框 */}
        <div
          onClick={() => setOpen(true)}
          className="w-full h-11 px-3.5 rounded-lg border border-gray-200 bg-white
                   flex items-center justify-between text-sm text-gray-900
                   hover:border-blue-400 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100
                   transition-all cursor-pointer"
        >
          <span className={value ? "" : ""}>{displayText}</span>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>

        {/* 隐藏的 DatePicker */}
        <DatePicker
          open={open}
          onOpenChange={setOpen}
          value={dayjsValue}
          onChange={handleChange}
          showTime={{
            format: "HH:mm",
            minuteStep: 15,
          }}
          format="YYYY-MM-DD HH:mm"
          locale={zhCN.DatePicker}
          className="absolute opacity-0 pointer-events-none h-0 overflow-hidden"
          style={{ height: 0, margin: 0, padding: 0 }}
          getPopupContainer={(trigger) => trigger.parentElement!}
          disabledDate={(current) => {
            // 禁用曼谷时区今天之前的日期
            const bangkokToday = dayjs().tz(BANGKOK_TZ).startOf('day');
            return current && current < bangkokToday;
          }}
          renderExtraFooter={() => (
            <div className="border-t pt-3 mt-2">
              <Button
                type="primary"
                block
                size="large"
                onClick={handleNow}
              >
                立即用车
              </Button>
            </div>
          )}
        />
      </div>
    </div>
  );
}
