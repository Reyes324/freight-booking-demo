import { Tag } from 'antd';
import type { OrderStatus } from '@/data/mockData';
import { statusColors, radius, fontSize } from '@/styles/design-tokens';

const statusText: Record<OrderStatus, string> = {
  calling_driver: '呼叫司机中',
  in_transit: '前往装货地',
  delivering: '配送中',
  completed: '已完成',
  cancelled: '已取消',
};

export function getStatusConfig(status: OrderStatus) {
  return {
    color: statusColors[status].color,
    bgColor: statusColors[status].bg,
    text: statusText[status],
  };
}

interface OrderStatusTagProps {
  status: OrderStatus;
}

export default function OrderStatusTag({ status }: OrderStatusTagProps) {
  const colors = statusColors[status];

  return (
    <Tag
      style={{
        color: colors.color,
        backgroundColor: colors.bg,
        border: 'none',
        borderRadius: parseInt(radius.sm),
        padding: '2px 8px',
        fontSize: parseInt(fontSize.sm.size),
        fontWeight: 400,
      }}
    >
      {statusText[status]}
    </Tag>
  );
}
