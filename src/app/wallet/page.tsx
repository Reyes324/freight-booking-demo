'use client';

import { useState } from 'react';
import { Table, DatePicker, Tag, Empty } from 'antd';
import { CalendarOutlined, LeftOutlined, RightOutlined, PlusCircleOutlined, MinusCircleOutlined, RollbackOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs, { Dayjs } from 'dayjs';
import Navbar from '@/components/Navbar';
import { mockWalletBalance, mockTransactions, type Transaction, type TransactionType } from '@/data/mockData';

const { RangePicker } = DatePicker;

// 交易类型配置
const transactionTypeConfig: Record<TransactionType, { label: string; color: string; icon: React.ReactNode }> = {
  topup: {
    label: '充值',
    color: 'blue',
    icon: <PlusCircleOutlined />,
  },
  payment: {
    label: '支付',
    color: 'orange',
    icon: <MinusCircleOutlined />,
  },
  refund: {
    label: '退款',
    color: 'green',
    icon: <RollbackOutlined />,
  },
};

export default function WalletPage() {
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
    dayjs().subtract(30, 'day'),
    dayjs(),
  ]);

  // 根据日期筛选交易记录
  const filteredTransactions = mockTransactions.filter((transaction) => {
    const transactionDate = dayjs(transaction.date);
    return transactionDate.isAfter(dateRange[0]) && transactionDate.isBefore(dateRange[1].add(1, 'day'));
  });

  // 表格列定义
  const columns: ColumnsType<Transaction> = [
    {
      title: '交易类型',
      dataIndex: 'type',
      key: 'type',
      width: 150,
      render: (type: TransactionType) => {
        const config = transactionTypeConfig[type];
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.label}
          </Tag>
        );
      },
    },
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      width: 180,
      render: (date: Date) => dayjs(date).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '订单编号',
      dataIndex: 'orderId',
      key: 'orderId',
      width: 200,
      render: (orderId?: string) => (
        <span className="text-sm text-gray-900 font-mono">
          {orderId || '-'}
        </span>
      ),
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 150,
      align: 'right',
      render: (amount: number) => (
        <div className="text-right">
          <span
            className={`text-sm font-medium ${
              amount > 0 ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {amount > 0 ? '+' : ''}HK$ {Math.abs(amount).toFixed(2)}
          </span>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="p-6">
        {/* 账期余额 */}
        <h1 className="text-lg font-semibold text-gray-900 mb-4">账期余额</h1>
        <div className="border border-gray-200 rounded-xl p-6 bg-white mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-2">余额</p>
              <p className="text-4xl font-bold text-gray-900">
                HK$ {mockWalletBalance.balance.toFixed(2)}
              </p>
            </div>
            <button
              className="h-11 px-6 rounded-lg bg-blue-600 text-white font-medium text-sm
                       hover:bg-blue-700 active:bg-blue-800 transition-colors cursor-pointer"
            >
              充值
            </button>
          </div>
        </div>

        {/* 交易历史 */}
        <div className="space-y-4">
          {/* 标题栏 */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">交易历史</h2>

            {/* 日期范围选择器 */}
            <div className="flex items-center gap-4">
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

              {/* 分页信息 */}
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>显示 {filteredTransactions.length > 0 ? 1 : 0} - {filteredTransactions.length} 共 {filteredTransactions.length} 条</span>
                <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 hover:bg-gray-50 cursor-pointer">
                  <LeftOutlined className="text-xs" />
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 hover:bg-gray-50 cursor-pointer">
                  <RightOutlined className="text-xs" />
                </button>
              </div>
            </div>
          </div>

          {/* 表格 */}
          <div className="bg-white rounded-xl border border-gray-200">
            <Table
              columns={columns}
              dataSource={filteredTransactions}
              rowKey="id"
              pagination={false}
              locale={{
                emptyText: (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="所选时间段内暂无交易记录"
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
