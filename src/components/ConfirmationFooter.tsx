"use client";

interface ConfirmationFooterProps {
  totalPrice: number;
  onConfirm: () => void;
  isSubmitting: boolean;
}

export default function ConfirmationFooter({
  totalPrice,
  onConfirm,
  isSubmitting,
}: ConfirmationFooterProps) {
  return (
    <div
      className="absolute bottom-0 left-0 right-0 z-50 bg-white p-4"
      style={{
        boxShadow:
          "0px -3px 6px 0px rgba(0,0,0,0.06), 0px -6px 16px 0px rgba(0,0,0,0.04), 0px -9px 28px 0px rgba(0,0,0,0.02)",
      }}
    >
      <div className="flex items-center gap-4">
        {/* 总价显示 */}
        <div className="flex-1">
          <p className="text-xs text-gray-500">总价</p>
          <p className="font-price text-2xl font-bold text-gray-900">
            ฿{totalPrice.toFixed(0)}
          </p>
        </div>

        {/* 确认叫车按钮 */}
        <button
          onClick={onConfirm}
          disabled={isSubmitting}
          className="h-[54px] px-8 rounded-lg bg-blue-600 hover:bg-blue-700
                   active:bg-blue-800 text-white text-base font-semibold
                   flex items-center gap-2 transition-all duration-200
                   disabled:opacity-50 disabled:cursor-not-allowed
                   hover:shadow-lg active:scale-[0.98] cursor-pointer"
        >
          <span>{isSubmitting ? '提交中...' : '确认叫车'}</span>
          {!isSubmitting && (
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
