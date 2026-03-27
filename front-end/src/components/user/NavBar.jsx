import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
  Search,
} from 'lucide-react';
import { useAuth } from '../../Services/App/slice/Dispatches/AuthDispatch';
import { useSelector } from 'react-redux';

export default function NavBar({ onLogout }) {
  const { logout, setOpenAuth } = useAuth();
  const { isAuth, token, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const dropdownRef = useRef(null);

  // Navigation Items
  const navItems = [
    {
      name: 'Home',
      path: '/user/home',
      icon: <Home className="w-4 h-4" />,
      onClick: () => navigate('/user/home'),
    },
    {
      name: 'My Books',
      path: '/user/books/myBooks',
      icon: <Book className="w-4 h-4" />,
      onClick: () => (isAuth ? navigate('/user/books/myBooks') : setOpenAuth(true)),
    },
  ];

  // Check if path is active
  const isActive = (path) => location.pathname === path;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu when screen becomes large
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
    onLogout();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleDropdown = (name) =>
    setOpenDropdown(openDropdown === name ? null : name);
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
  };

  // Render Desktop Nav Items
  const renderDesktopNavItem = (item, index) => (
    <button
      key={index}
      onClick={item.onClick}
      className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
        isActive(item.path)
          ? 'bg-[#EDE4D3] dark:bg-[#2C1A0E] text-[#8B5E3C] dark:text-[#C9A87C]'
          : 'text-[#2C1A0E] dark:text-[#F0E6D3] hover:bg-[#F5EFE6] dark:hover:bg-[#1A1208]'
      }`}
    >
      {item.icon}
      {item.name}
    </button>
  );

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:block bg-white dark:bg-[#231608] border-b border-[#DDD0B8] dark:border-[#4A3520] sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/user/home" className="flex items-center gap-3">
              <BookOpen className="w-7 h-7 text-[#8B5E3C] dark:text-[#C9A87C]" />
              <span className="text-2xl font-bold tracking-tight text-[#2C1A0E] dark:text-[#F0E6D3]">
                BookForYou
              </span>
            </Link>

            {/* Main Navigation */}
            <div className="flex items-center gap-1">
              {navItems.map(renderDesktopNavItem)}
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-md mx-8">
              <form onSubmit={handleSearch} className="relative group">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search books by title or author..."
                  className="w-full pl-11 pr-4 py-2.5 bg-[#F5EFE6] dark:bg-[#1A1208] border border-[#DDD0B8] dark:border-[#4A3520] rounded-2xl text-sm focus:outline-none focus:border-[#8B5E3C] dark:focus:border-[#C9A87C] placeholder-[#A0856A] transition-all"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A0856A]" />
              </form>
            </div>

            {/* Auth Section */}
            <div className="flex items-center gap-3">
              {isAuth ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => toggleDropdown('profile')}
                    className="flex items-center gap-3 px-2 py-1.5 rounded-2xl hover:bg-[#F5EFE6] dark:hover:bg-[#1A1208] transition-all"
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#8B5E3C] to-[#C9A87C] flex items-center justify-center text-white font-semibold">
                      {user?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-[#2C1A0E] dark:text-[#F0E6D3]">
                        {user?.name}
                      </p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-[#A0856A]" />
                  </button>

                  {openDropdown === 'profile' && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#231608] border border-[#DDD0B8] dark:border-[#4A3520] rounded-2xl shadow-xl py-2 z-50">
                      <button
                        onClick={() => navigate('/user/profile')}
                        className="flex items-center gap-3 px-5 py-3 hover:bg-[#F5EFE6] dark:hover:bg-[#1A1208] text-sm w-full text-left"
                      >
                        <User className="w-4 h-4" /> Profile
                      </button>
                      <button
                        onClick={() => navigate('/user/settings')}
                        className="flex items-center gap-3 px-5 py-3 hover:bg-[#F5EFE6] dark:hover:bg-[#1A1208] text-sm w-full text-left"
                      >
                        <Settings className="w-4 h-4" /> Settings
                      </button>
                      <hr className="my-1 border-[#DDD0B8] dark:border-[#4A3520]" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-5 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm"
                      >
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/login')}
                    className="px-5 py-2 text-sm font-medium text-[#2C1A0E] dark:text-[#F0E6D3] hover:text-[#8B5E3C]"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigate('/register')}
                    className="px-6 py-2 text-sm font-medium bg-[#8B5E3C] hover:bg-[#6B3F22] text-white rounded-2xl transition"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navbar */}
      <nav className="md:hidden bg-white dark:bg-[#231608] border-b border-[#DDD0B8] dark:border-[#4A3520] sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 h-16">
          <Link
            to="/user/home"
            className="flex items-center gap-2"
            onClick={closeMobileMenu}
          >
            <BookOpen className="w-7 h-7 text-[#8B5E3C]" />
            <span className="text-xl font-bold text-[#2C1A0E] dark:text-[#F0E6D3]">
              BookForYou
            </span>
          </Link>

          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-xl hover:bg-[#F5EFE6] dark:hover:bg-[#1A1208]"
          >
            {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-40"
            onClick={closeMobileMenu}
          />
        )}

        {/* Mobile Menu */}
        <div
          className={`fixed top-0 right-0 h-full w-72 bg-white dark:bg-[#231608] shadow-2xl z-50 transform transition-transform duration-300 ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="p-6">
            <div className="flex justify-end">
              <button onClick={closeMobileMenu} className="p-2">
                <X size={28} />
              </button>
            </div>

            {/* Nav Items */}
            <div className="mt-8 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    item.onClick();
                    closeMobileMenu();
                  }}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive(item.path)
                      ? 'bg-[#EDE4D3] text-[#8B5E3C]'
                      : 'text-[#2C1A0E] dark:text-[#F0E6D3] hover:bg-[#F5EFE6] dark:hover:bg-[#1A1208]'
                  }`}
                >
                  {item.icon} {item.name}
                </button>
              ))}
            </div>

            {/* Auth */}
            <div className="mt-10 pt-6 border-t border-[#DDD0B8] dark:border-[#4A3520] flex flex-col gap-3">
              {isAuth ? (
                <>
                  <div className="flex items-center gap-3 px-4">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#8B5E3C] to-[#C9A87C] flex items-center justify-center text-white font-bold text-xl">
                      {user?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="font-medium">{user?.name}</p>
                      <p className="text-xs text-[#A0856A]">{user?.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      closeMobileMenu();
                      navigate('/user/profile');
                    }}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-[#F5EFE6] dark:hover:bg-[#1A1208] text-sm w-full text-left"
                  >
                    <User className="w-4 h-4" /> Profile
                  </button>
                  <button
                    onClick={() => {
                      closeMobileMenu();
                      navigate('/user/settings');
                    }}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-[#F5EFE6] dark:hover:bg-[#1A1208] text-sm w-full text-left"
                  >
                    <Settings className="w-4 h-4" /> Settings
                  </button>

                  <button
                    onClick={() => {
                      handleLogout();
                      closeMobileMenu();
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3 text-red-600 hover:bg-red-50 rounded-2xl"
                  >
                    <LogOut size={20} />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      navigate('/login');
                      closeMobileMenu();
                    }}
                    className="w-full py-3 text-center font-medium rounded-2xl hover:bg-[#F5EFE6]"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      navigate('/register');
                      closeMobileMenu();
                    }}
                    className="w-full py-3 text-center font-medium rounded-2xl bg-[#8B5E3C] text-white hover:bg-[#6B3F22]"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
