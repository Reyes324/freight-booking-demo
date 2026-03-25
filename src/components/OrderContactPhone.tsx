"use client";

import { useState, useRef, useEffect } from "react";

interface OrderContactPhoneProps {
  value: string;
  onChange: (value: string) => void;
}

export default function OrderContactPhone({ value, onChange }: OrderContactPhoneProps) {
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      // 将光标移到末尾
      const len = inputRef.current.value.length;
      inputRef.current.setSelectionRange(len, len);
    }
  }, [isEditing]);

  const handleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      setIsEditing(false);
    }
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-900 mb-3">订单联系电话</label>

      {isEditing ? (
        <div className="w-full h-11 rounded-lg border border-blue-500 bg-white flex items-center overflow-hidden ring-2 ring-blue-500/20">
          <input
            ref={inputRef}
            type="tel"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="flex-1 h-full text-sm text-gray-900 outline-none bg-transparent px-3.5"
            placeholder="+66 xxxxxxxxx"
          />
        </div>
      ) : (
        <div
          onClick={handleClick}
          className="w-full h-11 px-3.5 rounded-lg border border-gray-200 bg-white
                   flex items-center gap-2.5 text-sm text-gray-900
                   hover:border-gray-300 transition-colors cursor-pointer"
        >
          <span className={value ? "text-gray-900" : "text-gray-400"}>
            {value || "+66 xxxxxxxxx"}
          </span>
          <svg className="w-4 h-4 text-gray-400 ml-auto flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </div>
      )}
    </div>
  );
}
