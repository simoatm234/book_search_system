import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  UserSearch,
  ChevronDown,
  BookOpen,
  LogOut,
  Menu,
  ActivityIcon
} from 'lucide-react';

export default function SideBar({ user, onLogout }) {
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState({});
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMenu = (id) => {
    setOpenMenus((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const sideItem = [
    {
      id: 1,
      name: 'dashboard',
      path: '/admin/dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 2,
      name: 'users',
      icon: <Users className="w-4 h-4" />,
      children: [
        {
          id: 20,
          name: 'all users',
          path: '/admin/show/users',
          icon: <UserSearch className="w-3.5 h-3.5" />,
        },
        {
          id: 21,
          name: 'user action',
          path: '/admin/action/users',
          icon: <ActivityIcon className="w-3.5 h-3.5" />,
        },
      ],
    },
  ];

  const avatarLetter = user?.name?.charAt(0).toUpperCase() ?? '?';

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-[#8B5E3C] text-white shadow-md"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:static top-0 left-0 h-screen w-64 bg-[#FDFAF4] dark:bg-[#231608] border-r border-[#DDD0B8] dark:border-[#4A3520] flex flex-col shadow-lg transition-transform duration-300 z-40
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-[#DDD0B8] dark:border-[#4A3520]">
          <div className="w-9 h-9 rounded-xl bg-[#EDE4D3] dark:bg-[#2C1F10] border border-[#C9A87C] dark:border-[#6B4423] flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-[#8B5E3C] dark:text-[#C9A87C]" />
          </div>
          <div>
            <p className="text-sm font-bold text-[#2C1A0E] dark:text-[#F0E6D3] leading-tight">
              Library
            </p>
            <p className="text-xs text-[#A0856A] dark:text-[#6A5040]">
              Admin Panel
            </p>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {sideItem.map((item) => {
            const isActive = location.pathname === item.path;
            const isOpen = openMenus[item.id];

            if (item.children) {
              return (
                <div key={item.id}>
                  <button
                    onClick={() => toggleMenu(item.id)}
                    className="w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl text-sm font-medium capitalize transition-all duration-200
                    text-[#2C1A0E] dark:text-[#C9A87C]
                    hover:bg-[#EDE4D3] dark:hover:bg-[#2C1F10]"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[#8B5E3C] dark:text-[#C9A87C]">
                        {item.icon}
                      </span>
                      {item.name}
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-[#A0856A] dark:text-[#6A5040] transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="ml-4 mt-1 space-y-1 border-l-2 border-[#DDD0B8] dark:border-[#4A3520] pl-3">
                      {item.children.map((child) => {
                        const isChildActive = location.pathname === child.path;
                        return (
                          <Link
                            key={child.id}
                            to={child.path}
                            onClick={() => setMobileOpen(false)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium capitalize transition-all duration-200
                            ${
                              isChildActive
                                ? 'bg-[#8B5E3C] dark:bg-[#C9A87C] text-white dark:text-[#1A1208]'
                                : 'text-[#A0856A] dark:text-[#8A6A4A] hover:bg-[#EDE4D3] dark:hover:bg-[#2C1F10]'
                            }`}
                          >
                            <span>{child.icon}</span>
                            {child.name}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.id}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium capitalize transition-all duration-200
                ${
                  isActive
                    ? 'bg-[#8B5E3C] dark:bg-[#C9A87C] text-white dark:text-[#1A1208]'
                    : 'text-[#2C1A0E] dark:text-[#C9A87C] hover:bg-[#EDE4D3] dark:hover:bg-[#2C1F10]'
                }`}
              >
                <span>{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Footer */}
        <div className="px-4 py-4 border-t border-[#DDD0B8] dark:border-[#4A3520]">
          {/* Profile Button Container */}
          <div className="space-y-1">
            {/* Profile Button - Navigate to Profile */}
            <Link
              to="/admin/profile"
              onClick={() => setMobileOpen(false)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-t-xl border border-b-0 bg-[#EDE4D3] dark:bg-[#2C1F10] border-[#DDD0B8] dark:border-[#4A3520] hover:border-[#8B5E3C] dark:hover:border-[#C9A87C] transition-all duration-200"
            >
              {/* Avatar */}
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 bg-[#8B5E3C] dark:bg-[#C9A87C] text-white dark:text-[#1A1208]">
                {avatarLetter}
              </div>

              {/* Name & Role */}
              <div className="flex-1 min-w-0 text-left">
                <p className="text-xs font-semibold truncate text-[#2C1A0E] dark:text-[#F0E6D3]">
                  {user?.name ?? 'Guest'}
                </p>
                <p className="text-xs truncate capitalize text-[#A0856A] dark:text-[#6A5040]">
                  {user?.role ?? 'No role'}
                </p>
              </div>
            </Link>

            {/* Logout Button */}
            <button
              onClick={() => {
                setMobileOpen(false);
                onLogout();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-b-xl border border-t-0 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-all duration-200"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-xs font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
