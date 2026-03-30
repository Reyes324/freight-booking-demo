"use client";

export default function PaymentMethodSelector() {
  // Mock 余额数据（统一以人民币显示）
  const balance = 46000.00;

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-900 mb-3">
        支付方式
      </label>
      <div className="border border-blue-200 rounded-lg p-4 bg-blue-50/30">
        <div className="flex items-start gap-3">
          <div className="w-4 h-4 rounded-full border-2 border-blue-500 flex-shrink-0 mt-0.5
                        flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">账期支付</p>
            <p className="text-xs text-gray-500 mb-1.5">企业账期结算</p>
            <p className="text-sm text-gray-700 mb-2">
              余额: <span className="font-price font-semibold text-gray-900">CNY {balance.toLocaleString('zh-CN')}</span>
            </p>
            <p className="text-xs text-gray-500 leading-relaxed">
              当月订单按每日参考汇率估算扣减，实际金额以月末挂牌汇率结算为准
            </p>
          </div>
          <div className="text-xs text-gray-500 bg-white border border-gray-200 px-2 py-1 rounded flex-shrink-0">
            默认
          </div>
        </div>
      </div>
    </div>
  );
}
