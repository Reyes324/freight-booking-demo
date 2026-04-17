import { Tag } from 'antd';
import type { OrderStatus } from '@/data/mockData';

const statusText: Record<OrderStatus, string> = {
  calling_driver: '呼叫司机中',
  in_transit: '前往装货地',
  delivering: '配送中',
  completed: '已完成',
  cancelled: '已取消',
};

const statusColor: Record<OrderStatus, string> = {
  calling_driver: '#FF6600',     // 呼叫司机中 - 橙色
  in_transit: '#2257D4',         // 前往装货地 - 品牌主色
  delivering: '#2257D4',         // 配送中 - 品牌主色
  completed: 'default',          // 已完成 - 黑灰色
  cancelled: '#F23041',          // 已取消 - 设计系统失败色
};

export function getStatusConfig(status: OrderStatus) {
  return {
    color: statusColor[status],
    text: statusText[status],
  };
}

interface OrderStatusTagProps {
  status: OrderStatus;
}

export default function OrderStatusTag({ status }: OrderStatusTagProps) {
  return (
    <Tag color={statusColor[status]}>
      {statusText[status]}
    </Tag>
  );
}
