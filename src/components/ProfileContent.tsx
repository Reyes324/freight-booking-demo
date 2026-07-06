'use client';

import { useState } from 'react';
import ChangePasswordModal from './ChangePasswordModal';
import MobileListGroup from './MobileListGroup';
import MobileListRow from './MobileListRow';
import { enterprises } from '@/data/adminMockData';
import type { CurrentAccount } from '@/data/mockData';

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center py-4 border-b border-gray-100 last:border-0">
      <span className="w-32 text-sm text-gray-500 shrink-0">{label}</span>
      <div className="flex-1 text-sm text-gray-900">{children}</div>
    </div>
  );
}

export default function ProfileContent({ account }: { account: CurrentAccount }) {
  const [pwdOpen, setPwdOpen] = useState(false);

  const enterprise = enterprises.find((e) => e.id === account.accountId);
  const phone = enterprise ? `${enterprise.countryCode} ${enterprise.phone}` : '—';

  return (
    <div>
      <h2 className="hidden lg:block text-lg font-semibold text-gray-900 mb-6">账户资料</h2>

      {/* 桌面端 */}
      <div className="hidden lg:block">
        <Row label="企业名称">{account.companyName}</Row>
        <Row label="登录手机号">{phone}</Row>
        <Row label="密码">
          <button
            onClick={() => setPwdOpen(true)}
            className="text-sm text-[#2257D4] hover:text-[#1C47AC] transition-colors cursor-pointer"
          >
            修改密码
          </button>
        </Row>
      </div>

      {/* 移动端 */}
      <div className="lg:hidden">
        <MobileListGroup>
          <MobileListRow label="企业名称" value={account.companyName} />
          <MobileListRow label="登录手机号" value={phone} />
          <MobileListRow
            label="密码"
            value={<span className="text-[#2257D4]">修改密码</span>}
            onClick={() => setPwdOpen(true)}
            hideChevron
          />
        </MobileListGroup>
      </div>

      <ChangePasswordModal open={pwdOpen} onClose={() => setPwdOpen(false)} />
    </div>
  );
}
