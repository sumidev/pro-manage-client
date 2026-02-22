import { LayoutDashboard, FolderKanban, User, Settings } from 'lucide-react';

export const SIDEBAR_LINKS = [
  { 
    id: 1, 
    label: 'Dashboard', 
    path: '/dashboard', 
    icon: LayoutDashboard 
  },
  { 
    id: 2, 
    label: 'Projects', 
    path: '/projects', 
    icon: FolderKanban 
  },
  { 
    id: 3, 
    label: 'Profile', 
    path: '/profile', 
    icon: User 
  },
  { 
    id: 4, 
    label: 'Settings', 
    path: '/settings', 
    icon: Settings 
  }
];