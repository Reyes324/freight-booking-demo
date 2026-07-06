'use client';

import Link from 'next/link';
import { useT } from '@/hooks/useT';
import {
  mockWalletBalance,
  mockParentQuota,
  mockSubAccounts,
  type SubAccount,
} from '@/data/mockData';

interface BalanceSummaryCardProps {
  childAccount?: SubAccount;
  isParent: boolean;
  isChild: boolean;
  /** 提供时，卡片顶部会显示一个「明细 >」跳转链接（我的页用），不提供则不显示（钱包页本身即明细） */
  detailHref?: string;
}

export default function BalanceSummaryCard({
  childAccount,
  isParent,
  isChild,
  detailHref,
}: BalanceSummaryCardProps) {
  const t = useT();

  let label: string;
  let current: number;
  let total: number;
  let note: string;

  if (isChild && childAccount) {
    label = t.wallet.subBalanceLabel;
    current = childAccount.balance;
    total = childAccount.quota;
    note = t.wallet.subQuotaNote;
  } else if (isParent) {
    label = t.wallet.parentTotalLabel;
    current =
      mockParentQuota.total -
      mockParentQuota.allocated +
      mockSubAccounts.reduce((s, a) => s + a.balance, 0);
    total = mockParentQuota.total;
    note = t.wallet.rateNote;
  } else {
    label = t.wallet.balanceLabel;
    current = mockWalletBalance.balance;
    total = mockWalletBalance.creditLimit;
    note = t.wallet.rateNote;
  }

  return (
    <div className="border border-gray-200 rounded-[8px] lg:rounded-xl p-4 lg:p-6 bg-white">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-gray-500">{label}</p>
        {detailHref && (
          <Link
            href={detailHref}
            className="flex items-center gap-0.5 text-sm text-[#2257D4] hover:text-[#1C47AC] transition-colors cursor-pointer"
          >
            {t.mine.balanceDetail}
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </div>
      <p className="text-2xl lg:text-4xl font-bold text-gray-900 whitespace-nowrap">
        CNY {current.toLocaleString('zh-CN')}
        <span className="text-sm lg:text-lg font-normal text-gray-400"> / CNY {total.toLocaleString('zh-CN')}</span>
      </p>
      <p className="text-xs text-gray-500 mt-3 leading-relaxed">{note}</p>
    </div>
  );
}
