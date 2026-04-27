"use client";

import { Tag } from 'antd';
import type { OrderStatus } from '@/data/mockData';
import { useT } from '@/hooks/useT';

const statusColor: Record<OrderStatus, string> = {
  calling_driver: '#FF6600',
  in_transit: '#2257D4',
  delivering: '#2257D4',
  completed: 'default',
  cancelled: '#F23041',
};

export function getStatusConfig(status: OrderStatus, t: ReturnType<typeof useT>) {
  return {
    color: statusColor[status],
    text: {
      calling_driver: t.orders.statusCalling,
      in_transit: t.orders.statusInTransit,
      delivering: t.orders.statusDelivering,
      completed: t.orders.statusCompleted,
      cancelled: t.orders.statusCancelled,
    }[status],
  };
}

interface OrderStatusTagProps {
  status: OrderStatus;
}

export default function OrderStatusTag({ status }: OrderStatusTagProps) {
  const t = useT();
  const labels: Record<OrderStatus, string> = {
    calling_driver: t.orders.statusCalling,
    in_transit: t.orders.statusInTransit,
    delivering: t.orders.statusDelivering,
    completed: t.orders.statusCompleted,
    cancelled: t.orders.statusCancelled,
  };

  return (
    <Tag color={statusColor[status]}>
      {labels[status]}
    </Tag>
  );
}
