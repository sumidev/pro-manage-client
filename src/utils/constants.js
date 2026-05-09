import { LayoutDashboard, FolderKanban, User, Settings, Users } from 'lucide-react';

export const SIDEBAR_LINKS = [
  { 
    id: 1, 
    label: 'Dashboard', 
    path: '/dashboard', 
    icon: LayoutDashboard ,
    roles: ['admin', 'employee', 'client']
  },
  { 
    id: 2, 
    label: 'User Management', 
    path: '/user-management', 
    icon: Users,
    roles: ['admin']
  },
  { 
    id: 3, 
    label: 'Projects', 
    path: '/projects', 
    icon: FolderKanban ,
    roles: ['admin', 'employee', 'client']
  },
  { 
    id: 4, 
    label: 'Profile', 
    path: '/profile', 
    icon: User,
    roles: ['admin', 'employee', 'client']
  },
  { 
    id: 5, 
    label: 'Settings', 
    path: '/settings', 
    icon: Settings,
    roles: ['admin', 'employee', 'client']
  }
];