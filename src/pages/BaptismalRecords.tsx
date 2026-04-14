import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, User, MapPin, Church, Eye, Loader2, Database, Users } from 'lucide-react';

export default function BaptismalRecords() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const recordsPerPage = 20;

  // Anti-screenshot protection
  useEffect(() => {
    // Disable right-click
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };
    document.addEventListener('contextmenu', handleContextMenu);

    // Disable print
    const handleBeforePrint = (e: Event) => {
      e.preventDefault();
    };
    window.addEventListener('beforeprint', handleBeforePrint);

    // Disable screenshots
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen' || (e.ctrlKey && e.shiftKey && e.key === 'S')) {
        e.preventDefault();
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('beforeprint', handleBeforePrint);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [currentPage, searchTerm]);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: recordsPerPage.toString(),
        search: searchTerm
      });
      
      const response = await fetch(`/api/baptism-records?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch records');
      }
      
      const data = await response.json();
      setRecords(data.records);
      setTotalRecords(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const totalPages = Math.ceil(totalRecords / recordsPerPage);

  if (loading && records.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-700">Loading baptism records...</p>
          <p className="text-sm text-gray-500 mt-2">Please wait while we fetch your data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Baptismal Records
          </h1>
          <p className="text-gray-600 text-base lg:text-lg">
            Search and manage parish baptismal records
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-4 lg:p-6 mb-6">
        <div className="flex flex-col gap-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, serial number, or parents..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200"
            >
              <Filter className="w-4 h-4" />
              <span className="font-medium">Filters</span>
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="border-t pt-4 mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <input
                type="date"
                placeholder="Date from"
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="date"
                placeholder="Date to"
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <select 
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                aria-label="Filter by baptism type"
              >
                <option value="">All Types</option>
                <option value="SOLEMN">Solemn</option>
                <option value="PRIVATE">Private</option>
              </select>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6">
            <div className="flex items-center gap-2">
              <span className="text-red-600">⚠️</span>
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">{records.length}</span> of{' '}
            <span className="font-semibold text-gray-900">{totalRecords.toLocaleString()}</span> records
          </div>
          {searchTerm && (
            <div className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              Filtered by: "{searchTerm}"
            </div>
          )}
        </div>

        {/* Records Table */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Desktop Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-3 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                    S/No
                  </th>
                  <th className="px-3 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                    Name
                  </th>
                  <th className="px-3 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                    Date of Baptism
                  </th>
                  <th className="px-3 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                    Date of Birth
                  </th>
                  <th className="px-3 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                    Place of Baptism
                  </th>
                  <th className="px-3 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                    Minister
                  </th>
                  <th className="px-3 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {records.map((record, index) => (
                  <tr 
                    key={record.id} 
                    className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200"
                  >
                    <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                      <span className="inline-flex items-center justify-center w-6 h-6 lg:w-8 lg:h-8 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                        {record.sNo || 'N/A'}
                      </span>
                    </td>
                    <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                      <div>
                        <div className="text-xs lg:text-sm font-semibold text-gray-900">
                          {record.baptismName || 'N/A'}
                        </div>
                        <div className="text-xs lg:text-sm text-gray-500">
                          {record.otherName && `${record.otherName} `}{record.surname || ''}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm text-gray-900">
                      {formatDate(record.dateOfBaptism)}
                    </td>
                    <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm text-gray-900">
                      {formatDate(record.dateOfBirth)}
                    </td>
                    <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm text-gray-900">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 lg:h-4 lg:w-4 text-gray-400" />
                        <span className="hidden lg:inline">{record.placeOfBaptism || 'N/A'}</span>
                        <span className="lg:hidden truncate max-w-20">{record.placeOfBaptism || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm text-gray-900">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3 lg:h-4 lg:w-4 text-gray-400" />
                        <span className="hidden lg:inline">{record.nameOfMinister || 'N/A'}</span>
                        <span className="lg:hidden truncate max-w-20">{record.nameOfMinister || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm">
                      <button
                        onClick={() => setSelectedRecord(record)}
                        className="inline-flex items-center gap-1 lg:gap-2 px-2 lg:px-3 py-1.5 lg:py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md"
                        title="View record details"
                      >
                        <Eye className="h-3 w-3 lg:h-4 lg:w-4" />
                        <span className="font-medium hidden lg:inline">View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card Layout */}
          <div className="lg:hidden">
            <div className="divide-y divide-gray-200">
              {records.map((record) => (
                <div key={record.id} className="p-4 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                          {record.sNo || 'N/A'}
                        </span>
                        <h3 className="font-semibold text-gray-900 text-sm">
                          {record.baptismName || 'N/A'}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600">
                        {record.otherName && `${record.otherName} `}{record.surname || ''}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedRecord(record)}
                      className="flex-shrink-0 inline-flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                      title="View record details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      <span className="text-gray-500">Baptized:</span>
                      <span className="text-gray-900 font-medium">{formatDate(record.dateOfBaptism)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      <span className="text-gray-500">Born:</span>
                      <span className="text-gray-900 font-medium">{formatDate(record.dateOfBirth)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      <span className="text-gray-500">Place:</span>
                      <span className="text-gray-900 font-medium">{record.placeOfBaptism || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-3 h-3 text-gray-400" />
                      <span className="text-gray-500">Minister:</span>
                      <span className="text-gray-900 font-medium">{record.nameOfMinister || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {records.length === 0 && !loading && (
            <div className="text-center py-16">
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <div className="text-xl text-gray-500 font-medium">No records found</div>
              <p className="text-gray-400 mt-2">Try adjusting your search criteria</p>
            </div>
          )}
        </div>

        {/* Enhanced Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-between bg-white rounded-xl shadow-lg border border-gray-200 p-4">
            <div className="text-sm text-gray-700">
              Page <span className="font-semibold text-blue-600">{currentPage}</span> of{' '}
              <span className="font-semibold text-gray-900">{totalPages}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all duration-200"
              >
                <span>←</span>
                <span className="font-medium">Previous</span>
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-lg font-medium transition-all duration-200 ${
                      currentPage === page
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all duration-200"
              >
                <span className="font-medium">Next</span>
                <span>→</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Church className="h-6 w-6" />
                Baptism Record Details
              </h2>
              <button
                onClick={() => setSelectedRecord(null)}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-1 transition-all duration-200"
                title="Close modal"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Basic Information */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900">
                        <User className="h-5 w-5 text-blue-600" />
                        Basic Information
                      </h3>
                      <div className="space-y-3 bg-gray-50 p-4 rounded-xl">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 font-medium">Serial Number:</span>
                          <span className="font-semibold text-gray-900 bg-blue-100 px-3 py-1 rounded-full text-sm">
                            {selectedRecord.sNo || 'N/A'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 font-medium">Baptism Name:</span>
                          <span className="font-semibold text-gray-900">{selectedRecord.baptismName || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 font-medium">Other Names:</span>
                          <span className="font-semibold text-gray-900">{selectedRecord.otherName || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 font-medium">Surname:</span>
                          <span className="font-semibold text-gray-900">{selectedRecord.surname || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 font-medium">Date of Birth:</span>
                          <span className="font-semibold text-gray-900">{formatDate(selectedRecord.dateOfBirth)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 font-medium">Home Town:</span>
                          <span className="font-semibold text-gray-900">{selectedRecord.homeTown || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Baptism Information */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900">
                        <Church className="h-5 w-5 text-blue-600" />
                        Baptism Information
                      </h3>
                      <div className="space-y-3 bg-blue-50 p-4 rounded-xl">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 font-medium">Date of Baptism:</span>
                          <span className="font-semibold text-blue-900 bg-blue-100 px-3 py-1 rounded-full text-sm">
                            {formatDate(selectedRecord.dateOfBaptism)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 font-medium">Place of Baptism:</span>
                          <span className="font-semibold text-gray-900">{selectedRecord.placeOfBaptism || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 font-medium">Type:</span>
                          <span className="font-semibold text-gray-900 bg-purple-100 px-3 py-1 rounded-full text-sm">
                            {selectedRecord.solemnOrPrivate || 'N/A'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 font-medium">Minister:</span>
                          <span className="font-semibold text-gray-900">{selectedRecord.nameOfMinister || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-start">
                          <span className="text-gray-600 font-medium">God Parents:</span>
                          <span className="font-semibold text-gray-900 text-right">{selectedRecord.nameOfGodParents || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Parents Information */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4 text-gray-900">Parents Information</h3>
                      <div className="space-y-3 bg-green-50 p-4 rounded-xl">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 font-medium">Father's Name:</span>
                          <span className="font-semibold text-gray-900">{selectedRecord.fathersName || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 font-medium">Mother's Name:</span>
                          <span className="font-semibold text-gray-900">{selectedRecord.mothersName || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Other Sacraments */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900">
                        <Calendar className="h-5 w-5 text-blue-600" />
                        Other Sacraments
                      </h3>
                      <div className="space-y-3 bg-indigo-50 p-4 rounded-xl">
                        <div>
                          <div className="text-gray-600 font-medium mb-2">First Holy Communion:</div>
                          <div className="font-semibold text-gray-900">
                            {selectedRecord.firstHolyCommunionDate ? 
                              `${formatDate(selectedRecord.firstHolyCommunionDate)} at ${selectedRecord.firstHolyCommunionPlace || 'N/A'}` : 
                              'N/A'
                            }
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-600 font-medium mb-2">Confirmation:</div>
                          <div className="font-semibold text-gray-900">
                            {selectedRecord.confirmationDate ? 
                              `${formatDate(selectedRecord.confirmationDate)} at ${selectedRecord.confirmationPlace || 'N/A'}` : 
                              'N/A'
                            }
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-600 font-medium mb-2">Marriage:</div>
                          <div className="font-semibold text-gray-900">
                            {selectedRecord.marriageDate ? 
                              `${formatDate(selectedRecord.marriageDate)} to ${selectedRecord.marriagePartnerName || 'Partner'} at ${selectedRecord.marriagePlace || 'N/A'}` : 
                              'N/A'
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Information */}
                  {(selectedRecord.dateOfDeath || selectedRecord.remarks) && (
                    <div className="lg:col-span-2 space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-4 text-gray-900">Additional Information</h3>
                        <div className="space-y-3 bg-red-50 p-4 rounded-xl">
                          {selectedRecord.dateOfDeath && (
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600 font-medium">Date of Death:</span>
                              <span className="font-semibold text-gray-900">{formatDate(selectedRecord.dateOfDeath)}</span>
                            </div>
                          )}
                          {selectedRecord.remarks && (
                            <div>
                              <div className="text-gray-600 font-medium mb-2">Remarks:</div>
                              <div className="font-semibold text-gray-900 bg-white p-3 rounded-lg">{selectedRecord.remarks}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
