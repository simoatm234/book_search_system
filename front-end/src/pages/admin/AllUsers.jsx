import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '../../Services/App/slice/Dispatches/UserDispatch';
import { useSelector } from 'react-redux';
import {
  Mail,
  Shield,
  User,
  CheckCircle,
  XCircle,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  RotateCcw,
  Trash,
  Archive,
  Users,
} from 'lucide-react';
import { useNotif } from '../../Services/App/slice/Dispatches/NotifDispatch';
import ViewUserDetail from '../../components/admin/ViewUserDetail';
import UpdateUserInfo from '../../components/admin/UpdateUserInfo';
import SmullLoading from '../../components/admin/SmullLoading';

export default function AllUsers() {
  const {
    fetchAllUsers,
    fetchAllUsersTrashed,
    UpdateUser,
    ForcDeleteUser,
    DeleteUser,
    restorUser,
  } = useUser();
  const { showMessage } = useNotif();
  const { users, deletedUsers, loading } = useSelector((state) => state.user);
  const [showTrashed, setShowTrashed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewDetails, setViewDetails] = useState({ show: false, id: null });
  const [updateUser, setUpdateUser] = useState({ show: false, id: null });
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef(null);

  // Refresh both user lists
  const refreshUsers = async () => {
    await Promise.all([fetchAllUsers(), fetchAllUsersTrashed()]);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        await refreshUsers();
      } catch (error) {
        showMessage({
          message:
            error?.response?.data?.message ||
            error?.message ||
            'Failed to fetch users!',
          type: 'error',
        });
      }
    };
    fetchUsers();
  }, []);

  // Get displayed users based on toggle
  const displayedUsers = showTrashed ? deletedUsers || [] : users || [];

  const filteredUsers = displayedUsers?.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const confirmAccount = async (id) => {
    try {
      const data = { confirmed: 1 }; // Send as 1/0 for backend
      const res = await UpdateUser({ id, data });
      if (res?.payload?.success) {
        showMessage({
          message: res?.payload?.message || 'User confirmed successfully!',
          type: 'success',
        });
        await refreshUsers();
      }
    } catch (error) {
      console.error('Confirm user error:', error);
      showMessage({
        message:
          error?.response?.data?.message ||
          error?.message ||
          'Failed to confirm user!',
        type: 'error',
      });
    }
  };

  const unconfirmAccount = async (id) => {
    try {
      const data = { confirmed: 0 };
      const res = await UpdateUser({ id, data });
      if (res?.payload?.success) {
        showMessage({
          message: res?.payload?.message || 'User unconfirmed successfully!',
          type: 'success',
        });
        await refreshUsers();
      }
    } catch (error) {
      console.error('Unconfirm user error:', error);
      showMessage({
        message:
          error?.response?.data?.message ||
          error?.message ||
          'Failed to unconfirm user!',
        type: 'error',
      });
    }
  };

  const softDeleteUser = async (id) => {
    if (!confirm('Are you sure you want to deactivate this user?')) return;
    try {
      const res = await DeleteUser(id);
      if (res?.payload?.success) {
        showMessage({
          message: res?.payload?.message || 'User deactivated successfully!',
          type: 'success',
        });
        await refreshUsers();
      }
    } catch (error) {
      console.error('Soft delete user error:', error);
      showMessage({
        message: error?.message || 'Failed to deactivate user!',
        type: 'error',
      });
    }
  };

  const forceDeleteUser = async (id) => {
    if (
      !confirm(
        'Are you sure you want to permanently delete this user? This action cannot be undone!'
      )
    )
      return;
    try {
      const res = await ForcDeleteUser(id);
      if (res?.payload?.success) {
        showMessage({
          message: res?.payload?.message || 'User permanently deleted!',
          type: 'success',
        });
        await refreshUsers();
      }
    } catch (error) {
      console.error('Force delete user error:', error);
      showMessage({
        message: error?.message || 'Failed to delete user!',
        type: 'error',
      });
    }
  };

  const restoreDeletedUser = async (id) => {
    try {
      const res = await restorUser(id);
      if (res?.payload?.success) {
        showMessage({
          message: res?.payload?.message || 'User restored successfully!',
          type: 'success',
        });
        await refreshUsers();
      }
    } catch (error) {
      console.error('Restore user error:', error);
      showMessage({
        message: error?.message || 'Failed to restore user!',
        type: 'error',
      });
    }
  };

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800';
      default:
        return 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800';
    }
  };

  const toggleDropdown = (userId, event) => {
    if (openDropdownId === userId) {
      setOpenDropdownId(null);
    } else {
      const rect = event.currentTarget.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX - 200,
      });
      setOpenDropdownId(userId);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDFAF4] via-[#F9F4ED] to-[#F5EFE6] dark:from-[#0F0A05] dark:via-[#1A1208] dark:to-[#231608] p-4 sm:p-6 transition-colors duration-300">
      {viewDetails.show && (
        <ViewUserDetail
          id={viewDetails.id}
          onClose={() => setViewDetails({ show: false, id: null })}
        />
      )}
      {updateUser.show && (
        <UpdateUserInfo
          id={updateUser.id}
          onClose={() => setUpdateUser({ show: false, id: null })}
        />
      )}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white dark:bg-[#231608] border border-[#DDD0B8] dark:border-[#4A3520] rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6 transition-colors duration-300">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
            {/* Left Section with Icon and Title */}
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 lg:w-16 sm:h-14 lg:h-16 rounded-2xl bg-gradient-to-br from-[#8B5E3C] to-[#C9A87C] flex items-center justify-center text-xl sm:text-2xl font-bold text-white shadow-lg flex-shrink-0">
                {showTrashed ? (
                  <Archive className="w-6 h-6 sm:w-7 lg:w-8 sm:h-7 lg:h-8" />
                ) : (
                  <User className="w-6 h-6 sm:w-7 lg:w-8 sm:h-7 lg:h-8" />
                )}
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#2C1A0E] dark:text-[#F0E6D3]">
                  {showTrashed ? 'Deleted Users' : 'All Users'}
                </h1>
                <p className="text-xs sm:text-sm text-[#A0856A] dark:text-[#8A6A4A] mt-0.5 sm:mt-1">
                  {showTrashed
                    ? 'Manage and restore deleted user accounts'
                    : 'Manage and view all registered users'}
                </p>
              </div>
            </div>

            {/* Right Section with Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
              {/* Trashed Users Toggle Button */}
              <button
                onClick={() => setShowTrashed(!showTrashed)}
                className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shadow-md whitespace-nowrap ${
                  showTrashed
                    ? 'bg-amber-600 hover:bg-amber-700 text-white border border-amber-700'
                    : 'bg-[#8B5E3C] hover:bg-[#6B4A2E] text-white border border-[#6B4A2E]'
                }`}
              >
                {showTrashed ? (
                  <>
                    <Users className="w-4 h-4" />
                    <span>All Users</span>
                  </>
                ) : (
                  <>
                    <Archive className="w-4 h-4" />
                    <span>Deleted ({deletedUsers?.length || 0})</span>
                  </>
                )}
              </button>

              {/* Search Bar */}
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A0856A] dark:text-[#8A6A4A]" />
                <input
                  type="text"
                  placeholder={`Search ${showTrashed ? 'deleted' : ''} users...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-64 pl-9 pr-4 py-2.5 bg-white dark:bg-[#1A1208] border border-[#DDD0B8] dark:border-[#4A3520] rounded-xl text-sm text-[#2C1A0E] dark:text-[#F0E6D3] placeholder-[#A0856A]/50 focus:outline-none focus:border-[#8B5E3C] dark:focus:border-[#C9A87C] focus:ring-2 focus:ring-[#8B5E3C]/20 dark:focus:ring-[#C9A87C]/20 transition-all duration-200"
                />
              </div>

              {/* Stats Badge and Logout Button */}
              <div className="flex items-center gap-3">
                <div className="px-3 sm:px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#8B5E3C]/10 to-[#C9A87C]/10 dark:from-[#8B5E3C]/20 dark:to-[#C9A87C]/20 border border-[#DDD0B8] dark:border-[#4A3520]">
                  <p className="text-xs sm:text-sm font-semibold text-[#8B5E3C] dark:text-[#C9A87C] whitespace-nowrap">
                    {showTrashed ? (
                      <>🗑️ Deleted: {displayedUsers?.length || 0}</>
                    ) : (
                      <>👥 Total: {displayedUsers?.length || 0}</>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Optional: Quick Stats Row for Mobile */}
          <div className="flex lg:hidden items-center justify-between mt-4 pt-4 border-t border-[#DDD0B8] dark:border-[#4A3520]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#8B5E3C]/10 dark:bg-[#C9A87C]/10 flex items-center justify-center">
                <Shield className="w-4 h-4 text-[#8B5E3C] dark:text-[#C9A87C]" />
              </div>
              <div>
                <p className="text-xs text-[#A0856A] dark:text-[#8A6A4A]">
                  Admins
                </p>
                <p className="text-sm font-bold text-[#2C1A0E] dark:text-[#F0E6D3]">
                  {users?.filter((u) => u.role === 'admin').length || 0}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#8B5E3C]/10 dark:bg-[#C9A87C]/10 flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-[#8B5E3C] dark:text-[#C9A87C]" />
              </div>
              <div>
                <p className="text-xs text-[#A0856A] dark:text-[#8A6A4A]">
                  Confirmed
                </p>
                <p className="text-sm font-bold text-[#2C1A0E] dark:text-[#F0E6D3]">
                  {users?.filter((u) => u.confirmed && !u.deleted_at).length ||
                    0}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#8B5E3C]/10 dark:bg-[#C9A87C]/10 flex items-center justify-center">
                <Archive className="w-4 h-4 text-[#8B5E3C] dark:text-[#C9A87C]" />
              </div>
              <div>
                <p className="text-xs text-[#A0856A] dark:text-[#8A6A4A]">
                  Deleted
                </p>
                <p className="text-sm font-bold text-[#2C1A0E] dark:text-[#F0E6D3]">
                  {deletedUsers?.length || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table Card */}
        <div className="bg-white dark:bg-[#231608] border border-[#DDD0B8] dark:border-[#4A3520] rounded-2xl shadow-lg overflow-visible transition-colors duration-300 relative">
          {loading && <SmullLoading content={'users'} />}

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F5EFE6] dark:bg-[#1A1208] border-b border-[#DDD0B8] dark:border-[#4A3520]">
                  <th className="px-4 lg:px-6 py-4 text-left">
                    <span className="text-xs font-semibold text-[#8B5E3C] dark:text-[#C9A87C] uppercase tracking-widest">
                      ID
                    </span>
                  </th>
                  <th className="px-4 lg:px-6 py-4 text-left">
                    <span className="text-xs font-semibold text-[#8B5E3C] dark:text-[#C9A87C] uppercase tracking-widest">
                      User
                    </span>
                  </th>
                  <th className="px-4 lg:px-6 py-4 text-left">
                    <span className="text-xs font-semibold text-[#8B5E3C] dark:text-[#C9A87C] uppercase tracking-widest">
                      Email
                    </span>
                  </th>
                  <th className="px-4 lg:px-6 py-4 text-left">
                    <span className="text-xs font-semibold text-[#8B5E3C] dark:text-[#C9A87C] uppercase tracking-widest">
                      Role
                    </span>
                  </th>
                  <th className="px-4 lg:px-6 py-4 text-left">
                    <span className="text-xs font-semibold text-[#8B5E3C] dark:text-[#C9A87C] uppercase tracking-widest">
                      Status
                    </span>
                  </th>
                  {!showTrashed && (
                    <th className="px-4 lg:px-6 py-4 text-left">
                      <span className="text-xs font-semibold text-[#8B5E3C] dark:text-[#C9A87C] uppercase tracking-widest">
                        Confirm
                      </span>
                    </th>
                  )}
                  {showTrashed && (
                    <th className="px-4 lg:px-6 py-4 text-left">
                      <span className="text-xs font-semibold text-[#8B5E3C] dark:text-[#C9A87C] uppercase tracking-widest">
                        Deleted At
                      </span>
                    </th>
                  )}
                  <th className="px-4 lg:px-6 py-4 text-left">
                    <span className="text-xs font-semibold text-[#8B5E3C] dark:text-[#C9A87C] uppercase tracking-widest">
                      Actions
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDD0B8] dark:divide-[#4A3520]">
                {filteredUsers?.map((user, index) => (
                  <tr
                    key={user.id || index}
                    className={`hover:bg-[#F9F4ED] dark:hover:bg-[#1A1208] transition-colors duration-150 ${
                      showTrashed ? 'opacity-90' : ''
                    }`}
                  >
                    <td className="px-4 lg:px-6 py-4">
                      <span className="text-xs lg:text-sm text-[#2C1A0E] dark:text-[#F0E6D3] font-mono">
                        #{user.id?.toString().slice(0, 6) || 'N/A'}
                      </span>
                    </td>
                    <td className="px-4 lg:px-6 py-4">
                      <div className="flex items-center gap-2 lg:gap-3">
                        <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-lg bg-gradient-to-br from-[#8B5E3C] to-[#C9A87C] flex items-center justify-center text-xs lg:text-sm font-bold text-white flex-shrink-0">
                          {user.name?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <div>
                          <p className="text-xs lg:text-sm font-medium text-[#2C1A0E] dark:text-[#F0E6D3] truncate max-w-[100px] lg:max-w-[150px]">
                            {user.name || 'N/A'}
                          </p>
                          <p className="text-xs text-[#A0856A] dark:text-[#8A6A4A] truncate max-w-[100px] lg:max-w-[150px]">
                            @{user.username || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 lg:px-6 py-4">
                      <div className="flex items-center gap-1 lg:gap-2">
                        <Mail className="w-3 h-3 lg:w-4 lg:h-4 text-[#8B5E3C] dark:text-[#C9A87C] flex-shrink-0" />
                        <span className="text-xs lg:text-sm text-[#2C1A0E] dark:text-[#F0E6D3] truncate max-w-[120px] lg:max-w-[180px]">
                          {user.email || 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 lg:px-6 py-4">
                      <span
                        className={`px-2 py-0.5 lg:px-3 lg:py-1 rounded-full text-xs font-semibold border capitalize whitespace-nowrap ${getRoleColor(user.role)}`}
                      >
                        {user.role || 'user'}
                      </span>
                    </td>
                    <td className="px-4 lg:px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span
                          className={`text-xs flex items-center gap-1 ${
                            showTrashed
                              ? 'text-rose-600 dark:text-rose-400'
                              : user.is_auth
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-rose-600 dark:text-rose-400'
                          }`}
                        >
                          {showTrashed ? (
                            <XCircle className="w-3 h-3" />
                          ) : user.is_auth ? (
                            <CheckCircle className="w-3 h-3" />
                          ) : (
                            <XCircle className="w-3 h-3" />
                          )}
                          <span className="hidden lg:inline">
                            {showTrashed
                              ? 'Deactivated'
                              : user.is_auth
                                ? 'Authorized'
                                : 'Unauthorized'}
                          </span>
                          <span className="lg:hidden">
                            {showTrashed
                              ? 'Deactivated'
                              : user.is_auth
                                ? 'Auth'
                                : 'Unauth'}
                          </span>
                        </span>
                      </div>
                    </td>
                    {!showTrashed && (
                      <td className="px-4 lg:px-6 py-4">
                        <div className="flex items-center gap-1 lg:gap-2">
                          <button
                            disabled={!!user.confirmed}
                            onClick={() => confirmAccount(user.id)}
                            className="px-2 lg:px-3 py-1 lg:py-1.5 text-xs font-medium bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 dark:disabled:bg-emerald-800/50 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200 whitespace-nowrap"
                          >
                            Confirm
                          </button>
                          <button
                            disabled={!user.confirmed}
                            onClick={() => unconfirmAccount(user.id)}
                            className="px-2 lg:px-3 py-1 lg:py-1.5 text-xs font-medium bg-amber-600 hover:bg-amber-700 disabled:bg-amber-300 dark:disabled:bg-amber-800/50 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200 whitespace-nowrap"
                          >
                            Unconfirm
                          </button>
                        </div>
                      </td>
                    )}
                    {showTrashed && (
                      <td className="px-4 lg:px-6 py-4">
                        <span className="text-xs text-[#A0856A] dark:text-[#8A6A4A]">
                          {user.deleted_at
                            ? new Date(user.deleted_at).toLocaleDateString()
                            : 'N/A'}
                        </span>
                      </td>
                    )}
                    <td className="px-4 lg:px-6 py-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleDropdown(user.id, e);
                        }}
                        className="p-1.5 rounded-lg hover:bg-[#DDD0B8] dark:hover:bg-[#4A3520] transition-colors duration-200"
                      >
                        <MoreVertical className="w-4 h-4 text-[#A0856A] dark:text-[#8A6A4A]" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-[#DDD0B8] dark:divide-[#4A3520]">
            {filteredUsers?.map((user, index) => (
              <div
                key={user.id || index}
                className={`p-4 hover:bg-[#F9F4ED] dark:hover:bg-[#1A1208] transition-colors duration-150 ${
                  showTrashed ? 'opacity-90' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B5E3C] to-[#C9A87C] flex items-center justify-center text-base font-bold text-white flex-shrink-0">
                      {user.name?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#2C1A0E] dark:text-[#F0E6D3]">
                        {user.name || 'N/A'}
                      </h3>
                      <p className="text-xs text-[#A0856A] dark:text-[#8A6A4A]">
                        @{user.username || 'N/A'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleDropdown(user.id, e);
                    }}
                    className="p-1.5 rounded-lg hover:bg-[#DDD0B8] dark:hover:bg-[#4A3520] transition-colors duration-200"
                  >
                    <MoreVertical className="w-4 h-4 text-[#A0856A] dark:text-[#8A6A4A]" />
                  </button>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-[#8B5E3C] dark:text-[#C9A87C] flex-shrink-0" />
                    <span className="text-xs text-[#2C1A0E] dark:text-[#F0E6D3] break-all">
                      {user.email || 'N/A'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-[#8B5E3C] dark:text-[#C9A87C] flex-shrink-0" />
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold border capitalize ${getRoleColor(user.role)}`}
                    >
                      {user.role || 'user'}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`text-xs flex items-center gap-1 px-2 py-0.5 rounded-full border ${
                        showTrashed
                          ? 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800'
                          : user.is_auth
                            ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                            : 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800'
                      }`}
                    >
                      {showTrashed ? (
                        <XCircle className="w-3 h-3" />
                      ) : user.is_auth ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        <XCircle className="w-3 h-3" />
                      )}
                      {showTrashed
                        ? 'Deactivated'
                        : user.is_auth
                          ? 'Authorized'
                          : 'Unauthorized'}
                    </span>

                    {!showTrashed && (
                      <span
                        className={`text-xs flex items-center gap-1 px-2 py-0.5 rounded-full border ${
                          user.confirmed
                            ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                            : 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                        }`}
                      >
                        {user.confirmed ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        )}
                        {user.confirmed ? 'Confirmed' : 'Pending'}
                      </span>
                    )}

                    {showTrashed && user.deleted_at && (
                      <span className="text-xs text-[#A0856A] dark:text-[#8A6A4A] px-2 py-0.5">
                        Deleted:{' '}
                        {new Date(user.deleted_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>

                {!showTrashed && (
                  <div className="flex gap-2">
                    <button
                      disabled={!!user.confirmed}
                      onClick={() => confirmAccount(user.id)}
                      className="flex-1 py-2 text-xs font-medium bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 dark:disabled:bg-emerald-800/50 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200"
                    >
                      Confirm
                    </button>
                    <button
                      disabled={!user.confirmed}
                      onClick={() => unconfirmAccount(user.id)}
                      className="flex-1 py-2 text-xs font-medium bg-amber-600 hover:bg-amber-700 disabled:bg-amber-300 dark:disabled:bg-amber-800/50 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200"
                    >
                      Unconfirm
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Empty State */}
          {(!filteredUsers || filteredUsers.length === 0) && !loading && (
            <div className="text-center py-8 sm:py-12 md:py-16 px-4">
              <User className="w-12 h-12 sm:w-16 sm:h-16 text-[#DDD0B8] dark:text-[#4A3520] mx-auto mb-3 sm:mb-4" />
              <p className="text-base sm:text-lg font-medium text-[#2C1A0E] dark:text-[#F0E6D3] mb-1 sm:mb-2">
                No {showTrashed ? 'deleted ' : ''}users found
              </p>
              <p className="text-xs sm:text-sm text-[#A0856A] dark:text-[#8A6A4A]">
                {searchTerm
                  ? 'Try adjusting your search terms'
                  : showTrashed
                    ? 'No deleted users to display.'
                    : 'There are no users to display at the moment.'}
              </p>
            </div>
          )}
        </div>

        {/* Fixed Dropdown Menu */}
        {openDropdownId && (
          <div
            ref={dropdownRef}
            className="fixed bg-white dark:bg-[#231608] border border-[#DDD0B8] dark:border-[#4A3520] rounded-xl shadow-2xl overflow-hidden z-50 w-56"
            style={{
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
            }}
          >
            <div className="py-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setViewDetails({
                    show: true,
                    id: openDropdownId,
                  });
                  setOpenDropdownId(null);
                }}
                className="w-full px-4 py-2 text-left text-sm text-[#2C1A0E] dark:text-[#F0E6D3] hover:bg-[#F5EFE6] dark:hover:bg-[#1A1208] flex items-center gap-2 transition-colors duration-150"
              >
                <Eye className="w-4 h-4 text-[#8B5E3C] dark:text-[#C9A87C]" />
                View Details
              </button>

              {showTrashed ? (
                <>
                  <div className="border-t border-[#DDD0B8] dark:border-[#4A3520] my-1"></div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      restoreDeletedUser(openDropdownId);
                      setOpenDropdownId(null);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 flex items-center gap-2 transition-colors duration-150"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Restore User
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      forceDeleteUser(openDropdownId);
                      setOpenDropdownId(null);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 transition-colors duration-150"
                  >
                    <Trash className="w-4 h-4" />
                    Permanently Delete
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setUpdateUser({
                        show: true,
                        id: openDropdownId,
                      });
                      setOpenDropdownId(null);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-[#2C1A0E] dark:text-[#F0E6D3] hover:bg-[#F5EFE6] dark:hover:bg-[#1A1208] flex items-center gap-2 transition-colors duration-150"
                  >
                    <Edit className="w-4 h-4 text-[#8B5E3C] dark:text-[#C9A87C]" />
                    Edit User
                  </button>
                  <div className="border-t border-[#DDD0B8] dark:border-[#4A3520] my-1"></div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      softDeleteUser(openDropdownId);
                      setOpenDropdownId(null);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 flex items-center gap-2 transition-colors duration-150"
                  >
                    <Trash2 className="w-4 h-4" />
                    Deactivate User
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      forceDeleteUser(openDropdownId);
                      setOpenDropdownId(null);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 transition-colors duration-150"
                  >
                    <Trash className="w-4 h-4" />
                    Permanently Delete
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Footer Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-4 sm:mt-6">
          <div className="bg-white dark:bg-[#231608] border border-[#DDD0B8] dark:border-[#4A3520] rounded-xl p-3 sm:p-4 text-center transition-colors duration-300 hover:bg-[#F9F4ED] dark:hover:bg-[#1A1208]">
            <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-[#8B5E3C] dark:text-[#C9A87C] mx-auto mb-1 sm:mb-2" />
            <p className="text-lg sm:text-2xl font-bold text-[#2C1A0E] dark:text-[#F0E6D3]">
              {users?.filter((u) => u.role === 'admin').length || 0}
            </p>
            <p className="text-xs sm:text-sm text-[#A0856A] dark:text-[#8A6A4A] mt-0.5 sm:mt-1">
              Administrators
            </p>
          </div>

          <div className="bg-white dark:bg-[#231608] border border-[#DDD0B8] dark:border-[#4A3520] rounded-xl p-3 sm:p-4 text-center transition-colors duration-300 hover:bg-[#F9F4ED] dark:hover:bg-[#1A1208]">
            <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-[#8B5E3C] dark:text-[#C9A87C] mx-auto mb-1 sm:mb-2" />
            <p className="text-lg sm:text-2xl font-bold text-[#2C1A0E] dark:text-[#F0E6D3]">
              {users?.filter((u) => u.confirmed && !u.deleted_at).length || 0}
            </p>
            <p className="text-xs sm:text-sm text-[#A0856A] dark:text-[#8A6A4A] mt-0.5 sm:mt-1">
              Confirmed Users
            </p>
          </div>

          <div className="bg-white dark:bg-[#231608] border border-[#DDD0B8] dark:border-[#4A3520] rounded-xl p-3 sm:p-4 text-center transition-colors duration-300 hover:bg-[#F9F4ED] dark:hover:bg-[#1A1208]">
            <Archive className="w-5 h-5 sm:w-6 sm:h-6 text-[#8B5E3C] dark:text-[#C9A87C] mx-auto mb-1 sm:mb-2" />
            <p className="text-lg sm:text-2xl font-bold text-[#2C1A0E] dark:text-[#F0E6D3]">
              {deletedUsers?.length || 0}
            </p>
            <p className="text-xs sm:text-sm text-[#A0856A] dark:text-[#8A6A4A] mt-0.5 sm:mt-1">
              Deleted Users
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
