import React, { useState, useEffect } from 'react';
import { useUser } from '../../Services/App/slice/Dispatches/UserDispatch';
import { useSelector } from 'react-redux';
import {
  Mail,
  Shield,
  User,
  CheckCircle,
  XCircle,
  LogOut,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  ChevronDown,
} from 'lucide-react';
import { useNotif } from '../../Services/App/slice/Dispatches/NotifDispatch';
import StoreUser from '../../components/admin/StoreUser';
import ViewUserDetail from '../../components/admin/ViewUserDetail';
import UpdateUserInfo from '../../components/admin/UpdateUserInfo';

export default function AllUsers() {
  const { fetchAllUsers, UpdateUser } = useUser();
  const { showMessage } = useNotif();
  const { users } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewDetails, setViewDetails] = useState({ show: false, id: null });
  const [updateUser, setUpdateUser] = useState({ show: false, id: null });
  const [openDropdownId, setOpenDropdownId] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetchAllUsers();
        showMessage({
          message: res?.payload.message || 'users fetched successfuly!',
          type: 'success',
        });
      } catch (error) {
        showMessage({
          message:
            error?.response?.data?.message ||
            error?.message ||
            'Failed to change password!',
          type: 'error',
        });
      }
    };
    fetchUsers();
  }, []);

  const confirmAcount = async (id) => {
    try {
      const data = { confirmed: true };
      const res = await UpdateUser({ id, data });
      if (res?.payload.success) {
        showMessage({
          message: res?.payload.message || 'Profile updated successfully!',
          type: 'success',
        });
        return res;
      }
    } catch (error) {
      console.error('Update profile error:', error);
      showMessage({
        message:
          error?.response?.data?.message ||
          error?.message ||
          'Failed to confirm user!',
        type: 'error',
      });
      throw error;
    }
  };

  const inconfirmAcount = async (id) => {
    try {
      const data = { confirmed: false };
      const res = await UpdateUser({ id, data });
      if (res?.payload.success) {
        showMessage({
          message: res?.payload.message || 'Profile updated successfully!',
          type: 'success',
        });
        return res;
      }
    } catch (error) {
      console.error('Update profile error:', error);
      showMessage({
        message:
          error?.response?.data?.message ||
          error?.message ||
          'Failed to confirm user!',
        type: 'error',
      });
      throw error;
    }
  };
  const dropUser = async (id) => {
    try {
      if (confirm('are you shur')) {
        //   const res = await Api.logout(user.id);
        //   if (res.status == 200 || res.status == 201) {
        //     navigate('/login');
        //   }
      }
      return;
    } catch (error) {
      console.error(' logout failed :', error);
    }
  };

  const filteredUsers = users?.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800';
      case 'librarian':
        return 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
      default:
        return 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800';
    }
  };

  // Toggle dropdown
  const toggleDropdown = (userId) => {
    setOpenDropdownId(openDropdownId === userId ? null : userId);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenDropdownId(null);
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
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-[#8B5E3C] to-[#C9A87C] flex items-center justify-center text-xl sm:text-2xl font-bold text-white shadow-lg flex-shrink-0">
                <User className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#2C1A0E] dark:text-[#F0E6D3]">
                  All Users
                </h1>
                <p className="text-xs sm:text-sm text-[#A0856A] dark:text-[#8A6A4A] mt-1">
                  Manage and view all registered users
                </p>
              </div>
            </div>

            {/* StoreUser component integrated */}
            <div className="lg:order-last">
              <StoreUser />
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
              {/* Search Bar - Responsive */}
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A0856A] dark:text-[#8A6A4A]" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-64 pl-9 pr-4 py-2 bg-white dark:bg-[#1A1208] border border-[#DDD0B8] dark:border-[#4A3520] rounded-xl text-sm text-[#2C1A0E] dark:text-[#F0E6D3] placeholder-[#A0856A]/50 focus:outline-none focus:border-[#8B5E3C] dark:focus:border-[#C9A87C] transition-colors duration-200"
                />
              </div>

              <div className="flex items-center gap-3">
                <div className="px-3 sm:px-4 py-2 rounded-xl bg-[#8B5E3C]/10 dark:bg-[#C9A87C]/10 border border-[#DDD0B8] dark:border-[#4A3520]">
                  <p className="text-xs sm:text-sm font-semibold text-[#8B5E3C] dark:text-[#C9A87C] whitespace-nowrap">
                    Total: {users?.length || 0}
                  </p>
                </div>
                <button className="px-3 sm:px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-800 text-white text-xs sm:text-sm font-semibold transition-colors duration-200 shadow-md flex items-center gap-1.5 sm:gap-2 border border-rose-700 dark:border-rose-600 whitespace-nowrap">
                  <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">
                    Logout from all devices
                  </span>
                  <span className="xs:hidden">Logout All</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table Card - Responsive */}
        <div className="bg-white dark:bg-[#231608] border border-[#DDD0B8] dark:border-[#4A3520] rounded-2xl shadow-lg overflow-hidden transition-colors duration-300">
          {/* Desktop Table View (hidden on mobile) */}
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
                  <th className="px-4 lg:px-6 py-4 text-left">
                    <span className="text-xs font-semibold text-[#8B5E3C] dark:text-[#C9A87C] uppercase tracking-widest">
                      Confirm
                    </span>
                  </th>
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
                    className="hover:bg-[#F9F4ED] dark:hover:bg-[#1A1208] transition-colors duration-150"
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
                          className={`text-xs flex items-center gap-1 ${user.is_auth ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}
                        >
                          {user.is_auth ? (
                            <CheckCircle className="w-3 h-3" />
                          ) : (
                            <XCircle className="w-3 h-3" />
                          )}
                          <span className="hidden lg:inline">
                            {user.is_auth ? 'Authorized' : 'Unauthorized'}
                          </span>
                          <span className="lg:hidden">
                            {user.is_auth ? 'Auth' : 'Unauth'}
                          </span>
                        </span>
                      </div>
                    </td>
                    <td className="px-4 lg:px-6 py-4">
                      <div className="flex items-center gap-1 lg:gap-2">
                        <button
                          disabled={user.confirmed}
                          onClick={() => confirmAcount(user.id)}
                          className="px-2 lg:px-3 py-1 lg:py-1.5 text-xs font-medium bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 dark:disabled:bg-emerald-800/50 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200 whitespace-nowrap"
                        >
                          Confirm
                        </button>
                        <button
                          disabled={!user.confirmed}
                          onClick={() => inconfirmAcount(user.id)}
                          className="px-2 lg:px-3 py-1 lg:py-1.5 text-xs font-medium bg-amber-600 hover:bg-amber-700 disabled:bg-amber-300 dark:disabled:bg-amber-800/50 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200 whitespace-nowrap"
                        >
                          Unconfirm
                        </button>
                      </div>
                    </td>
                    <td className="px-4 lg:px-6 py-4 relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleDropdown(user.id);
                        }}
                        className="p-1.5 rounded-lg hover:bg-[#DDD0B8] dark:hover:bg-[#4A3520] transition-colors duration-200"
                      >
                        <MoreVertical className="w-4 h-4 text-[#A0856A] dark:text-[#8A6A4A]" />
                      </button>

                      {/* Dropdown Menu */}
                      {openDropdownId === user.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#231608] border border-[#DDD0B8] dark:border-[#4A3520] rounded-xl shadow-lg overflow-hidden z-50">
                          <div className="py-1">
                            <button
                              onClick={() => {
                                setViewDetails({
                                  show: true,
                                  id: user.id,
                                });
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-[#2C1A0E] dark:text-[#F0E6D3] hover:bg-[#F5EFE6] dark:hover:bg-[#1A1208] flex items-center gap-2 transition-colors duration-150"
                            >
                              <Eye className="w-4 h-4 text-[#8B5E3C] dark:text-[#C9A87C]" />
                              View Details
                            </button>
                            <button
                              onClick={() => {
                                console.log(updateUser);
                                setUpdateUser({
                                  show: true,
                                  id: user.id,
                                });
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-[#2C1A0E] dark:text-[#F0E6D3] hover:bg-[#F5EFE6] dark:hover:bg-[#1A1208] flex items-center gap-2 transition-colors duration-150"
                            >
                              <Edit className="w-4 h-4 text-[#8B5E3C] dark:text-[#C9A87C]" />
                              Edit User
                            </button>
                            <div className="border-t border-[#DDD0B8] dark:border-[#4A3520] my-1"></div>
                            <button
                              onClick={() => {
                                dropUser(user.id);
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 flex items-center gap-2 transition-colors duration-150"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete User
                            </button>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View (visible on mobile only) */}
          <div className="md:hidden divide-y divide-[#DDD0B8] dark:divide-[#4A3520]">
            {filteredUsers?.map((user, index) => (
              <div
                key={user.id || index}
                className="p-4 hover:bg-[#F9F4ED] dark:hover:bg-[#1A1208] transition-colors duration-150 relative"
              >
                {/* User Header with Actions */}
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

                  {/* Mobile Dropdown */}
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleDropdown(user.id);
                      }}
                      className="p-1.5 rounded-lg hover:bg-[#DDD0B8] dark:hover:bg-[#4A3520] transition-colors duration-200"
                    >
                      <MoreVertical className="w-4 h-4 text-[#A0856A] dark:text-[#8A6A4A]" />
                    </button>

                    {openDropdownId === user.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#231608] border border-[#DDD0B8] dark:border-[#4A3520] rounded-xl shadow-lg overflow-hidden z-50">
                        <div className="py-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenDropdownId(null);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-[#2C1A0E] dark:text-[#F0E6D3] hover:bg-[#F5EFE6] dark:hover:bg-[#1A1208] flex items-center gap-2"
                          >
                            <Eye className="w-4 h-4 text-[#8B5E3C] dark:text-[#C9A87C]" />
                            View Details
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenDropdownId(null);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-[#2C1A0E] dark:text-[#F0E6D3] hover:bg-[#F5EFE6] dark:hover:bg-[#1A1208] flex items-center gap-2"
                          >
                            <Edit className="w-4 h-4 text-[#8B5E3C] dark:text-[#C9A87C]" />
                            Edit User
                          </button>
                          <div className="border-t border-[#DDD0B8] dark:border-[#4A3520] my-1"></div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenDropdownId(null);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 flex items-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete User
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* User Details */}
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
                        user.is_auth
                          ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                          : 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800'
                      }`}
                    >
                      {user.is_auth ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        <XCircle className="w-3 h-3" />
                      )}
                      {user.is_auth ? 'Authorized' : 'Unauthorized'}
                    </span>
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
                  </div>
                </div>

                {/* Confirm/Unconfirm Buttons */}
                <div className="flex gap-2">
                  <button
                    disabled={user.confirmed}
                    onClick={() => confirmAcount(user.id)}
                    className="flex-1 py-2 text-xs font-medium bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 dark:disabled:bg-emerald-800/50 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200"
                  >
                    Confirm
                  </button>
                  <button
                    disabled={!user.confirmed}
                    onClick={() => inconfirmAcount(user.id)}
                    className="flex-1 py-2 text-xs font-medium bg-amber-600 hover:bg-amber-700 disabled:bg-amber-300 dark:disabled:bg-amber-800/50 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200"
                  >
                    Unconfirm
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State - Responsive */}
          {(!filteredUsers || filteredUsers.length === 0) && (
            <div className="text-center py-8 sm:py-12 md:py-16 px-4">
              <User className="w-12 h-12 sm:w-16 sm:h-16 text-[#DDD0B8] dark:text-[#4A3520] mx-auto mb-3 sm:mb-4" />
              <p className="text-base sm:text-lg font-medium text-[#2C1A0E] dark:text-[#F0E6D3] mb-1 sm:mb-2">
                {searchTerm ? 'No users found' : 'No users found'}
              </p>
              <p className="text-xs sm:text-sm text-[#A0856A] dark:text-[#8A6A4A]">
                {searchTerm
                  ? 'Try adjusting your search terms'
                  : 'There are no users to display at the moment.'}
              </p>
            </div>
          )}
        </div>

        {/* Footer Stats - Responsive Grid */}
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
              {users?.filter((u) => u.confirmed).length || 0}
            </p>
            <p className="text-xs sm:text-sm text-[#A0856A] dark:text-[#8A6A4A] mt-0.5 sm:mt-1">
              Confirmed Users
            </p>
          </div>

          <div className="bg-white dark:bg-[#231608] border border-[#DDD0B8] dark:border-[#4A3520] rounded-xl p-3 sm:p-4 text-center transition-colors duration-300 hover:bg-[#F9F4ED] dark:hover:bg-[#1A1208]">
            <User className="w-5 h-5 sm:w-6 sm:h-6 text-[#8B5E3C] dark:text-[#C9A87C] mx-auto mb-1 sm:mb-2" />
            <p className="text-lg sm:text-2xl font-bold text-[#2C1A0E] dark:text-[#F0E6D3]">
              {users?.filter((u) => !u.confirmed).length || 0}
            </p>
            <p className="text-xs sm:text-sm text-[#A0856A] dark:text-[#8A6A4A] mt-0.5 sm:mt-1">
              Pending Confirmation
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
