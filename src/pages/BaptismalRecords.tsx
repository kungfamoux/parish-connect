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

      {/* Enhanced Baptism Record Details Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden my-4 transform transition-all duration-300 scale-100 hover:scale-[1.01]">
            {/* Header with gradient and enhanced design */}
            <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white overflow-hidden">
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="relative px-6 py-8 sm:px-8 sm:py-10">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl">
                        <Church className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white">Baptism Record</h2>
                        <p className="text-white/80 text-sm mt-1">Certificate of Baptism</p>
                      </div>
                    </div>
                    
                    {/* Person's name prominently displayed */}
                    <div className="mt-6">
                      <h3 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
                        {selectedRecord.baptismName} {selectedRecord.surname}
                      </h3>
                      {selectedRecord.otherName && (
                        <p className="text-white/80 text-lg mt-2">{selectedRecord.otherName}</p>
                      )}
                    </div>
                    
                    {/* Serial number badge */}
                    <div className="mt-4 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                      <span className="text-white/80 text-sm">Serial Number:</span>
                      <span className="text-white font-bold text-lg">{selectedRecord.sNo || 'N/A'}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setSelectedRecord(null)}
                    className="bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-2xl p-3 transition-all duration-200 border border-white/30"
                    title="Close modal"
                  >
                    <X className="h-6 w-6 text-white" />
                  </button>
                </div>
              </div>
              
              {/* Decorative wave pattern */}
              <div className="absolute bottom-0 left-0 right-0">
                <svg viewBox="0 0 1200 120" className="w-full h-12">
                  <path fill="white" fillOpacity="0.1" d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
                </svg>
              </div>
            </div>
            
            {/* Content with enhanced design */}
            <div className="overflow-y-auto max-h-[calc(95vh-200px)] bg-gradient-to-b from-gray-50 to-white">
              <div className="p-6 sm:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  
                  {/* Personal Information Card */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
                        <h4 className="text-white font-semibold flex items-center gap-2">
                          <User className="h-5 w-5" />
                          Personal Information
                        </h4>
                      </div>
                      <div className="p-6 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors">
                            <p className="text-gray-600 text-sm font-medium mb-1">Date of Birth</p>
                            <p className="text-gray-900 font-semibold text-lg">{formatDate(selectedRecord.dateOfBirth)}</p>
                          </div>
                          <div className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors">
                            <p className="text-gray-600 text-sm font-medium mb-1">Home Town</p>
                            <p className="text-gray-900 font-semibold text-lg">{selectedRecord.homeTown || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Baptism Details Card */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-600 px-6 py-4">
                        <h4 className="text-white font-semibold flex items-center gap-2">
                          <Church className="h-5 w-5" />
                          Baptism Details
                        </h4>
                      </div>
                      <div className="p-6 space-y-4">
                        <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                          <p className="text-purple-600 text-sm font-medium mb-1">Date of Baptism</p>
                          <p className="text-purple-900 font-bold text-xl">{formatDate(selectedRecord.dateOfBaptism)}</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors">
                            <p className="text-gray-600 text-sm font-medium mb-1">Place of Baptism</p>
                            <p className="text-gray-900 font-semibold">{selectedRecord.placeOfBaptism || 'N/A'}</p>
                          </div>
                          <div className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors">
                            <p className="text-gray-600 text-sm font-medium mb-1">Type</p>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                              {selectedRecord.solemnOrPrivate || 'N/A'}
                            </span>
                          </div>
                        </div>
                        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                          <p className="text-blue-600 text-sm font-medium mb-2">Minister</p>
                          <p className="text-blue-900 font-semibold">{selectedRecord.nameOfMinister || 'N/A'}</p>
                        </div>
                        <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                          <p className="text-green-600 text-sm font-medium mb-2">God Parents</p>
                          <p className="text-green-900 font-semibold">{selectedRecord.nameOfGodParents || 'N/A'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Parents Information Card */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                      <div className="bg-gradient-to-r from-green-500 to-teal-600 px-6 py-4">
                        <h4 className="text-white font-semibold flex items-center gap-2">
                          <Users className="h-5 w-5" />
                          Parents Information
                        </h4>
                      </div>
                      <div className="p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                            <p className="text-blue-600 text-sm font-medium mb-1">Father's Name</p>
                            <p className="text-blue-900 font-semibold">{selectedRecord.fathersName || 'N/A'}</p>
                          </div>
                          <div className="bg-pink-50 rounded-xl p-4 border border-pink-100">
                            <p className="text-pink-600 text-sm font-medium mb-1">Mother's Name</p>
                            <p className="text-pink-900 font-semibold">{selectedRecord.mothersName || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Other Sacraments Sidebar */}
                  <div className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
                        <h4 className="text-white font-semibold flex items-center gap-2">
                          <Calendar className="h-5 w-5" />
                          Other Sacraments
                        </h4>
                      </div>
                      <div className="p-6 space-y-4">
                        {/* First Holy Communion */}
                        <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100 hover:bg-indigo-100 transition-colors">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                            <p className="text-indigo-700 font-semibold text-sm">First Holy Communion</p>
                          </div>
                          {selectedRecord.firstHolyCommunionDate ? (
                            <div className="space-y-1">
                              <p className="text-indigo-900 font-medium">{formatDate(selectedRecord.firstHolyCommunionDate)}</p>
                              {selectedRecord.firstHolyCommunionPlace && (
                                <p className="text-indigo-700 text-sm">at {selectedRecord.firstHolyCommunionPlace}</p>
                              )}
                            </div>
                          ) : (
                            <p className="text-gray-500 italic">Not recorded</p>
                          )}
                        </div>

                        {/* Confirmation */}
                        <div className="bg-purple-50 rounded-xl p-4 border border-purple-100 hover:bg-purple-100 transition-colors">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <p className="text-purple-700 font-semibold text-sm">Confirmation</p>
                          </div>
                          {selectedRecord.confirmationDate ? (
                            <div className="space-y-1">
                              <p className="text-purple-900 font-medium">{formatDate(selectedRecord.confirmationDate)}</p>
                              {selectedRecord.confirmationPlace && (
                                <p className="text-purple-700 text-sm">at {selectedRecord.confirmationPlace}</p>
                              )}
                            </div>
                          ) : (
                            <p className="text-gray-500 italic">Not recorded</p>
                          )}
                        </div>

                        {/* Marriage */}
                        <div className="bg-pink-50 rounded-xl p-4 border border-pink-100 hover:bg-pink-100 transition-colors">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                            <p className="text-pink-700 font-semibold text-sm">Marriage</p>
                          </div>
                          {selectedRecord.marriageDate ? (
                            <div className="space-y-1">
                              <p className="text-pink-900 font-medium">{formatDate(selectedRecord.marriageDate)}</p>
                              {selectedRecord.marriagePartnerName && (
                                <p className="text-pink-700 text-sm">to {selectedRecord.marriagePartnerName}</p>
                              )}
                              {selectedRecord.marriagePlace && (
                                <p className="text-pink-700 text-sm">at {selectedRecord.marriagePlace}</p>
                              )}
                            </div>
                          ) : (
                            <p className="text-gray-500 italic">Not recorded</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Additional Information */}
                    {(selectedRecord.dateOfDeath || selectedRecord.remarks) && (
                      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                        <div className="bg-gradient-to-r from-gray-600 to-gray-800 px-6 py-4">
                          <h4 className="text-white font-semibold">Additional Information</h4>
                        </div>
                        <div className="p-6 space-y-4">
                          {selectedRecord.dateOfDeath && (
                            <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                              <p className="text-red-600 text-sm font-medium mb-1">Date of Death</p>
                              <p className="text-red-900 font-semibold">{formatDate(selectedRecord.dateOfDeath)}</p>
                            </div>
                          )}
                          {selectedRecord.remarks && (
                            <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
                              <p className="text-yellow-600 text-sm font-medium mb-2">Remarks</p>
                              <p className="text-yellow-900 font-medium">{selectedRecord.remarks}</p>
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
        </div>
      )}
      
      {/* Add custom styles for animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}
