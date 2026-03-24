import React, { useEffect } from 'react';
import { useBook } from '../../Services/App/slice/Dispatches/BookDispatch';
import { useNotif } from '../../Services/App/slice/Dispatches/NotifDispatch';
import { useSelector } from 'react-redux';
import { Loader2, BookOpen, Eye, Download } from 'lucide-react';
import SmullLoading from '../../components/admin/SmullLoading';

export default function AllUserBook() {
  const { allUserBook } = useBook();
  const { showMessage } = useNotif();
  const { UserBooks, loading } = useSelector((state) => state.books);

  useEffect(() => {
    const fetchUserBooks = async () => {
      try {
        const res = await allUserBook();
        // The response now contains pagination metadata and a `data` array
        showMessage({
          message: res?.payload?.message || 'User books loaded!',
          type: 'success',
        });
      } catch (error) {
        console.log(error);
        showMessage({
          message: error.message || 'Failed to load user books!',
          type: 'error',
        });
      }
    };

    fetchUserBooks();
  }, []);

  const getActionUI = (action) => {
    switch (action) {
      case 'read':
        return {
          label: 'Read',
          icon: <Eye className="w-3 h-3" />,
          style:
            'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-300',
        };
      case 'downloaded':
        return {
          label: 'Downloaded',
          icon: <Download className="w-3 h-3" />,
          style:
            'bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-300',
        };
      default:
        return {
          label: action,
          icon: null,
          style:
            'bg-gray-100 text-gray-600 border border-gray-200 dark:bg-gray-800 dark:text-gray-300',
        };
    }
  };

  // The actual list of user book records is inside UserBooks.data (paginated response)
  const userBooksList = UserBooks?.data || [];

  return (
    <div className="min-h-screen bg-[#F4F0E6] dark:bg-[#1A1208]">
      {/* Header */}
      <div className="bg-[#FDFAF4] dark:bg-[#231608] border-b border-[#DDD0B8] px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#EDE4D3] border border-[#C9A87C] flex items-center justify-center">
            <BookOpen className="text-[#8B5E3C] w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#2C1A0E] dark:text-[#F0E6D3]">
              User Books Activity
            </h1>
            <p className="text-sm text-[#A0856A]">
              {UserBooks?.total || 0} records
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="max-w-7xl mx-auto px-6 py-8 relative">
        {/* Loading */}
        {loading && <SmullLoading content={'user books'} />}

        <div>
          <div className="bg-[#FDFAF4] dark:bg-[#231608] border border-[#DDD0B8] rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#EDE4D3] border-b border-[#DDD0B8]">
                    <th className="px-6 py-4 text-left text-xs font-semibold">
                      #
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold">
                      Book
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold">
                      Action
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold">
                      Action At
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold">
                      Created
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#DDD0B8]">
                  {userBooksList.map((ub) => {
                    const actionUI = getActionUI(ub.action);

                    return (
                      <tr
                        key={ub.id}
                        className="hover:bg-[#F4F0E6] dark:hover:bg-[#1A1208] transition"
                      >
                        <td className="px-6 py-4 text-sm font-medium text-[#8B5E3C]">
                          #{ub.id}
                        </td>
                        <td className="px-6 py-4 text-sm text-[#2C1A0E] dark:text-[#F0E6D3]">
                          {ub.user?.name || 'Unknown'}
                        </td>
                        <td className="px-6 py-4 text-sm text-[#A0856A]">
                          {ub.book?.title || 'No title'}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div
                            className={`inline-flex items-center gap-1 px-3 py-1 border rounded-full text-xs font-medium ${actionUI.style}`}
                          >
                            {actionUI.icon}
                            {actionUI.label}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {ub.action_at
                            ? new Date(ub.action_at).toLocaleString()
                            : '-'}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {ub.created_at
                            ? new Date(ub.created_at).toLocaleString()
                            : '-'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Empty state */}
          {userBooksList.length === 0 && !loading && (
            <div className="text-center py-10 text-[#A0856A]">
              No activity found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
