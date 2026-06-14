"use client";

import { DatePicker } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import enUS from "antd/locale/en_US";
import { useT } from "@/hooks/useT";

dayjs.extend(utc);
dayjs.extend(timezone);

interface DateTimePickerProps {
  value: string;
  onChange: (value: string) => void;
}

const BANGKOK_TZ = "Asia/Bangkok";

export default function DateTimePicker({ value, onChange }: DateTimePickerProps) {
  const t = useT();

  const handleChange = (date: Dayjs | null) => {
    if (date) {
      const bangkokTime = dayjs.tz(date.format("YYYY-MM-DD HH:mm"), BANGKOK_TZ);
      onChange(bangkokTime.toISOString());
    }
  };

  const dayjsValue = value
    ? dayjs(value).tz(BANGKOK_TZ)
    : dayjs().tz(BANGKOK_TZ);

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-900 mb-3">
        {t.dateTime.label} <span className="text-gray-500 font-normal">({t.dateTime.timezone})</span>
      </label>

      <DatePicker
        value={dayjsValue}
        onChange={handleChange}
        showTime={{
          format: "HH:mm",
          minuteStep: 15,
        }}
        format="YYYY-MM-DD HH:mm"
        locale={enUS.DatePicker}
        className="w-full h-11"
        disabledDate={(current) => {
          const bangkokToday = dayjs().tz(BANGKOK_TZ).startOf("day");
          return current && current < bangkokToday;
        }}
      />
    </div>
  );
}
