'use client';

import { useState } from 'react';
import { Table, Input, Card } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import Navbar from '@/components/Navbar';
import OrderStatusTag from '@/components/OrderStatusTag';
import OrderDrawer from '@/components/OrderDrawer';
import { mockOrders, type Order } from '@/data/mockData';

export default function OrdersPage() {
  const [searchText, setSearchText] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // 格式化完整日期时间（如 2026-03-20 14:30）
  const formatDateTime = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  // 表格列定义
  const columns: ColumnsType<Order> = [
    {
      title: '下单时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (time) => (
        <span className="text-sm text-gray-900">{formatDateTime(time)}</span>
      ),
    },
    {
      title: '订单编号',
      dataIndex: 'orderId',
      key: 'orderId',
      width: 150,
      render: (orderId) => (
        <span className="text-sm text-gray-900 whitespace-nowrap">{orderId}</span>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => <OrderStatusTag status={status} />,
    },
    {
      title: '装货时间',
      dataIndex: 'scheduledTime',
      key: 'scheduledTime',
      width: 150,
      render: (time) => (
        <span className="text-sm text-gray-900">{formatDateTime(time)}</span>
      ),
    },
    {
      title: '路线',
      key: 'route',
      render: (_, record) => (
        <div className="flex flex-col gap-1">
          <p className="text-sm text-gray-900 truncate">{record.pickup.address}</p>
          <p className="text-sm text-gray-900 truncate">{record.dropoff.address}</p>
        </div>
      ),
      ellipsis: true,
    },
    {
      title: '司机',
      dataIndex: 'driver',
      key: 'driver',
      width: 150,
      render: (driver) => (
        driver ? (
          <div>
            <p className="text-sm text-gray-900">{driver.name}</p>
            <p className="text-xs text-gray-400">{driver.phone}</p>
          </div>
        ) : (
          <span className="text-sm text-gray-400">N/A</span>
        )
      ),
    },
    {
      title: '车型',
      dataIndex: 'vehicle',
      key: 'vehicle',
      width: 150,
      render: (vehicle) => (
        <div>
          <p className="text-sm text-gray-900">{vehicle.name}</p>
          <p className="text-xs text-gray-400">{vehicle.weight || '标准载重'}</p>
        </div>
      ),
    },
    {
      title: '价格',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      width: 150,
      align: 'right',
      render: (price) => {
        // 汇率（1 CNY = 5 THB）
        const exchangeRate = 5.0;
        const cnyAmount = price / exchangeRate;

        return (
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900">
              ฿{price.toFixed(0)}
            </div>
            <div className="text-xs text-gray-400">
              ≈ CNY {cnyAmount.toFixed(0)}
            </div>
          </div>
        );
      },
    },
  ];

  // 过滤订单
  const filteredOrders = mockOrders.filter((order) => {
    if (!searchText) return true;
    const searchLower = searchText.toLowerCase();
    return (
      order.orderId.toLowerCase().includes(searchLower) ||
      order.pickup.address.toLowerCase().includes(searchLower) ||
      order.dropoff.address.toLowerCase().includes(searchLower) ||
      order.vehicle.name.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="p-6">
        {/* 标题栏 */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-lg font-semibold text-gray-900">订单记录</h1>
        </div>

        {/* 搜索栏 */}
        <div className="mb-4">
          <Input
            placeholder="搜索订单信息（订单号、地址、车型）"
            prefix={<SearchOutlined className="text-gray-400" />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            className="max-w-[500px]"
          />
        </div>

        {/* 表格 */}
        <Card>
          <Table
            columns={columns}
            dataSource={filteredOrders}
            rowKey="orderId"
            pagination={{
              pageSize: 10,
              showSizeChanger: false,
              showTotal: (total) => `共 ${total} 条订单`,
            }}
            onRow={(record) => ({
              onClick: () => {
                setSelectedOrder(record);
                setDrawerOpen(true);
              },
              style: { cursor: 'pointer' },
            })}
            rowClassName={(record) =>
              selectedOrder?.orderId === record.orderId
                ? 'bg-blue-50 hover:bg-blue-50'
                : ''
            }
            scroll={{ x: 'max-content' }}
          />
        </Card>
      </div>

      {/* 订单详情抽屉 */}
      <OrderDrawer
        open={drawerOpen}
        order={selectedOrder}
        onClose={() => {
          setDrawerOpen(false);
          // 延迟清除选中状态，等待关闭动画完成
          setTimeout(() => {
            setSelectedOrder(null);
          }, 300);
        }}
      />
    </div>
  );
}
