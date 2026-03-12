import React, { useState, useEffect } from 'react';
import { useUser } from '../../Services/App/slice/Dispatches/UserDispatch';
import { useSelector } from 'react-redux';
import {
  History,
  Search,
  ChevronLeft,
  ChevronRight,
  Globe,
  Smartphone,
  Monitor,
  Clock,
  Download,
  User,
  Link as LinkIcon,
} from 'lucide-react';
import { useNotif } from '../../Services/App/slice/Dispatches/NotifDispatch';

export default function Actions() {
  const { fetchAllActions } = useUser();
  const { showMessage } = useNotif();
  const { actions } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchActions = async () => {
      try {
        const res = await fetchAllActions();
        showMessage({
          message: res?.payload?.message || 'Actions fetched successfully!',
          type: 'success',
        });
      } catch (error) {
        showMessage({
          message:
            error?.response?.data?.message ||
            error?.message ||
            'Failed to fetch actions!',
          type: 'error',
        });
      }
    };
    fetchActions();
  }, []);

  // Filter actions based on search and date range
  const filteredActions =
    actions?.filter((action) => {
      const matchesSearch =
        action.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        action.ip_address?.includes(searchTerm) ||
        action.url?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        action.user_id?.toString().includes(searchTerm) ||
        action.action?.toLowerCase().includes(searchTerm.toLowerCase());

      const actionDate = new Date(action.created_at);
      const matchesDateRange =
        (!dateRange.start || actionDate >= new Date(dateRange.start)) &&
        (!dateRange.end || actionDate <= new Date(dateRange.end));

      return matchesSearch && matchesDateRange;
    }) || [];

  // Pagination
  const totalPages = Math.ceil(filteredActions.length / itemsPerPage);
  const paginatedActions = filteredActions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getDeviceIcon = (userAgent) => {
    if (!userAgent) return <Monitor className="w-4 h-4" />;
    if (userAgent.toLowerCase().includes('mobile'))
      return <Smartphone className="w-4 h-4" />;
    return <Monitor className="w-4 h-4" />;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDFAF4] via-[#F9F4ED] to-[#F5EFE6] dark:from-[#0F0A05] dark:via-[#1A1208] dark:to-[#231608] p-4 sm:p-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header Card */}
        <div className="bg-white dark:bg-[#231608] border border-[#DDD0B8] dark:border-[#4A3520] rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6 transition-colors duration-300">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-[#8B5E3C] to-[#C9A87C] flex items-center justify-center text-xl sm:text-2xl font-bold text-white shadow-lg flex-shrink-0">
                <History className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#2C1A0E] dark:text-[#F0E6D3]">
                  User Actions
                </h1>
                <p className="text-xs sm:text-sm text-[#A0856A] dark:text-[#8A6A4A] mt-1">
                  Monitor and track all user activities
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-3 sm:px-4 py-2 rounded-xl bg-[#8B5E3C]/10 dark:bg-[#C9A87C]/10 border border-[#DDD0B8] dark:border-[#4A3520]">
                <p className="text-xs sm:text-sm font-semibold text-[#8B5E3C] dark:text-[#C9A87C] whitespace-nowrap">
                  Total: {actions?.length || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A0856A] dark:text-[#8A6A4A]" />
              <input
                type="text"
                placeholder="Search by description, IP, URL, action..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white dark:bg-[#1A1208] border border-[#DDD0B8] dark:border-[#4A3520] rounded-xl text-sm text-[#2C1A0E] dark:text-[#F0E6D3] placeholder-[#A0856A]/50 focus:outline-none focus:border-[#8B5E3C] dark:focus:border-[#C9A87C] transition-colors duration-200"
              />
            </div>

            {/* Date Range */}
            <div className="flex gap-2">
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, start: e.target.value }))
                }
                className="flex-1 px-3 py-2 bg-white dark:bg-[#1A1208] border border-[#DDD0B8] dark:border-[#4A3520] rounded-xl text-sm text-[#2C1A0E] dark:text-[#F0E6D3] focus:outline-none focus:border-[#8B5E3C] dark:focus:border-[#C9A87C] transition-colors duration-200"
                placeholder="Start date"
              />
            </div>
          </div>
        </div>

        {/* Actions Table */}
        <div className="bg-white dark:bg-[#231608] border border-[#DDD0B8] dark:border-[#4A3520] rounded-2xl shadow-lg overflow-hidden transition-colors duration-300">
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
                      Action
                    </span>
                  </th>
                  <th className="px-4 lg:px-6 py-4 text-left">
                    <span className="text-xs font-semibold text-[#8B5E3C] dark:text-[#C9A87C] uppercase tracking-widest">
                      Description
                    </span>
                  </th>
                  <th className="px-4 lg:px-6 py-4 text-left">
                    <span className="text-xs font-semibold text-[#8B5E3C] dark:text-[#C9A87C] uppercase tracking-widest">
                      IP & Device
                    </span>
                  </th>
                  <th className="px-4 lg:px-6 py-4 text-left">
                    <span className="text-xs font-semibold text-[#8B5E3C] dark:text-[#C9A87C] uppercase tracking-widest">
                      URL
                    </span>
                  </th>
                  <th className="px-4 lg:px-6 py-4 text-left">
                    <span className="text-xs font-semibold text-[#8B5E3C] dark:text-[#C9A87C] uppercase tracking-widest">
                      Timestamp
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDD0B8] dark:divide-[#4A3520]">
                {paginatedActions.map((action) => (
                  <tr
                    key={action.id}
                    className="hover:bg-[#F9F4ED] dark:hover:bg-[#1A1208] transition-colors duration-150"
                  >
                    <td className="px-4 lg:px-6 py-4">
                      <span className="text-xs lg:text-sm text-[#2C1A0E] dark:text-[#F0E6D3] font-mono">
                        #{action.id}
                      </span>
                    </td>
                    <td className="px-4 lg:px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-[#8B5E3C] dark:text-[#C9A87C]" />
                        <span className="text-xs lg:text-sm text-[#2C1A0E] dark:text-[#F0E6D3] font-mono">
                          #{action.user_id}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 lg:px-6 py-4">
                      <span className="text-xs lg:text-sm font-medium text-[#2C1A0E] dark:text-[#F0E6D3]">
                        {action.action}
                      </span>
                    </td>
                    <td className="px-4 lg:px-6 py-4">
                      <p className="text-xs lg:text-sm text-[#2C1A0E] dark:text-[#F0E6D3] max-w-xs truncate">
                        {action.description}
                      </p>
                    </td>
                    <td className="px-4 lg:px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-[#A0856A] dark:text-[#8A6A4A]">
                          {action.ip_address}
                        </span>
                        <div className="flex items-center gap-1 text-[#A0856A] dark:text-[#8A6A4A]">
                          {getDeviceIcon(action.user_agent)}
                          <span className="text-xs truncate max-w-[100px]">
                            {action.user_agent?.split(' ')[0] || 'Unknown'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 lg:px-6 py-4">
                      <div className="flex items-center gap-2">
                        <LinkIcon className="w-4 h-4 text-[#8B5E3C] dark:text-[#C9A87C] flex-shrink-0" />
                        <span className="text-xs lg:text-sm text-[#2C1A0E] dark:text-[#F0E6D3] truncate max-w-[150px] block">
                          {action.url}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 lg:px-6 py-4">
                      <div className="flex items-center gap-1 text-[#A0856A] dark:text-[#8A6A4A]">
                        <Clock className="w-3 h-3" />
                        <span className="text-xs">
                          {formatDate(action.created_at)}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-[#DDD0B8] dark:divide-[#4A3520]">
            {paginatedActions.map((action) => (
              <div
                key={action.id}
                className="p-4 hover:bg-[#F9F4ED] dark:hover:bg-[#1A1208] transition-colors duration-150"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-[#A0856A] dark:text-[#8A6A4A]">
                      #{action.id}
                    </span>
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3 text-[#8B5E3C] dark:text-[#C9A87C]" />
                      <span className="text-xs font-mono text-[#A0856A] dark:text-[#8A6A4A]">
                        #{action.user_id}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action & Description */}
                <div className="mb-2">
                  <p className="text-sm font-bold text-[#2C1A0E] dark:text-[#F0E6D3]">
                    {action.action}
                  </p>
                  <p className="text-xs text-[#2C1A0E] dark:text-[#F0E6D3] mt-1">
                    {action.description}
                  </p>
                </div>

                {/* URL */}
                <div className="mb-2">
                  <div className="flex items-center gap-1">
                    <LinkIcon className="w-3 h-3 text-[#8B5E3C] dark:text-[#C9A87C]" />
                    <p className="text-xs text-[#2C1A0E] dark:text-[#F0E6D3] break-all">
                      {action.url}
                    </p>
                  </div>
                </div>

                {/* IP & Device */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[#A0856A] dark:text-[#8A6A4A]">
                    <Globe className="w-3 h-3" />
                    <span className="text-xs">{action.ip_address}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[#A0856A] dark:text-[#8A6A4A]">
                    {getDeviceIcon(action.user_agent)}
                    <span className="text-xs truncate max-w-[100px]">
                      {action.user_agent?.split(' ')[0] || 'Unknown'}
                    </span>
                  </div>
                </div>

                {/* Timestamp */}
                <div className="flex items-center gap-1 text-[#A0856A] dark:text-[#8A6A4A] mt-2">
                  <Clock className="w-3 h-3" />
                  <span className="text-xs">
                    {formatDate(action.created_at)}
                  </span>
                </div>

                {/* Metadata (if exists) */}
                {action.metadata && Object.keys(action.metadata).length > 0 && (
                  <div className="mt-2 pt-2 border-t border-[#DDD0B8] dark:border-[#4A3520]">
                    <details className="text-xs">
                      <summary className="text-[#8B5E3C] dark:text-[#C9A87C] font-semibold cursor-pointer">
                        View Metadata
                      </summary>
                      <pre className="mt-2 p-2 bg-[#F5EFE6] dark:bg-[#1A1208] rounded-lg text-[#2C1A0E] dark:text-[#F0E6D3] overflow-x-auto">
                        {JSON.stringify(action.metadata, null, 2)}
                      </pre>
                    </details>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Empty State */}
          {(!paginatedActions || paginatedActions.length === 0) && (
            <div className="text-center py-8 sm:py-12 md:py-16 px-4">
              <History className="w-12 h-12 sm:w-16 sm:h-16 text-[#DDD0B8] dark:text-[#4A3520] mx-auto mb-3 sm:mb-4" />
              <p className="text-base sm:text-lg font-medium text-[#2C1A0E] dark:text-[#F0E6D3] mb-1 sm:mb-2">
                No actions found
              </p>
              <p className="text-xs sm:text-sm text-[#A0856A] dark:text-[#8A6A4A]">
                {searchTerm || dateRange.start || dateRange.end
                  ? 'Try adjusting your filters'
                  : 'There are no user actions to display at the moment.'}
              </p>
            </div>
          )}

          {/* Pagination */}
          {filteredActions.length > 0 && (
            <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-t border-[#DDD0B8] dark:border-[#4A3520]">
              <p className="text-xs sm:text-sm text-[#A0856A] dark:text-[#8A6A4A]">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                {Math.min(currentPage * itemsPerPage, filteredActions.length)}{' '}
                of {filteredActions.length} actions
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg hover:bg-[#F5EFE6] dark:hover:bg-[#1A1208] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <ChevronLeft className="w-4 h-4 text-[#A0856A] dark:text-[#8A6A4A]" />
                </button>
                <span className="text-xs sm:text-sm text-[#2C1A0E] dark:text-[#F0E6D3]">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg hover:bg-[#F5EFE6] dark:hover:bg-[#1A1208] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <ChevronRight className="w-4 h-4 text-[#A0856A] dark:text-[#8A6A4A]" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-4 sm:mt-6">
          <div className="bg-white dark:bg-[#231608] border border-[#DDD0B8] dark:border-[#4A3520] rounded-xl p-3 sm:p-4 text-center transition-colors duration-300 hover:bg-[#F9F4ED] dark:hover:bg-[#1A1208]">
            <History className="w-4 h-4 sm:w-5 sm:h-5 text-[#8B5E3C] dark:text-[#C9A87C] mx-auto mb-1 sm:mb-2" />
            <p className="text-sm sm:text-base font-bold text-[#2C1A0E] dark:text-[#F0E6D3]">
              {actions?.length || 0}
            </p>
            <p className="text-xs text-[#A0856A] dark:text-[#8A6A4A] mt-0.5 sm:mt-1">
              Total Actions
            </p>
          </div>

          <div className="bg-white dark:bg-[#231608] border border-[#DDD0B8] dark:border-[#4A3520] rounded-xl p-3 sm:p-4 text-center transition-colors duration-300 hover:bg-[#F9F4ED] dark:hover:bg-[#1A1208]">
            <User className="w-4 h-4 sm:w-5 sm:h-5 text-[#8B5E3C] dark:text-[#C9A87C] mx-auto mb-1 sm:mb-2" />
            <p className="text-sm sm:text-base font-bold text-[#2C1A0E] dark:text-[#F0E6D3]">
              {new Set(actions?.map((a) => a.user_id)).size || 0}
            </p>
            <p className="text-xs text-[#A0856A] dark:text-[#8A6A4A] mt-0.5 sm:mt-1">
              Active Users
            </p>
          </div>

          <div className="bg-white dark:bg-[#231608] border border-[#DDD0B8] dark:border-[#4A3520] rounded-xl p-3 sm:p-4 text-center transition-colors duration-300 hover:bg-[#F9F4ED] dark:hover:bg-[#1A1208]">
            <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-[#8B5E3C] dark:text-[#C9A87C] mx-auto mb-1 sm:mb-2" />
            <p className="text-sm sm:text-base font-bold text-[#2C1A0E] dark:text-[#F0E6D3]">
              {new Set(actions?.map((a) => a.ip_address)).size || 0}
            </p>
            <p className="text-xs text-[#A0856A] dark:text-[#8A6A4A] mt-0.5 sm:mt-1">
              Unique IPs
            </p>
          </div>

          <div className="bg-white dark:bg-[#231608] border border-[#DDD0B8] dark:border-[#4A3520] rounded-xl p-3 sm:p-4 text-center transition-colors duration-300 hover:bg-[#F9F4ED] dark:hover:bg-[#1A1208]">
            <LinkIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#8B5E3C] dark:text-[#C9A87C] mx-auto mb-1 sm:mb-2" />
            <p className="text-sm sm:text-base font-bold text-[#2C1A0E] dark:text-[#F0E6D3]">
              {new Set(actions?.map((a) => a.url)).size || 0}
            </p>
            <p className="text-xs text-[#A0856A] dark:text-[#8A6A4A] mt-0.5 sm:mt-1">
              Unique URLs
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
