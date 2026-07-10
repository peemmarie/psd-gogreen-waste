import { LuChartArea, LuSheet } from 'react-icons/lu'

import {
  IconChartLine,
  IconDatabase,
  IconReport,
  IconUsers,
} from '@tabler/icons-react'

export const SIDEBAR = {
  APP: [
    {
      icon: LuSheet,
      title: 'customer_report',
      url: '/customer-report',
    },
    {
      icon: LuChartArea,
      title: 'system_load_profile',
      url: '/system-load-profile',
    },
    {
      icon: IconChartLine,
      items: [
        {
          title: 'tariff',
          url: '/tariff',
        },
        {
          title: 'tsic',
          url: '/tsic',
        },
      ],
      title: 'load_curve',
      url: '#',
    },
  ],
  DOCUMENT: [
    {
      icon: IconDatabase,
      name: 'document_menu.data_library',
      url: '',
    },
    {
      icon: IconReport,
      name: 'document_menu.reports',
      url: '',
    },
  ],

  MANAGEMENT: [
    {
      icon: IconUsers,
      name: 'management_menu.user_management',
      url: '/user-management',
    },
  ],

  USER: {
    avatar: '/avatars/shadcn.jpg',
    email: 'user@mea.or.th',
    name: 'MEA',
  },
}

export const ADMIN_MAIL = 'admin.smg@mea.or.th'
