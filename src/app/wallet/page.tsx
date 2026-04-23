'use client';

import { useState } from 'react';
import { Table, DatePicker, Empty } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs, { Dayjs } from 'dayjs';
import Navbar from '@/components/Navbar';
import { mockWalletBalance, mockTransactions, type Transaction } from '@/data/mockData';

const { RangePicker } = DatePicker;

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
        <span className="text-sm text-gray-900">
          {orderId || '-'}
        </span>
      ),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      width: 150,
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 220,
      align: 'right',
      render: (amount: number) => {
        // 泰铢金额
        const thbAmount = Math.abs(amount);
        // 统一汇率（1 CNY = 5 THB）
        const exchangeRate = 5.0;
        // 换算成人民币
        const cnyAmount = thbAmount / exchangeRate;

        return (
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900">
              {amount > 0 ? '+' : '-'}฿{thbAmount.toFixed(0)}
            </div>
            <div className="text-xs text-gray-400">
              ≈ CNY {cnyAmount.toFixed(2)}
            </div>
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
        <h1 className="text-lg font-semibold text-gray-900 mb-4">账期余额</h1>
        <div className="border border-gray-200 rounded-xl p-6 bg-white mb-6">
          <div>
            <p className="text-sm text-gray-500 mb-2">余额（人民币）</p>
            <p className="text-4xl font-bold text-gray-900">
              CNY {mockWalletBalance.balance.toLocaleString('zh-CN')}
              <span className="text-lg font-normal text-gray-400"> / CNY {mockWalletBalance.creditLimit.toLocaleString('zh-CN')}</span>
            </p>
            <p className="text-xs text-gray-500 mt-3 leading-relaxed">
              页面人民币金额按订单发生当日参考汇率估算，仅用于额度控制。实际结算以每月月末汇率为准。
            </p>
          </div>
        </div>

        {/* 交易明细 */}
        <div className="space-y-4">
          {/* 标题栏 */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">交易明细</h2>

            {/* 日期范围选择器 */}
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
          </div>

          {/* 表格 */}
          <div className="bg-white rounded-xl border border-gray-200">
            <Table
              columns={columns}
              dataSource={filteredTransactions}
              rowKey="id"
              pagination={{
                pageSize: 15,
                showSizeChanger: false,
                showTotal: (total) => `共 ${total} 条交易记录`,
              }}
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
