import { LayoutDashboard, FolderKanban, User, Settings, Users } from 'lucide-react';

export const SIDEBAR_LINKS = [
  { 
    id: 1, 
    label: 'Dashboard', 
    path: '/dashboard', 
    icon: LayoutDashboard 
  },
  { 
    id: 2, 
    label: 'User Management', 
    path: '/user-management', 
    icon: Users 
  },
  { 
    id: 3, 
    label: 'Projects', 
    path: '/projects', 
    icon: FolderKanban 
  },
  { 
    id: 4, 
    label: 'Profile', 
    path: '/profile', 
    icon: User 
  },
  { 
    id: 5, 
    label: 'Settings', 
    path: '/settings', 
    icon: Settings 
  }
];