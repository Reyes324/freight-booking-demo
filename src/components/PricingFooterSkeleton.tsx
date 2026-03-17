"use client";

export default function PricingFooterSkeleton() {
  return (
    <div
      className="bg-white flex flex-col gap-3 items-start justify-center p-4 animate-pulse"
      style={{
        boxShadow:
          "0px -3px 6px 0px rgba(0,0,0,0.06), 0px -6px 16px 0px rgba(0,0,0,0.04), 0px -9px 28px 0px rgba(0,0,0,0.02)",
      }}
    >
      {/* 价格选项骨架 */}
      <div className="flex gap-2 w-full">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="flex-1 flex flex-col gap-6 items-start justify-center p-4 rounded-md border border-gray-200 bg-gray-50"
          >
            {/* 标题区域骨架 */}
            <div className="flex flex-col items-start gap-1.5 w-full">
              <div className="h-4 bg-gray-200 rounded w-20" />
              <div className="h-3 bg-gray-200 rounded w-28" />
            </div>

            {/* 价格区域骨架 */}
            <div className="flex gap-2 items-end">
              <div className="h-6 bg-gray-200 rounded w-24" />
            </div>
          </div>
        ))}
      </div>

      {/* 下一步按钮骨架 */}
      <div className="w-full h-[54px] bg-gray-200 rounded-lg" />
    </div>
  );
}
