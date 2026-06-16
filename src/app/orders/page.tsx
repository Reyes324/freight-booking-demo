'use client';

import { useEffect, useState } from 'react';
import { Table, Input, Card, Select, Button } from 'antd';
import { SearchOutlined, DownloadOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import type { ColumnsType } from 'antd/es/table';
import Navbar from '@/components/Navbar';
import OrderStatusTag from '@/components/OrderStatusTag';
import OrderDrawer from '@/components/OrderDrawer';
import {
  mockOrders,
  mockSubAccounts,
  getCurrentAccount,
  type Order,
  type CurrentAccount,
} from '@/data/mockData';
import { useT } from '@/hooks/useT';

export default function OrdersPage() {
  const t = useT();
  const [searchText, setSearchText] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [subFilter, setSubFilter] = useState<string | null>(null);

  // 当前账号（挂载后读取）
  const [account, setAccount] = useState<CurrentAccount | null>(null);
  useEffect(() => {
    setAccount(getCurrentAccount());
  }, []);

  const isParent = account?.accountType === 'parent';
  const isChild = account?.accountType === 'child';

  // 子账号名称查表
  const subName = (id?: string) =>
    id ? mockSubAccounts.find((s) => s.id === id)?.name ?? id : t.orders.parentOwnOrder;

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
    // 母账号：账号名称列置首
    ...(isParent
      ? [
          {
            title: t.orders.subAccountColumn,
            key: 'subAccount',
            width: 130,
            render: (_: unknown, record: Order) => (
              <span className="text-sm text-gray-900">
                {record.subAccountId ? subName(record.subAccountId) : (account?.companyName ?? t.orders.parentOwnOrder)}
              </span>
            ),
          } as ColumnsType<Order>[number],
        ]
      : []),
    {
      title: t.orders.orderTime,
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (time) => (
        <span className="text-sm text-gray-900">{formatDateTime(time)}</span>
      ),
    },
    {
      title: t.orders.orderId,
      dataIndex: 'orderId',
      key: 'orderId',
      width: 150,
      render: (orderId) => (
        <span className="text-sm text-gray-900 whitespace-nowrap">{orderId}</span>
      ),
    },
    {
      title: t.orders.status,
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => <OrderStatusTag status={status} />,
    },
    {
      title: t.orders.pickupTime,
      dataIndex: 'scheduledTime',
      key: 'scheduledTime',
      width: 150,
      render: (time) => (
        <span className="text-sm text-gray-900">{formatDateTime(time)}</span>
      ),
    },
    {
      title: t.orders.route,
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
      title: t.orders.driver,
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
      title: t.orders.vehicle,
      dataIndex: 'vehicle',
      key: 'vehicle',
      width: 150,
      render: (vehicle) => (
        <div>
          <p className="text-sm text-gray-900">{vehicle.name}</p>
          <p className="text-xs text-gray-400">{vehicle.weight || t.drawer.standardLoad}</p>
        </div>
      ),
    },
    {
      title: t.orders.price,
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

  // 过滤订单：
  // - 子账号：数据隔离，只看本账号订单
  // - 母账号：默认全部，可按子账号筛选
  const filteredOrders = mockOrders.filter((order) => {
    if (isChild && order.subAccountId !== account?.accountId) return false;
    if (isParent && subFilter) {
      if (subFilter === '__parent__') {
        if (order.subAccountId) return false;
      } else {
        if (order.subAccountId !== subFilter) return false;
      }
    }
    if (!searchText) return true;
    const searchLower = searchText.toLowerCase();
    return (
      order.orderId.toLowerCase().includes(searchLower) ||
      order.pickup.address.toLowerCase().includes(searchLower) ||
      order.dropoff.address.toLowerCase().includes(searchLower)
    );
  });

  const exportExcel = () => {
    const statusLabel: Record<string, string> = {
      completed: '已完成', in_progress: '配送中', cancelled: '已取消', scheduled: '待取货',
    };
    const rows = filteredOrders.map((o) => ({
      '订单号': o.orderId,
      '下单时间': formatDateTime(o.createdAt),
      '状态': statusLabel[o.status] ?? o.status,
      '取货时间': o.scheduledTime ? formatDateTime(o.scheduledTime) : '-',
      '取货地址': o.pickup.address,
      '送货地址': o.dropoff.address,
      '司机': o.driver?.name ?? '-',
      '司机电话': o.driver?.phone ?? '-',
      '车型': o.vehicle.name,
      '金额(本地货币)': o.totalPrice.toFixed(0),
      '金额(CNY)': (o.totalPrice / 5).toFixed(0),
      ...(isParent ? { '账号名称': o.subAccountId ? subName(o.subAccountId) : (account?.companyName ?? '') } : {}),
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '订单记录');
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    XLSX.writeFile(wb, `订单记录_${date}.xlsx`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="p-6">
        {/* 标题栏 */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-lg font-semibold text-gray-900">{t.orders.title}</h1>
          <Button icon={<DownloadOutlined />} onClick={exportExcel}>导出 Excel</Button>
        </div>

        {/* 筛选栏 */}
        <div className="mb-4 flex items-center gap-3">
          {isParent && (
            <Select
              placeholder="全部账号"
              allowClear
              value={subFilter}
              onChange={setSubFilter}
              style={{ width: 160 }}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={[
                { value: '__parent__', label: account?.companyName ?? '本账号' },
                ...mockSubAccounts.map((s) => ({ value: s.id, label: s.name })),
              ]}
            />
          )}
          <Input
            data-ds="Input"
            data-ds-label="搜索框"
            placeholder={t.orders.searchPlaceholder}
            prefix={<SearchOutlined className="text-gray-400" />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            className="flex-1"
          />
        </div>

        {/* 表格 */}
        <Card data-ds="Table" data-ds-label="订单列表">
          <Table
            columns={columns}
            dataSource={filteredOrders}
            rowKey="orderId"
            pagination={{
              pageSize: 10,
              showSizeChanger: false,
              showTotal: (total) => t.orders.totalOrders(total),
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
