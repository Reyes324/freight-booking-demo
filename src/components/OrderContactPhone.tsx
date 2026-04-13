"use client";

import { useState, useRef, useEffect } from "react";

interface OrderContactPhoneProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

// 国家区号列表
const COUNTRY_CODES = [
  { code: "+66", flag: "🇹🇭", country: "泰国" },
  { code: "+84", flag: "🇻🇳", country: "越南" },
  { code: "+60", flag: "🇲🇾", country: "马来西亚" },
  { code: "+62", flag: "🇮🇩", country: "印尼" },
];

export default function OrderContactPhone({ value, onChange, error }: OrderContactPhoneProps) {
  const [selectedCode, setSelectedCode] = useState("+66");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // 初始化时解析 value
  useEffect(() => {
    if (value) {
      const matchedCode = COUNTRY_CODES.find(c => value.startsWith(c.code));
      if (matchedCode) {
        setSelectedCode(matchedCode.code);
        setPhoneNumber(value.substring(matchedCode.code.length).trim());
      } else {
        setPhoneNumber(value);
      }
    }
  }, []);

  const handleCodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCode = e.target.value;
    setSelectedCode(newCode);
    const fullNumber = phoneNumber ? `${newCode} ${phoneNumber}` : "";
    onChange(fullNumber);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPhone = e.target.value;
    setPhoneNumber(newPhone);
    const fullNumber = newPhone ? `${selectedCode} ${newPhone}` : "";
    onChange(fullNumber);
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-900 mb-3">订单联系电话</label>

      <div className={`w-full h-11 rounded-lg border bg-white flex items-center overflow-hidden transition-all ${
        error
          ? 'border-red-500'
          : isFocused
            ? 'border-blue-500 ring-2 ring-blue-500/20'
            : 'border-gray-200 hover:border-gray-300'
      }`}>
        {/* 区号选择器 - 始终可见可选 */}
        <div className="relative flex items-center border-r border-gray-200 px-2">
          <select
            value={selectedCode}
            onChange={handleCodeChange}
            className="appearance-none bg-transparent text-sm text-gray-900 pr-5 pl-1 outline-none cursor-pointer"
            style={{ minWidth: "85px" }}
          >
            {COUNTRY_CODES.map((item) => (
              <option key={item.code} value={item.code}>
                {item.flag} {item.code}
              </option>
            ))}
          </select>
          <svg className="absolute right-2 w-3 h-3 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* 电话号码输入 - 始终可输入 */}
        <input
          ref={inputRef}
          type="tel"
          value={phoneNumber}
          onChange={handlePhoneChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="flex-1 h-full text-sm text-gray-900 outline-none bg-transparent px-3"
          placeholder="812345678"
        />
      </div>

      {/* 错误提示 */}
      {error && (
        <p className="mt-1.5 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}
