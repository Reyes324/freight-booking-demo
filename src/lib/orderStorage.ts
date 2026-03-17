import type { OrderDraft } from '@/data/mockData';

export const OrderStorage = {
  save(draft: OrderDraft) {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('orderDraft', JSON.stringify(draft));
    }
  },

  load(): OrderDraft | null {
    if (typeof window === 'undefined') return null;
    const data = sessionStorage.getItem('orderDraft');
    return data ? JSON.parse(data) : null;
  },

  clear() {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('orderDraft');
    }
  },
};
