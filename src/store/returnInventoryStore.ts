import { create } from 'zustand'

export type ReturnInventoryItem = {
  id: string; // unique internal ID
  orderRef: string; // The return order number
  productName: string;
  sku: string;
  quantity: number;
  status: 'Mới' | 'Trầy xước' | 'Lỗi nhẹ' | 'Hàng trưng bày';
  discountPercentage: number;
  imageUrl?: string;
  createdAt: string;
}

interface ReturnInventoryState {
  items: ReturnInventoryItem[];
  addItem: (item: ReturnInventoryItem) => void;
  updateStatus: (id: string, status: ReturnInventoryItem['status']) => void;
  applyDiscount: (id: string, discount: number) => void;
  removeItem: (id: string) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useReturnInventoryStore = create<ReturnInventoryState>((set: any) => ({
  items: [
    {
      id: 'mock-1',
      orderRef: '#RET-94021',
      productName: 'iPhone 15 Pro - 256GB - Blue Titanium',
      sku: 'IP15P-256-BLU',
      quantity: 1,
      status: 'Mới',
      discountPercentage: 0,
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-0VJ_golIqWlmIs6JojBs5mHTuvClTUcYspwPPTbpC9kudcA52CcSEtr__GFQ1zDfwMFpIhs5reAoRl2VCaEuMmO0D8KYjkwQVbbPwTNMg7h3Mrb_0JHErIgojCZftxnkjNXi9b7gybMrEwypkT9E7N1MYgJhhbV20yBziTOx2ETEnUzog6R2BPazecoSOySOHUpij_JJUPLkDcxjhbZku7YGn0d0BBvz-XnpQiG9HDRtlaAZ9d64PmXBzJ3QFb8EHPYx60u7jKw5',
      createdAt: '24/05/2024'
    },
    {
       id: 'mock-2',
       orderRef: '#RET-94025',
       productName: 'Galaxy Watch 6 Classic 43mm',
       sku: 'GW6C-43',
       quantity: 2,
       status: 'Trầy xước',
       discountPercentage: 15,
       imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC8UP1wpbX9WoROzvVNHmYa3I4toHryLnHVj0lgrQ_AVE9zGkCQBSYqi6GZ_atGi3pwc6bhmMcfyXnBtzWkwx4DNoQV2YOCtY9_7QAOiBk_q736uRj31TH1YDwj6VG2Uqh6EI84tEyPZb1R0aeNKWN0YXfeKEjV79fQQSF1-AKgmFQvdShqeUQWREARykDMF33euMKeSoe9dvnXVFQHfjn4BwHgOK6SUaHBOekAIeISizom6m_EkkZeW-UT0pEEN_LHbB8Pe2WdIM8w',
       createdAt: '23/05/2024'
    },
    {
      id: 'mock-3',
      orderRef: '#RET-94102',
      productName: 'Sony WH-1000XM5 ANC',
      sku: 'WH1000-XM5',
      quantity: 1,
      status: 'Lỗi nhẹ',
      discountPercentage: 30,
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuChuJ1BO4S8xHNZtlDXjANUsFePnZnPbwQ9LC1SN694v5aZEXwnw_8kafIKNgMqf7Kj1eJkanOgHL1JpFGz9H0tXnIffqI9vZQWMbp9bg01oPfIKo3pn8-K8MqnVMyN2fB-i-QCeeiWb2ucLqwKkSw0w8Qcxry0SE87Klxyf7TpdyAW18Yiv27ah6IPxKWPEho0cvEKZx-bRRR_XtXbWnLhLdUR_vExnTVrO4ggnNOW4FQTeUYO64d3m3SMsrpaYpz3RdNe2xvxmBxe',
      createdAt: '22/05/2024'
    }
  ],
  addItem: (item: ReturnInventoryItem) => set((state: ReturnInventoryState) => ({ items: [item, ...state.items] })),
  updateStatus: (id: string, status: ReturnInventoryItem['status']) => set((state: ReturnInventoryState) => ({
    items: state.items.map(prev => prev.id === id ? { ...prev, status } : prev)
  })),
  applyDiscount: (id: string, discount: number) => set((state: ReturnInventoryState) => ({
    items: state.items.map(prev => prev.id === id ? { ...prev, discountPercentage: discount } : prev)
  })),
  removeItem: (id: string) => set((state: ReturnInventoryState) => ({
    items: state.items.filter(prev => prev.id !== id)
  }))
}))
