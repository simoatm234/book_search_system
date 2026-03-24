import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../../Services/App/slice/Dispatches/UserDispatch';
import {
  Menu,
  X,
  ChevronDown,
  User,
  LogOut,
  Settings,
  BookOpen,
  Home,
  Book,
  Library,
  Search,
} from 'lucide-react';

export default function NavBar() {
  const { isAuth, user, logout } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Navigation items configuration
  const navItems = [
    { name: 'Home', path: '/user/home', icon: <Home className="w-4 h-4" /> },
    {
      name: 'my Books',
      path: '/user/books',
      icon: <Book className="w-4 h-4" />,
    },
    {
      name: 'Library',
      icon: <Library className="w-4 h-4" />,
      children: [
        {
          name: 'h',
          path: '/user/hellodh',
        },
      ],
    },
  ];

  // Helper to check if a path is active
  const isPathActive = (path) => location.pathname === path;

  // Helper to check if any child of a dropdown is active
  const isChildActive = (children) =>
    children?.some((child) => isPathActive(child.path));

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on resize if screen becomes larger
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (!isMobileMenuOpen) {
      setOpenDropdown(null);
    }
  };

  const toggleDropdown = (dropdownName) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Helper to render navigation links (desktop)
  const renderNavItem = (item, index) => {
    if (item.children && item.children.length > 0) {
      const isOpen = openDropdown === item.name;
      const isActiveParent = isChildActive(item.children);
      return (
        <div key={index} className="relative" ref={isOpen ? dropdownRef : null}>
          <button
            onClick={() => toggleDropdown(item.name)}
            className={`flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors duration-200 ${
              isActiveParent
                ? 'text-[#8B5E3C] dark:text-[#C9A87C] font-semibold'
                : 'text-[#2C1A0E] dark:text-[#F0E6D3] hover:text-[#8B5E3C] dark:hover:text-[#C9A87C]'
            }`}
          >
            {item.icon}
            <span>{item.name}</span>
            <ChevronDown
              className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            />
          </button>
          {isOpen && (
            <div className="absolute left-0 mt-1 w-48 bg-white dark:bg-[#231608] border border-[#DDD0B8] dark:border-[#4A3520] rounded-lg shadow-lg py-1 z-50">
              {item.children.map((child, childIndex) => (
                <NavLink
                  key={childIndex}
                  to={child.path}
                  className={({ isActive }) =>
                    `block px-4 py-2 text-sm text-[#2C1A0E] dark:text-[#F0E6D3] hover:bg-[#F5EFE6] dark:hover:bg-[#1A1208] transition-colors duration-150 ${
                      isActive
                        ? 'bg-[#EDE4D3] dark:bg-[#2C1F10] font-semibold'
                        : ''
                    }`
                  }
                  onClick={() => setOpenDropdown(null)}
                >
                  {child.name}
                </NavLink>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <NavLink
        key={index}
        to={item.path}
        className={({ isActive }) =>
          `flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors duration-200 ${
            isActive
              ? 'text-[#8B5E3C] dark:text-[#C9A87C] font-semibold'
              : 'text-[#2C1A0E] dark:text-[#F0E6D3] hover:text-[#8B5E3C] dark:hover:text-[#C9A87C]'
          }`
        }
      >
        {item.icon}
        <span>{item.name}</span>
      </NavLink>
    );
  };

  // Helper to render mobile navigation (with collapsible children)
  const renderMobileNavItem = (item, index) => {
    if (item.children && item.children.length > 0) {
      const isOpen = openDropdown === item.name;
      const isActiveParent = isChildActive(item.children);
      return (
        <div
          key={index}
          className="border-b border-[#DDD0B8] dark:border-[#4A3520]"
        >
          <button
            onClick={() => toggleDropdown(item.name)}
            className={`w-full flex items-center justify-between px-4 py-3 text-left text-sm font-medium transition-colors ${
              isActiveParent
                ? 'text-[#8B5E3C] dark:text-[#C9A87C] font-semibold'
                : 'text-[#2C1A0E] dark:text-[#F0E6D3] hover:bg-[#F5EFE6] dark:hover:bg-[#1A1208]'
            }`}
          >
            <div className="flex items-center gap-2">
              {item.icon}
              <span>{item.name}</span>
            </div>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            />
          </button>
          {isOpen && (
            <div className="bg-[#F9F4ED] dark:bg-[#1A1208]">
              {item.children.map((child, childIndex) => (
                <NavLink
                  key={childIndex}
                  to={child.path}
                  className={({ isActive }) =>
                    `block pl-12 pr-4 py-2 text-sm text-[#2C1A0E] dark:text-[#F0E6D3] hover:bg-[#EDE4D3] dark:hover:bg-[#2C1F10] transition-colors ${
                      isActive
                        ? 'bg-[#EDE4D3] dark:bg-[#2C1F10] font-semibold'
                        : ''
                    }`
                  }
                  onClick={() => {
                    setOpenDropdown(null);
                    closeMobileMenu();
                  }}
                >
                  {child.name}
                </NavLink>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <NavLink
        key={index}
        to={item.path}
        className={({ isActive }) =>
          `flex items-center gap-2 px-4 py-3 text-sm font-medium border-b border-[#DDD0B8] dark:border-[#4A3520] transition-colors ${
            isActive
              ? 'bg-[#EDE4D3] dark:bg-[#2C1F10] text-[#8B5E3C] dark:text-[#C9A87C]'
              : 'text-[#2C1A0E] dark:text-[#F0E6D3] hover:bg-[#F5EFE6] dark:hover:bg-[#1A1208]'
          }`
        }
        onClick={closeMobileMenu}
      >
        {item.icon}
        <span>{item.name}</span>
      </NavLink>
    );
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:block bg-white dark:bg-[#231608] border-b border-[#DDD0B8] dark:border-[#4A3520] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/user/home" className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-[#8B5E3C] dark:text-[#C9A87C]" />
              <span className="text-xl font-bold text-[#2C1A0E] dark:text-[#F0E6D3]">
                Book for You
              </span>
            </Link>

            {/* Nav Items */}
            <div className="flex items-center space-x-1">
              {navItems.map(renderNavItem)}
            </div>

            {/* Search Input (Desktop) */}
            <div className="flex-1 max-w-md mx-4">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search books..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#F5EFE6] dark:bg-[#1A1208] border border-[#DDD0B8] dark:border-[#4A3520] rounded-lg text-sm text-[#2C1A0E] dark:text-[#F0E6D3] placeholder-[#A0856A] focus:outline-none focus:border-[#8B5E3C] dark:focus:border-[#C9A87C] transition-colors"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A0856A] dark:text-[#8A6A4A]" />
                <button type="submit" className="sr-only">
                  Search
                </button>
              </form>
            </div>

            {/* Auth Section */}
            <div className="flex items-center gap-3">
              {isAuth ? (
                // Authenticated: Profile dropdown
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => toggleDropdown('profile')}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#F5EFE6] dark:hover:bg-[#1A1208] transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8B5E3C] to-[#C9A87C] flex items-center justify-center text-sm font-bold text-white">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="text-sm font-medium text-[#2C1A0E] dark:text-[#F0E6D3]">
                      {user?.name || 'Profile'}
                    </span>
                    <ChevronDown className="w-4 h-4 text-[#A0856A]" />
                  </button>
                  {openDropdown === 'profile' && (
                    <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-[#231608] border border-[#DDD0B8] dark:border-[#4A3520] rounded-lg shadow-lg py-1 z-50">
                      <Link
                        to="/profile"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-[#2C1A0E] dark:text-[#F0E6D3] hover:bg-[#F5EFE6] dark:hover:bg-[#1A1208] transition-colors"
                        onClick={() => setOpenDropdown(null)}
                      >
                        <User className="w-4 h-4" />
                        Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-[#2C1A0E] dark:text-[#F0E6D3] hover:bg-[#F5EFE6] dark:hover:bg-[#1A1208] transition-colors"
                        onClick={() => setOpenDropdown(null)}
                      >
                        <Settings className="w-4 h-4" />
                        Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                // Unauthenticated: Login & Signup buttons
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-[#2C1A0E] dark:text-[#F0E6D3] hover:text-[#8B5E3C] dark:hover:text-[#C9A87C] transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 text-sm font-medium bg-[#8B5E3C] hover:bg-[#6B3F22] text-white rounded-lg transition-colors"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation - Hamburger Menu */}
      <div className="md:hidden bg-white dark:bg-[#231608] border-b border-[#DDD0B8] dark:border-[#4A3520] shadow-sm">
        <div className="flex justify-between items-center px-4 h-16">
          <Link
            to="/user/home"
            className="flex items-center gap-2"
            onClick={closeMobileMenu}
          >
            <BookOpen className="w-6 h-6 text-[#8B5E3C] dark:text-[#C9A87C]" />
            <span className="text-xl font-bold text-[#2C1A0E] dark:text-[#F0E6D3]">
              Book for You
            </span>
          </Link>

          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-lg hover:bg-[#F5EFE6] dark:hover:bg-[#1A1208] transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-[#2C1A0E] dark:text-[#F0E6D3]" />
            ) : (
              <Menu className="w-6 h-6 text-[#2C1A0E] dark:text-[#F0E6D3]" />
            )}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={closeMobileMenu}
          ></div>
        )}

        <div
          ref={mobileMenuRef}
          className={`fixed top-0 right-0 h-full w-64 bg-white dark:bg-[#231608] shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex justify-end p-4 border-b border-[#DDD0B8] dark:border-[#4A3520]">
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg hover:bg-[#F5EFE6] dark:hover:bg-[#1A1208] transition-colors"
            >
              <X className="w-5 h-5 text-[#2C1A0E] dark:text-[#F0E6D3]" />
            </button>
          </div>

          {/* Mobile Nav Items */}
          <div className="py-2">{navItems.map(renderMobileNavItem)}</div>

          {/* Mobile Auth Section */}
          <div className="border-t border-[#DDD0B8] dark:border-[#4A3520] p-4">
            {isAuth ? (
              <>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8B5E3C] to-[#C9A87C] flex items-center justify-center text-sm font-bold text-white">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#2C1A0E] dark:text-[#F0E6D3]">
                      {user?.name || 'User'}
                    </p>
                    <p className="text-xs text-[#A0856A] dark:text-[#8A6A4A]">
                      {user?.email}
                    </p>
                  </div>
                </div>
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-[#2C1A0E] dark:text-[#F0E6D3] hover:bg-[#F5EFE6] dark:hover:bg-[#1A1208] rounded-lg transition-colors"
                  onClick={closeMobileMenu}
                >
                  <User className="w-4 h-4" />
                  Profile
                </Link>
                <Link
                  to="/settings"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-[#2C1A0E] dark:text-[#F0E6D3] hover:bg-[#F5EFE6] dark:hover:bg-[#1A1208] rounded-lg transition-colors"
                  onClick={closeMobileMenu}
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    closeMobileMenu();
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors mt-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-[#2C1A0E] dark:text-[#F0E6D3] hover:text-[#8B5E3C] dark:hover:text-[#C9A87C] transition-colors text-center"
                  onClick={closeMobileMenu}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium bg-[#8B5E3C] hover:bg-[#6B3F22] text-white rounded-lg transition-colors text-center"
                  onClick={closeMobileMenu}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
