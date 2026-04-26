import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, User, MapPin, Church, Eye, Loader2, Database, Users, X } from 'lucide-react';

export default function BaptismalRecords() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);

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

  const handleSearch = () => {
    setSearchTerm(searchInput);
    setCurrentPage(1);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchInput('');
    setSearchTerm('');
    setCurrentPage(1);
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
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            <div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Baptismal Records
                </h1>
                <p className="mt-2 text-lg text-gray-600 flex items-center gap-2">
                  <Church className="h-5 w-5 text-blue-600" />
                  St. Mary Parish Trans Ekulu Enugu
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 mb-8">
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search by full name (e.g., GEORGENA NGOZICHUKWUKA ONU)..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500 focus:border-transparent text-lg transition-all duration-200"
                />
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                <span className="bg-green-50 px-2 py-1 rounded-full">
                  Works with: First name, Last name, or complete full name
                </span>
                <span className="bg-purple-50 px-2 py-1 rounded-full">
                  Also searches: Parents' names and S/No
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSearch}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md font-medium"
              >
                <Search className="h-5 w-5" />
                Search Records
              </button>
              {searchInput && (
                <button
                  onClick={clearSearch}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

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

        {/* Records Table - Responsive Design */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Desktop View */}
          <div className="hidden md:block">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      S/No
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Date of Baptism
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Date of Birth
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Place of Baptism
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Minister
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
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
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                          {record.sNo || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-semibold text-gray-900">
                            {record.baptismName || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {record.otherName && `${record.otherName} `}{record.surname || ''}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(record.dateOfBaptism)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(record.dateOfBirth)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          {record.placeOfBaptism || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
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
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile View - Simplified */}
          <div className="md:hidden">
            <div className="divide-y divide-gray-200">
              {records.map((record, index) => (
                <div 
                  key={record.id} 
                  className="p-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold flex-shrink-0">
                        {record.sNo || 'N/A'}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-semibold text-gray-900 truncate">
                          {record.baptismName || 'N/A'} {record.surname || ''}
                        </div>
                        {record.otherName && (
                          <div className="text-sm text-gray-500 truncate">
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
            </div>
          </div>
        </div>

          {records.length === 0 && !loading && (
            <div className="text-center py-16">
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <div className="text-xl text-gray-500 font-medium">No records found</div>
              <p className="text-gray-400 mt-2">Try adjusting your search criteria</p>
            </div>
          )}

        {/* Enhanced Pagination - Mobile Friendly */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-between bg-white rounded-xl shadow-lg border border-gray-200 p-4">
            <div className="hidden sm:block text-sm text-gray-700">
              Page <span className="font-semibold text-blue-600">{currentPage}</span> of{' '}
              <span className="font-semibold text-gray-900">{totalPages}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all duration-200 text-sm"
              >
                <span>×</span>
                <span className="font-medium hidden sm:inline">Previous</span>
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all duration-200 text-sm"
              >
                <span className="font-medium hidden sm:inline">Next</span>
                <span>{'>'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Simplified Baptism Record Details Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Simple Header */}
            <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Church className="h-5 w-5 text-gray-600" />
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Baptism Record</h2>
                  <p className="text-sm text-gray-600">S/No: {selectedRecord.sNo || 'N/A'}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="text-gray-400 hover:text-gray-600 p-1"
                title="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
              <div className="p-6">
                {/* Person's Name */}
                <div className="text-center mb-6 pb-6 border-b border-gray-200">
                  <h3 className="text-2xl font-semibold text-gray-900">
                    {selectedRecord.baptismName} {selectedRecord.surname}
                  </h3>
                  {selectedRecord.otherName && (
                    <p className="text-gray-600 mt-1">{selectedRecord.otherName}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900 text-sm uppercase tracking-wide">Personal Information</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600 text-sm">Date of Birth:</span>
                        <span className="text-gray-900 font-medium">{formatDate(selectedRecord.dateOfBirth)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 text-sm">Home Town:</span>
                        <span className="text-gray-900 font-medium">{selectedRecord.homeTown || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Baptism Information */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900 text-sm uppercase tracking-wide">Baptism Details</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600 text-sm">Date of Baptism:</span>
                        <span className="text-gray-900 font-medium">{formatDate(selectedRecord.dateOfBaptism)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 text-sm">Place of Baptism:</span>
                        <span className="text-gray-900 font-medium">{selectedRecord.placeOfBaptism || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 text-sm">Type:</span>
                        <span className="text-gray-900 font-medium">{selectedRecord.solemnOrPrivate || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 text-sm">Minister:</span>
                        <span className="text-gray-900 font-medium">{selectedRecord.nameOfMinister || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between items-start">
                        <span className="text-gray-600 text-sm">God Parents:</span>
                        <span className="text-gray-900 font-medium text-right">{selectedRecord.nameOfGodParents || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Parents Information */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900 text-sm uppercase tracking-wide">Parents Information</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600 text-sm">Father's Name:</span>
                        <span className="text-gray-900 font-medium">{selectedRecord.fathersName || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 text-sm">Mother's Name:</span>
                        <span className="text-gray-900 font-medium">{selectedRecord.mothersName || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Other Sacraments */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900 text-sm uppercase tracking-wide">Other Sacraments</h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-gray-600 text-sm mb-1">First Holy Communion:</p>
                        <p className="text-gray-900 font-medium">
                          {selectedRecord.firstHolyCommunionDate ? 
                            `${formatDate(selectedRecord.firstHolyCommunionDate)}${selectedRecord.firstHolyCommunionPlace ? ` at ${selectedRecord.firstHolyCommunionPlace}` : ''}` : 
                            'Not recorded'
                          }
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm mb-1">Confirmation:</p>
                        <p className="text-gray-900 font-medium">
                          {selectedRecord.confirmationDate ? 
                            `${formatDate(selectedRecord.confirmationDate)}${selectedRecord.confirmationPlace ? ` at ${selectedRecord.confirmationPlace}` : ''}` : 
                            'Not recorded'
                          }
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm mb-1">Marriage:</p>
                        <p className="text-gray-900 font-medium">
                          {selectedRecord.marriageDate ? 
                            `${formatDate(selectedRecord.marriageDate)}${selectedRecord.marriagePartnerName ? ` to ${selectedRecord.marriagePartnerName}` : ''}${selectedRecord.marriagePlace ? ` at ${selectedRecord.marriagePlace}` : ''}` : 
                            'Not recorded'
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Additional Information */}
                  {(selectedRecord.dateOfDeath || selectedRecord.remarks) && (
                    <div className="md:col-span-2 space-y-4 pt-6 border-t border-gray-200">
                      <h4 className="font-medium text-gray-900 text-sm uppercase tracking-wide">Additional Information</h4>
                      <div className="space-y-3">
                        {selectedRecord.dateOfDeath && (
                          <div className="flex justify-between">
                            <span className="text-gray-600 text-sm">Date of Death:</span>
                            <span className="text-gray-900 font-medium">{formatDate(selectedRecord.dateOfDeath)}</span>
                          </div>
                        )}
                        {selectedRecord.remarks && (
                          <div>
                            <p className="text-gray-600 text-sm mb-1">Remarks:</p>
                            <p className="text-gray-900 font-medium">{selectedRecord.remarks}</p>
                          </div>
                        )}
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
  );
}
