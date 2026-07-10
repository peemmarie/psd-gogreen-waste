import {
  CameraIcon,
  ClipboardListIcon,
  DatabaseIcon,
  FileCodeIcon,
  FileIcon,
  FileTextIcon,
  HelpCircleIcon,
  SearchIcon,
  SettingsIcon,
  ZapIcon,
} from 'lucide-react'

export const navigationConfig = {
  documents: [
    {
      icon: DatabaseIcon,
      name: 'Data Library',
      url: '#',
    },
    {
      icon: ClipboardListIcon,
      name: 'Reports',
      url: '#',
    },
    {
      icon: FileIcon,
      name: 'Word Assistant',
      url: '#',
    },
  ],
  navClouds: [
    {
      icon: CameraIcon,
      isActive: true,
      items: [
        {
          title: 'Active Proposals',
          url: '#',
        },
        {
          title: 'Archived',
          url: '#',
        },
      ],
      title: 'Capture',
      url: '#',
    },
    {
      icon: FileTextIcon,
      items: [
        {
          title: 'Active Proposals',
          url: '#',
        },
        {
          title: 'Archived',
          url: '#',
        },
      ],
      title: 'Proposal',
      url: '#',
    },
    {
      icon: FileCodeIcon,
      items: [
        {
          title: 'Active Proposals',
          url: '#',
        },
        {
          title: 'Archived',
          url: '#',
        },
      ],
      title: 'Prompts',
      url: '#',
    },
  ],
  navMain: [
    {
      icon: ZapIcon,
      title: 'หม้อแปลง',
      url: '/transformers',
    },
  ],
  navSecondary: [
    {
      icon: SettingsIcon,
      title: 'Settings',
      url: '#',
    },
    {
      icon: HelpCircleIcon,
      title: 'Get Help',
      url: '#',
    },
    {
      icon: SearchIcon,
      title: 'Search',
      url: '#',
    },
  ],
  user: {
    avatar: '/avatars/shadcn.jpg',
    email: 'mea@mea.com',
    name: 'การไฟฟ้า นครหลวง',
  },
}
