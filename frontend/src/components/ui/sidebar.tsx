import React, { useState, lazy, Suspense } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChevronDown,
  LayoutDashboard,
  ClipboardCheck,
  Play,
  BarChart,
  Network,
  Database,
  ServerCog,
  FileText,
  Settings,
} from 'lucide-react';

interface MenuItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  path: string;
  subMenus?: MenuItem[];
}

const menuStructure: MenuItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    icon: <LayoutDashboard size={20} />,
    path: '/dashboard'
  },
  {
    id: 'automation',
    title: 'Automation',
    icon: <Play size={20} />,
    path: '/automation',
    subMenus: [
      {
        id: 'systems-list',
        title: 'Systems',
        icon: <Database size={18} />,
        path: '/automation/systems'
      },
      {
        id: 'apis-list',
        title: 'APIs',
        icon: <ServerCog size={18} />,
        path: '/automation/apis'
      },
    ],
  },
  {
    id: 'performance',
    title: 'Performance',
    icon: <BarChart size={20} />,
    path: '/performance'
  },
  {
    id: 'settings',
    title: 'Settings',
    icon: <Settings size={20} />,
    path: '/settings'
  },
];

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  // Initialize expanded menus based on current path
  React.useEffect(() => {
    const currentPath = location.pathname;
    const parentMenu = menuStructure.find(menu => 
      menu.subMenus?.some(subMenu => currentPath.startsWith(subMenu.path))
    );
    if (parentMenu && !expandedMenus.includes(parentMenu.id)) {
      setExpandedMenus(prev => [...prev, parentMenu.id]);
    }
  }, [location.pathname]);

  const toggleSubmenu = (menuId: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuId)
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  const handleMenuClick = (item: MenuItem) => {
    if (item.subMenus && item.subMenus.length > 0) {
      toggleSubmenu(item.id);
      // If menu has submenus and is not expanded, expand it and navigate to first submenu
      if (!expandedMenus.includes(item.id)) {
        navigate(item.subMenus[0].path);
      }
    } else {
      navigate(item.path);
    }
  };

  const isMenuActive = (item: MenuItem): boolean => {
    if (item.subMenus) {
      return item.subMenus.some(subMenu => location.pathname.startsWith(subMenu.path));
    }
    return location.pathname === item.path;
  };

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const hasSubMenu = item.subMenus && item.subMenus.length > 0;
    const isExpanded = expandedMenus.includes(item.id);
    const isActive = isMenuActive(item);

    return (
      <div key={item.id} className="w-full">
        <button
          onClick={() => handleMenuClick(item)}
          className={`w-full flex items-center px-4 py-3 text-sm 
            ${isActive 
              ? 'bg-green-700 text-white' 
              : 'text-gray-700 hover:bg-green-50 hover:text-green-700'
            } transition-colors duration-200 ease-in-out
            ${level > 0 ? 'pl-12' : 'pl-6'}
            border-l-4 ${isActive ? 'border-green-700' : 'border-transparent'}
          `}
        >
          <span className={`mr-3 ${isActive ? 'text-white' : 'text-green-700'}`}>
            {item.icon}
          </span>
          <span className="flex-1 font-medium">{item.title}</span>
          {hasSubMenu && (
            <ChevronDown
              size={16}
              className={`transform transition-transform duration-200 
                ${isExpanded ? 'rotate-180' : ''} 
                ${isActive ? 'text-white' : 'text-green-700'}`}
            />
          )}
        </button>
        
        {hasSubMenu && isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white"
          >
            {item.subMenus?.map(subItem => renderMenuItem(subItem, level + 1))}
          </motion.div>
        )}
      </div>
    );
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 shadow-lg h-screen flex flex-col">
      <div className="h-16 bg-green-700 flex items-center px-6">
        <h1 className="text-xl font-bold text-white">Co-op Bank</h1>
      </div>
      <nav className="flex-1 overflow-y-auto mt-2">
        {menuStructure.map(item => renderMenuItem(item))}
      </nav>
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center space-x-2">
          <div className="text-xs text-gray-500">© 2024 Co-operative Bank QA</div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;