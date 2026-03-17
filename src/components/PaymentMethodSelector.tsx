"use client";

export default function PaymentMethodSelector() {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-900 mb-1.5">
        支付方式
      </label>
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50/50">
        <div className="flex items-center gap-3 opacity-60">
          <div className="w-4 h-4 rounded-full border-2 border-gray-400 flex-shrink-0
                        flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-gray-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">账期支付</p>
            <p className="text-xs text-gray-500">企业账期结算</p>
          </div>
          <div className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded flex-shrink-0">
            默认
          </div>
        </div>
      </div>
    </div>
  );
}
