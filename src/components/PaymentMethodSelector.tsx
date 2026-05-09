"use client";

import { useT } from "@/hooks/useT";
import { mockWalletBalance } from "@/data/mockData";

export default function PaymentMethodSelector() {
  const t = useT();
  const balance = mockWalletBalance.balance;

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-900 mb-3">
        {t.payment.label}
      </label>
      <div className="border border-blue-200 rounded-lg p-4 bg-blue-50/30">
        <div className="flex items-start gap-3">
          <div className="w-4 h-4 rounded-full border-2 border-blue-500 flex-shrink-0 mt-0.5
                        flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">{t.payment.creditAccount}</p>
            <p className="text-xs text-gray-500 mb-1.5">{t.payment.creditAccountDesc}</p>
            <p className="text-sm text-gray-700 mb-2">
              {t.payment.balance} <span className="font-price font-semibold text-gray-900">฿{balance.toLocaleString('th-TH', { maximumFractionDigits: 0 })}</span>
            </p>
            <p className="text-xs text-gray-500 leading-relaxed">
              {t.payment.rateNote}
            </p>
          </div>
          <div className="text-xs text-gray-500 bg-white border border-gray-200 px-2 py-1 rounded flex-shrink-0">
            {t.payment.default}
          </div>
        </div>
      </div>
    </div>
  );
}
