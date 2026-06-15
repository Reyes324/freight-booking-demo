'use client';

import { useEffect, useState } from 'react';
import { Table, DatePicker, Empty, Select, Button } from 'antd';
import { CalendarOutlined, DownloadOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import type { ColumnsType } from 'antd/es/table';
import dayjs, { Dayjs } from 'dayjs';
import Navbar from '@/components/Navbar';
import {
  mockWalletBalance,
  mockTransactions,
  mockSubAccounts,
  mockParentQuota,
  getCurrentAccount,
  type Transaction,
  type CurrentAccount,
  type SubAccount,
} from '@/data/mockData';
import { useT } from '@/hooks/useT';

const { RangePicker } = DatePicker;

export default function WalletPage() {
  const t = useT();
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
    dayjs().subtract(30, 'day'),
    dayjs(),
  ]);
  const [subTxnFilter, setSubTxnFilter] = useState<string | null>(null);

  // 当前账号（挂载后读取，避免 SSR/CSR 不一致）
  const [account, setAccount] = useState<CurrentAccount | null>(null);
  useEffect(() => {
    setAccount(getCurrentAccount());
  }, []);

  const isParent = account?.accountType === 'parent';
  const isChild = account?.accountType === 'child';

  // 子账号：从 mock 中找到本账号的额度与余额
  const childAccount: SubAccount | undefined = isChild
    ? mockSubAccounts.find((s) => s.id === account?.accountId)
    : undefined;

  // 子账号名查表
  const subName = (id: string) =>
    mockSubAccounts.find((s) => s.id === id)?.name ?? id;

  // 交易记录过滤（日期 + 账号筛选）
  const filteredTransactions = mockTransactions.filter((tx) => {
    const txDate = dayjs(tx.date);
    if (!txDate.isAfter(dateRange[0]) || !txDate.isBefore(dateRange[1].add(1, 'day'))) return false;
    if (isParent && subTxnFilter) {
      if (subTxnFilter === '__parent__') return !tx.subAccountId;
      return tx.subAccountId === subTxnFilter;
    }
    if (isChild) return tx.subAccountId === account?.accountId;
    return true;
  });

  // 表格列定义
  const columns: ColumnsType<Transaction> = [
    // 母账号：账号名称列置首
    ...(isParent
      ? [
          {
            title: '账号名称',
            key: 'subAccount',
            width: 140,
            render: (_: unknown, record: Transaction) => (
              <span className="text-sm text-gray-900">
                {record.subAccountId ? subName(record.subAccountId) : (account?.companyName ?? '主账号')}
              </span>
            ),
          } as ColumnsType<Transaction>[number],
        ]
      : []),
    {
      title: t.wallet.date,
      dataIndex: 'date',
      key: 'date',
      width: 180,
      render: (date: Date) => dayjs(date).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: t.wallet.orderId,
      dataIndex: 'orderId',
      key: 'orderId',
      width: 200,
      render: (orderId?: string) => (
        <span className="text-sm text-gray-900">{orderId || '-'}</span>
      ),
    },
    {
      title: t.wallet.description,
      dataIndex: 'description',
      key: 'description',
      width: 150,
    },
    {
      title: t.wallet.amount,
      dataIndex: 'amount',
      key: 'amount',
      width: 220,
      align: 'right',
      render: (amount: number) => {
        const thbAmount = Math.abs(amount);
        const exchangeRate = 5.0;
        const cnyAmount = thbAmount / exchangeRate;
        return (
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900">
              {amount > 0 ? '+' : '-'}฿{thbAmount.toFixed(0)}
            </div>
            <div className="text-xs text-gray-400">≈ CNY {cnyAmount.toFixed(2)}</div>
          </div>
        );
      },
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="p-6">
        {/* 账期余额 */}
        <h1 className="text-lg font-semibold text-gray-900 mb-4">{t.wallet.title}</h1>

        {isChild && childAccount ? (
          /* 子账号：本账号分配额度和余额 */
          <div className="border border-gray-200 rounded-xl p-6 bg-white mb-6">
            <p className="text-sm text-gray-500 mb-2">{t.wallet.subBalanceLabel}</p>
            <p className="text-4xl font-bold text-gray-900">
              CNY {childAccount.balance.toLocaleString('zh-CN')}
              <span className="text-lg font-normal text-gray-400"> / CNY {childAccount.quota.toLocaleString('zh-CN')}</span>
            </p>
            <p className="text-xs text-gray-500 mt-3 leading-relaxed">
              {t.wallet.subQuotaNote}
            </p>
          </div>
        ) : isParent ? (
          /* 母账号：企业总额度（不展示子账号分布） */
          <div className="border border-gray-200 rounded-xl p-6 bg-white mb-6">
            <p className="text-sm text-gray-500 mb-2">{t.wallet.parentTotalLabel}</p>
            <p className="text-4xl font-bold text-gray-900">
              CNY {(mockParentQuota.total - mockParentQuota.allocated + mockSubAccounts.reduce((s, a) => s + a.balance, 0)).toLocaleString('zh-CN')}
              <span className="text-lg font-normal text-gray-400"> / CNY {mockParentQuota.total.toLocaleString('zh-CN')}</span>
            </p>
            <p className="text-xs text-gray-500 mt-3 leading-relaxed">
              {t.wallet.rateNote}
            </p>
          </div>
        ) : (
          /* 普通账号 */
          <div className="border border-gray-200 rounded-xl p-6 bg-white mb-6">
            <p className="text-sm text-gray-500 mb-2">{t.wallet.balanceLabel}</p>
            <p className="text-4xl font-bold text-gray-900">
              CNY {mockWalletBalance.balance.toLocaleString('zh-CN')}
              <span className="text-lg font-normal text-gray-400"> / CNY {mockWalletBalance.creditLimit.toLocaleString('zh-CN')}</span>
            </p>
            <p className="text-xs text-gray-500 mt-3 leading-relaxed">
              {t.wallet.rateNote}
            </p>
          </div>
        )}

        {/* 交易明细 */}
        <div className="space-y-4">
          {/* 标题栏 + 筛选 */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h2 className="text-lg font-semibold text-gray-900">{t.wallet.transactions}</h2>
            <div className="flex items-center gap-3">
              {isParent && (
                <Select
                  placeholder="全部账号"
                  allowClear
                  value={subTxnFilter}
                  onChange={setSubTxnFilter}
                  style={{ width: 160 }}
                  options={[
                    { value: '__parent__', label: '母账号' },
                    ...mockSubAccounts.map((s) => ({ value: s.id, label: s.name })),
                  ]}
                />
              )}
              <RangePicker
                value={dateRange}
                onChange={(dates) => {
                  if (dates && dates[0] && dates[1]) {
                    setDateRange([dates[0], dates[1]]);
                  }
                }}
                format="YYYY-MM-DD"
                suffixIcon={<CalendarOutlined />}
              />
              <Button
                icon={<DownloadOutlined />}
                onClick={() => {
                  const rows = filteredTransactions.map((tx) => ({
                    '日期': dayjs(tx.date).format('YYYY-MM-DD HH:mm'),
                    '订单号': tx.orderId || '-',
                    '类型': tx.description,
                    '金额': `${tx.amount > 0 ? '+' : '-'}฿${Math.abs(tx.amount).toFixed(0)}`,
                    '金额(CNY)': (Math.abs(tx.amount) / 5).toFixed(2),
                    ...(isParent ? { '账号名称': tx.subAccountId ? subName(tx.subAccountId) : (account?.companyName ?? '') } : {}),
                  }));
                  const ws = XLSX.utils.json_to_sheet(rows);
                  const wb = XLSX.utils.book_new();
                  XLSX.utils.book_append_sheet(wb, ws, '交易明细');
                  XLSX.writeFile(wb, `交易明细_${dayjs().format('YYYYMMDD')}.xlsx`);
                }}
              >
                导出 Excel
              </Button>
            </div>
          </div>

          {/* 表格 */}
          <div className="bg-white rounded-xl border border-gray-200" data-ds="Table" data-ds-label="交易记录">
            <Table
              columns={columns}
              dataSource={filteredTransactions}
              rowKey="id"
              pagination={{
                pageSize: 15,
                showSizeChanger: false,
                showTotal: (total) => t.wallet.totalTransactions(total),
              }}
              locale={{
                emptyText: (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={t.wallet.noTransactions}
                  />
                ),
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
