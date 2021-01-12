import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
  {
    label: 'Reports',
    isTitle: true,
  },
  {
    label: 'Overview',
    icon: 'home',
    link: '/',
    // badge: {
    //   variant: 'success',
    //   text: '1',
    // },
  },
  // Transactions
  {
    label: 'Transactions',
    isTitle: true,
  },
  {
    label: 'All Transactions',
    icon: 'archive',
    link: '/transactions/all-transactions',
  },
  {
    label: 'Airtime Services',
    icon: 'smartphone',
    subItems: [
      {
        label: 'MTN Transactions',
        link: '/transactions/mtn-transactions',
      },
      {
        label: 'Airtel Transactions',
        link: '/transactions/airtel-transactions',
      },
      {
        label: 'Zamtel Transactions',
        link: '/transactions/zamtel-transactions',
      },
    ],
  },
  // {
  //   label: 'Mobile Payments',
  //   icon: 'credit-card',
  //   subItems: [
  //     {
  //       label: 'All Transactions',
  //       link: '/mobile-payments/all-momo-transactions',
  //     },
  //     {
  //       label: 'Airtel Money',
  //       link: '/mobile-payments/airtel-money',
  //     },
  //     {
  //       label: 'MTN Money',
  //       link: '/mobile-payments/mtn-money',
  //     },
  //     {
  //       label: 'Zamtel Kwacha',
  //       link: '/mobile-payments/zamtel-kwacha',
  //     },
  //   ],
  // },
  // Bill Payments
  {
    label: 'Bill Payments',
    icon: 'file-text',
    subItems: [
      {
        label: 'ZESCO Transactions',
        link: '/transactions/zesco-transactions',
      },
      {
        label: 'LWSC Transactions',
        link: '/transactions/lwsc-transactions',
      },
    ],
  },
  // End bill payments
  {
    label: 'Pay TV',
    icon: 'tv',
    subItems: [
      {
        label: 'DSTV',
        link: '/transactions/dstv-transactions',
      },
      {
        label: 'GoTv',
        link: '/transactions/gotv-transactions',
      },
      {
        label: 'TopStar',
        link: '/transactions/topstar-transactions',
      },
    ],
  },

  // End transactions

  // Partner Management
  {
    label: 'Agent Management',
    isTitle: true,
  },
  {
    label: 'All Agents',
    icon: 'users',
    link: '/agents/all-agents',
  },
];
