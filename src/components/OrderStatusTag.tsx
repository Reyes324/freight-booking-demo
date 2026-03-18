import { Tag } from 'antd';
import type { OrderStatus } from '@/data/mockData';

interface StatusConfig {
  color: string;
  bgColor: string;
  text: string;
}

const statusConfig: Record<OrderStatus, StatusConfig> = {
  calling_driver: {
    color: '#1677FF',
    bgColor: '#E5EDFF',
    text: '呼叫司机中',
  },
  in_transit: {
    color: '#1677FF',
    bgColor: '#E5EDFF',
    text: '运输中',
  },
  completed: {
    color: '#00A178',
    bgColor: '#DFF3EC',
    text: '已完成',
  },
  cancelled: {
    color: '#8990A3',
    bgColor: '#F0F3F7',
    text: '已取消',
  },
};

export function getStatusConfig(status: OrderStatus) {
  return statusConfig[status];
}

interface OrderStatusTagProps {
  status: OrderStatus;
}

export default function OrderStatusTag({ status }: OrderStatusTagProps) {
  const config = statusConfig[status];

  return (
    <Tag
      style={{
        color: config.color,
        backgroundColor: config.bgColor,
        border: 'none',
        borderRadius: 4,
        padding: '2px 8px',
        fontSize: 12,
        fontWeight: 400,
      }}
    >
      {config.text}
    </Tag>
  );
}
