import React from 'react';
import { 
  Home, 
  BookOpen, 
  Users, 
  BarChart3, 
  FileText, 
  Settings,
  GraduationCap,
  ClipboardList
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Sidebar({ isOpen, activeTab, onTabChange }: SidebarProps) {
  const { user } = useAuth();

  const getNavItems = () => {
    const commonItems = [
      { id: 'dashboard', label: 'Dashboard', icon: Home },
    ];

    const roleSpecificItems = {
      admin: [
        { id: 'courses', label: 'All Courses', icon: BookOpen },
        { id: 'users', label: 'Users', icon: Users },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
      ],
      instructor: [
        { id: 'my-courses', label: 'My Courses', icon: BookOpen },
        { id: 'assessments', label: 'Assessments', icon: FileText },
        { id: 'students', label: 'My Students', icon: GraduationCap },
      ],
      student: [
        { id: 'courses', label: 'Browse Courses', icon: BookOpen },
        { id: 'my-courses', label: 'My Courses', icon: GraduationCap },
        { id: 'assessments', label: 'My Assessments', icon: ClipboardList },
      ],
    };

    return [
      ...commonItems,
      ...roleSpecificItems[user?.role || 'student'],
      { id: 'settings', label: 'Settings', icon: Settings },
    ];
  };

  return (
    <aside className={`
      fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
      lg:translate-x-0 lg:static lg:inset-0
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    `}>
      <div className="flex flex-col h-full pt-20 lg:pt-0">
        <nav className="flex-1 px-4 py-6 space-y-1">
          {getNavItems().map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`
                w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors
                ${activeTab === item.id
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
            >
              <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
}