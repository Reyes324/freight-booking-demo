"use client";

import { useState, useMemo } from "react";

interface DateTimePickerProps {
  value: string;
  onChange: (value: string) => void;
}

export default function DateTimePicker({ value, onChange }: DateTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempDate, setTempDate] = useState<Date | null>(null);
  const [selectedHour, setSelectedHour] = useState(new Date().getHours());
  const [selectedMinute, setSelectedMinute] = useState(0);

  const formatDateTime = (isoString: string) => {
    if (!isoString) return "现在用车";
    const date = new Date(isoString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${month}月${day}日 ${hours}:${minutes}`;
  };

  // 生成未来14天的日期
  const dateOptions = useMemo(() => {
    const dates = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  }, []);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = [0, 15, 30, 45];

  const handleOpen = () => {
    setIsOpen(true);
    if (value) {
      const date = new Date(value);
      setTempDate(date);
      setSelectedHour(date.getHours());
      setSelectedMinute(date.getMinutes());
    } else {
      setTempDate(null);
    }
  };

  const handleNow = () => {
    onChange("");
    setIsOpen(false);
  };

  const handleConfirm = () => {
    if (!tempDate) {
      onChange("");
    } else {
      const finalDate = new Date(tempDate);
      finalDate.setHours(selectedHour, selectedMinute, 0, 0);
      onChange(finalDate.toISOString().slice(0, 16));
    }
    setIsOpen(false);
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date.getTime() === today.getTime()) return "今天";
    if (date.getTime() === tomorrow.getTime()) return "明天";

    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}月${day}日`;
  };

  return (
    <div className="relative">
      <label className="block text-sm text-gray-700 mb-1.5">用车时间</label>

      {/* 选择框 */}
      <button
        type="button"
        onClick={handleOpen}
        className="w-full h-11 px-3.5 rounded-lg border border-gray-200 bg-white
                 flex items-center justify-between text-sm text-gray-900
                 hover:border-gray-300 transition-colors cursor-pointer"
      >
        <span>{formatDateTime(value)}</span>
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* 弹窗 */}
      {isOpen && (
        <>
          {/* 遮罩 (点击关闭) */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* 弹窗内容 - 下拉式 */}
          <div className="absolute top-full left-0 right-0 mt-2 z-50">
            <div
              className="bg-white rounded-xl w-full max-h-[70vh] overflow-hidden
                         animate-in fade-in slide-in-from-top-2 duration-200
                         flex flex-col shadow-xl border border-gray-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 标题 */}
              <div className="px-4 py-2.5 border-b border-gray-100">
                <h3 className="text-base font-semibold text-gray-900">选择用车时间</h3>
              </div>

              {/* 内容区 */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* 现在用车快捷按钮 */}
                <button
                  onClick={handleNow}
                  className="w-full h-11 px-4 rounded-lg border-2 border-blue-600 bg-blue-50
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

                {/* 日期选择 */}
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-2">选择日期</p>
                  <div className="grid grid-cols-4 gap-2">
                    {dateOptions.map((date) => {
                      const isSelected =
                        tempDate && date.getTime() === new Date(tempDate.setHours(0, 0, 0, 0)).getTime();
                      return (
                        <button
                          key={date.getTime()}
                          onClick={() => setTempDate(new Date(date))}
                          className={`h-11 rounded-lg border text-sm font-medium transition-all cursor-pointer ${
                            isSelected
                              ? "border-blue-600 bg-blue-50 text-blue-600"
                              : "border-gray-200 bg-white text-gray-900 hover:border-gray-300"
                          }`}
                        >
                          {formatDate(date)}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 时间选择 */}
                {tempDate && (
                  <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* 小时选择 */}
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-2">小时</p>
                      <div className="grid grid-cols-6 gap-2">
                        {hours.map((hour) => (
                          <button
                            key={hour}
                            onClick={() => setSelectedHour(hour)}
                            className={`h-9 rounded-lg border text-sm transition-all cursor-pointer ${
                              selectedHour === hour
                                ? "border-blue-600 bg-blue-50 text-blue-600 font-medium"
                                : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                            }`}
                          >
                            {hour.toString().padStart(2, "0")}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 分钟选择 */}
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-2">分钟</p>
                      <div className="grid grid-cols-4 gap-2">
                        {minutes.map((minute) => (
                          <button
                            key={minute}
                            onClick={() => setSelectedMinute(minute)}
                            className={`h-9 rounded-lg border text-sm transition-all cursor-pointer ${
                              selectedMinute === minute
                                ? "border-blue-600 bg-blue-50 text-blue-600 font-medium"
                                : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                            }`}
                          >
                            {minute.toString().padStart(2, "0")}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 底部按钮 */}
              <div className="p-4 border-t border-gray-100 flex gap-3">
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex-1 h-11 rounded-lg border border-gray-200 text-gray-700
                           font-medium text-sm hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  取消
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={tempDate === null}
                  className="flex-1 h-11 rounded-lg bg-blue-600 text-white font-medium text-sm
                           hover:bg-blue-700 active:bg-blue-800 transition-colors cursor-pointer
                           disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  确认
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
