import React from 'react';
import { MapPin, Church, Eye, Loader2, Users } from 'lucide-react';

interface BaptismRecordsTableProps {
  records: any[];
  loadingMore: boolean;
  hasMore: boolean;
  isDarkMode: boolean;
  formatDate: (date: Date | null) => string;
  setSelectedRecord: (record: any) => void;
  loadMoreRef: React.RefObject<HTMLDivElement>;
}

// Skeleton loading components
const SkeletonRow = ({ isDarkMode }: { isDarkMode: boolean }) => (
  <tr>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className={`h-8 w-8 rounded-full animate-pulse ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="space-y-2">
        <div className={`h-4 rounded w-3/4 animate-pulse ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
        <div className={`h-3 rounded w-1/2 animate-pulse ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className={`h-4 rounded w-20 animate-pulse ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className={`h-4 rounded w-20 animate-pulse ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className={`h-4 rounded w-24 animate-pulse ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className={`h-4 rounded w-28 animate-pulse ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className={`h-8 w-16 rounded animate-pulse ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
    </td>
  </tr>
);

const MobileSkeletonRow = ({ isDarkMode }: { isDarkMode: boolean }) => (
  <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3 flex-1">
        <div className={`h-8 w-8 rounded-full animate-pulse flex-shrink-0 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
        <div className="min-w-0 flex-1 space-y-2">
          <div className={`h-4 rounded w-3/4 animate-pulse ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
          <div className={`h-3 rounded w-1/2 animate-pulse ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
        </div>
      </div>
      <div className={`h-8 w-16 rounded animate-pulse flex-shrink-0 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
    </div>
  </div>
);

export default function BaptismRecordsTable({ 
  records, 
  loadingMore, 
  hasMore, 
  isDarkMode, 
  formatDate, 
  setSelectedRecord,
  loadMoreRef 
}: BaptismRecordsTableProps) {
  return (
    <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl shadow-xl border overflow-hidden`}>
      {/* Desktop View */}
      <div className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y">
            <thead className={isDarkMode ? 'bg-gray-700 divide-gray-600' : 'bg-gradient-to-r from-gray-50 to-gray-100 divide-gray-200'}>
              <tr>
                <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  S/No
                </th>
                <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Name
                </th>
                <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Date of Baptism
                </th>
                <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Date of Birth
                </th>
                <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Place of Baptism
                </th>
                <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Minister
                </th>
                <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className={`${isDarkMode ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200'}`}>
              {records.map((record, index) => (
                <tr 
                  key={record.id} 
                  className={`transition-all duration-200 ${
                    isDarkMode 
                      ? 'hover:bg-gray-700' 
                      : 'hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50'
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold ${
                      isDarkMode 
                        ? 'bg-blue-900 text-blue-300' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {record.sNo || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className={`text-sm font-semibold ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {record.baptismName || 'N/A'}
                      </div>
                      <div className={`text-sm ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {record.otherName && `${record.otherName} `}{record.surname || ''}
                      </div>
                    </div>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-900'
                  }`}>
                    {formatDate(record.dateOfBaptism)}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-900'
                  }`}>
                    {formatDate(record.dateOfBirth)}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-900'
                  }`}>
                    <div className="flex items-center gap-1">
                      <MapPin className={`h-4 w-4 ${
                        isDarkMode ? 'text-gray-500' : 'text-gray-400'
                      }`} />
                      {record.placeOfBaptism || 'N/A'}
                    </div>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-900'
                  }`}>
                    {record.nameOfMinister || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => setSelectedRecord(record)}
                      className="inline-flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md"
                      title="View record details"
                    >
                      <Eye className="h-4 w-4" />
                      <span className="font-medium">View</span>
                    </button>
                  </td>
                </tr>
              ))}
              
              {/* Skeleton loading for infinite scroll */}
              {loadingMore && Array.from({ length: 3 }).map((_, index) => (
                <SkeletonRow key={`skeleton-${index}`} isDarkMode={isDarkMode} />
              ))}
              
              {/* Load more trigger */}
              {hasMore && !loadingMore && (
                <tr>
                  <td colSpan={7} className="px-6 py-4">
                    <div ref={loadMoreRef} className="text-center">
                      <div className="h-2 w-full"></div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile View - Simplified */}
      <div className="md:hidden">
        <div className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
          {records.map((record, index) => (
            <div 
              key={record.id} 
              className={`p-4 transition-all duration-200 ${
                isDarkMode 
                  ? 'hover:bg-gray-700' 
                  : 'hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1">
                  <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold flex-shrink-0 ${
                    isDarkMode 
                      ? 'bg-blue-900 text-blue-300' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {record.sNo || 'N/A'}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className={`text-sm font-semibold truncate ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {record.baptismName || 'N/A'} {record.surname || ''}
                    </div>
                    {record.otherName && (
                      <div className={`text-sm truncate ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {record.otherName}
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedRecord(record)}
                  className="inline-flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md flex-shrink-0"
                  title="View record details"
                >
                  <Eye className="h-4 w-4" />
                  <span className="font-medium text-xs">View</span>
                </button>
              </div>
            </div>
          ))}
          
          {/* Mobile skeleton loading */}
          {loadingMore && Array.from({ length: 3 }).map((_, index) => (
            <MobileSkeletonRow key={`mobile-skeleton-${index}`} isDarkMode={isDarkMode} />
          ))}
          
          {/* Mobile load more trigger */}
          {hasMore && !loadingMore && (
            <div ref={loadMoreRef} className="p-4">
              <div className="h-2 w-full"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
