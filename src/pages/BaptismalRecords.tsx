import React, { useState, useEffect } from 'react';
import { Search, X, Church, Calendar, MapPin, Eye, Loader2, Database, Users } from 'lucide-react';
import { formatDate } from '../utils/date/formatDate';
import { useDarkMode } from '../hooks/ui/useDarkMode';
import { SearchInput } from '../components/features/baptism/SearchInput';
import { FilterPills } from '../components/features/baptism/FilterPills';

export default function BaptismalRecords() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);
  const isDarkMode = useDarkMode();
  
  // Enhanced search states
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  // DOB verification lock
  const [pendingRecord, setPendingRecord] = useState<any | null>(null);
  const [dobInput, setDobInput] = useState('');
  const [dobError, setDobError] = useState('');
  const [dobAttempts, setDobAttempts] = useState(0);

  const recordsPerPage = 20;

  // Anti-screenshot protection
  useEffect(() => {
    // Disable right-click
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };
    document.addEventListener('contextmenu', handleContextMenu);

    // Disable text selection
    const handleSelectStart = (e: Event) => {
      e.preventDefault();
    };
    document.addEventListener('selectstart', handleSelectStart);

    // Disable copy
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
    };
    document.addEventListener('copy', handleCopy);

    // Disable print
    const handleBeforePrint = () => {
      window.location.reload();
    };
    window.addEventListener('beforeprint', handleBeforePrint);

    // Disable devtools
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
        e.preventDefault();
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('selectstart', handleSelectStart);
      document.removeEventListener('copy', handleCopy);
      window.removeEventListener('beforeprint', handleBeforePrint);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [currentPage, searchTerm]);

  const fetchRecords = async () => {
    try {
      if (searchTerm) {
        setIsSearching(true);
      } else {
        setLoading(true);
      }
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: recordsPerPage.toString(),
        search: searchTerm
      });
      
      const response = await fetch(`/api/v1/records/baptism?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch records');
      }
      
      const data = await response.json();
      setRecords(data.records);
      setTotalRecords(data.total);
      
      // Add search term to active filters if it exists
      if (searchTerm && !activeFilters.includes(searchTerm)) {
        setActiveFilters(prev => [...prev, searchTerm]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  
  // Fetch search suggestions
  const fetchSearchSuggestions = async (query: string) => {
    if (query.length < 2) {
      setSearchSuggestions([]);
      return;
    }

    try {
      const response = await fetch(`/api/v1/records/suggestions?q=${encodeURIComponent(query)}`);
      if (response.ok) {
        const suggestions = await response.json();
        setSearchSuggestions(suggestions.slice(0, 5)); // Limit to 5 suggestions
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSearchSuggestions([]);
    }
  };

  // Debounced search suggestions
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchInput && showSuggestions) {
        fetchSearchSuggestions(searchInput);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchInput, showSuggestions]);

  const handleSearch = () => {
    setIsSearching(true);
    setSearchTerm(searchInput);
    setCurrentPage(1);
    setShowSuggestions(false);
    
    // Add to search history
    if (searchInput.trim() && !searchHistory.includes(searchInput.trim())) {
      setSearchHistory(prev => [searchInput.trim(), ...prev.slice(0, 4)]); // Keep last 5 searches
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchInput(suggestion);
    setSearchTerm(suggestion);
    setCurrentPage(1);
    setShowSuggestions(false);
    
    // Add to search history
    if (!searchHistory.includes(suggestion)) {
      setSearchHistory(prev => [suggestion, ...prev.slice(0, 4)]);
    }
  };

  const clearSearch = () => {
    setSearchInput('');
    setSearchTerm('');
    setCurrentPage(1);
    setShowSuggestions(false);
    setSearchSuggestions([]);
    setActiveFilters([]);
  };

  const removeFilter = (filter: string) => {
    setActiveFilters(prev => prev.filter(f => f !== filter));
  };

  const handleViewClick = (record: any) => {
    setPendingRecord(record);
    setDobInput('');
    setDobError('');
    setDobAttempts(0);
  };

  const handleDobVerify = () => {
    if (!pendingRecord) return;

    // Normalize stored DOB to YYYY-MM-DD for comparison
    const storedDob = pendingRecord.dateOfBirth
      ? new Date(pendingRecord.dateOfBirth).toISOString().split('T')[0]
      : null;

    // If no DOB on record, block access entirely
    if (!storedDob) {
      setDobError('Date of birth is not available for this record. Please contact the parish office.');
      return;
    }

    if (dobInput === storedDob) {
      setSelectedRecord(pendingRecord);
      setPendingRecord(null);
      setDobInput('');
      setDobError('');
      setDobAttempts(0);
    } else {
      const newAttempts = dobAttempts + 1;
      setDobAttempts(newAttempts);
      if (newAttempts >= 3) {
        setDobError('Too many incorrect attempts. Please contact the parish office for assistance.');
      } else {
        setDobError(`Incorrect date of birth. ${3 - newAttempts} attempt${3 - newAttempts === 1 ? '' : 's'} remaining.`);
      }
    }
  };

  const handleDobCancel = () => {
    setPendingRecord(null);
    setDobInput('');
    setDobError('');
    setDobAttempts(0);
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
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
      {/* Header */}
      <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            <div>
              <div>
                <h1 className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent'}`}>
                  Baptismal Records
                </h1>
                <p className={`mt-2 text-lg flex items-center gap-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <Church className={`h-5 w-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                  St. Mary Parish Trans Ekulu Enugu
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Search */}
        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl shadow-xl border p-6 mb-8`}>
          <div className="space-y-4">
            {/* Active Filters */}
            {activeFilters.length > 0 && (
              <div className="flex flex-wrap gap-2 items-center">
                <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Active filters:</span>
                {activeFilters.map((filter, index) => (
                  <span
                    key={index}
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                      isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {filter}
                    <button
                      onClick={() => removeFilter(filter)}
                      className={`ml-1 hover:${isDarkMode ? 'text-blue-100' : 'text-blue-600'}`}
                      title={`Remove filter: ${filter}`}
                      aria-label={`Remove filter: ${filter}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                <button
                  onClick={() => setActiveFilters([])}
                  className={`text-sm ${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Search Input with Suggestions */}
            <div className="space-y-3">
              <div className="relative">
                <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'} h-5 w-5`} />
                <input
                  type="text"
                  placeholder="Search by full name (e.g., GEORGENA NGOZICHUKWUKA ONU)..."
                  value={searchInput}
                  onChange={(e) => {
                    setSearchInput(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  onKeyPress={handleKeyPress}
                  className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-500 focus:border-transparent text-lg transition-all duration-200 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'border-gray-200 text-gray-900 placeholder-gray-500'
                  }`}
                />
                {isSearching && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                  </div>
                )}

                {/* Search Suggestions Dropdown */}
                {showSuggestions && (searchSuggestions.length > 0 || searchHistory.length > 0) && (
                  <div className={`absolute top-full left-0 right-0 mt-2 rounded-xl shadow-lg border z-10 max-h-60 overflow-y-auto ${
                    isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  }`}>
                    {searchSuggestions.length > 0 && (
                      <div>
                        <div className={`px-4 py-2 text-xs font-semibold uppercase tracking-wide ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          Suggestions
                        </div>
                        {searchSuggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className={`w-full text-left px-4 py-3 hover:${
                              isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                            } transition-colors flex items-center gap-3`}
                          >
                            <Search className={`h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                            <span className={isDarkMode ? 'text-gray-200' : 'text-gray-900'}>{suggestion}</span>
                          </button>
                        ))}
                      </div>
                    )}
                    
                    {searchHistory.length > 0 && (
                      <div>
                        <div className={`px-4 py-2 text-xs font-semibold uppercase tracking-wide ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          Recent Searches
                        </div>
                        {searchHistory.map((historyItem, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(historyItem)}
                            className={`w-full text-left px-4 py-3 hover:${
                              isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                            } transition-colors flex items-center gap-3`}
                          >
                            <Database className={`h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                            <span className={isDarkMode ? 'text-gray-200' : 'text-gray-900'}>{historyItem}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Search Tips */}
              <div className={`flex flex-wrap gap-2 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <span className={`${isDarkMode ? 'bg-green-900 text-green-300' : 'bg-green-50'} px-2 py-1 rounded-full`}>
                  Works with: First name, Last name, or complete full name
                </span>
                <span className={`${isDarkMode ? 'bg-purple-900 text-purple-300' : 'bg-purple-50'} px-2 py-1 rounded-full`}>
                  Also searches: Parents' names and S/No
                </span>
                <span className={`${isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-50'} px-2 py-1 rounded-full`}>
                  Press ESC to close suggestions
                </span>
              </div>
            </div>

            {/* Search Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleSearch}
                disabled={isSearching}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSearching ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="h-5 w-5" />
                    Search Records
                  </>
                )}
              </button>
              {searchInput && (
                <button
                  onClick={clearSearch}
                  className={`px-6 py-3 border-2 rounded-xl transition-all duration-200 font-medium ${
                    isDarkMode 
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className={`${isDarkMode ? 'bg-red-900 border-red-800 text-red-300' : 'bg-red-50 border-red-200 text-red-700'} border-2 px-6 py-4 rounded-xl mb-6`}>
            <div className="flex items-center gap-2">
              <span className={isDarkMode ? 'text-red-400' : 'text-red-600'}>⚠️</span>
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Enhanced Results Summary */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex flex-col gap-2">
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Showing <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{records.length}</span> of{' '}
              <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{totalRecords.toLocaleString()}</span> records
            </div>
            {searchTerm && (
              <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Search results for <span className="font-medium">{searchTerm}</span>
                {totalRecords === 0 && (
                  <span className="ml-2 text-red-500">No results found</span>
                )}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            {searchTerm && (
              <div className={`text-sm px-3 py-1 rounded-full ${
                isDarkMode ? 'text-blue-400 bg-blue-900' : 'text-blue-600 bg-blue-50'
              }`}>
                <span className="flex items-center gap-2">
                  <Search className="h-3 w-3" />
                  "{searchTerm}"
                </span>
              </div>
            )}
            
            {isSearching && (
              <div className="flex items-center gap-2 text-sm text-blue-600">
                <Loader2 className="h-4 w-4 animate-spin" />
                Searching...
              </div>
            )}
          </div>
        </div>

        {/* No Results State */}
        {searchTerm && records.length === 0 && !loading && (
          <div className={`text-center py-12 rounded-xl border-2 border-dashed ${
            isDarkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-300 bg-gray-50'
          }`}>
            <div className="flex flex-col items-center gap-4">
              <div className={`p-4 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <Search className={`h-8 w-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              </div>
              <div>
                <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  No results found for "{searchTerm}"
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Try different keywords or check spelling
                </p>
              </div>
              <div className={`flex flex-wrap gap-2 text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                <span className={`${isDarkMode ? 'bg-gray-700' : 'bg-white'} px-3 py-2 rounded-lg border`}>
                  💡 Try searching by first name only
                </span>
                <span className={`${isDarkMode ? 'bg-gray-700' : 'bg-white'} px-3 py-2 rounded-lg border`}>
                  💡 Check for alternate spellings
                </span>
                <span className={`${isDarkMode ? 'bg-gray-700' : 'bg-white'} px-3 py-2 rounded-lg border`}>
                  💡 Search by S/No if known
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Records Table - Responsive Design */}
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
                          onClick={() => handleViewClick(record)}
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
                      onClick={() => handleViewClick(record)}
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
          <div className={`mt-8 flex items-center justify-between rounded-xl shadow-lg border p-4 ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className={`hidden sm:block text-sm ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Page <span className={`font-semibold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>{currentPage}</span> of{' '}
              <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{totalPages}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`flex items-center gap-2 px-3 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm ${
                  isDarkMode 
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span>×</span>
                <span className="font-medium hidden sm:inline">Previous</span>
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`flex items-center gap-2 px-3 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm ${
                  isDarkMode 
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="font-medium hidden sm:inline">Next</span>
                <span>{'>'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* DOB Verification Modal */}
      {pendingRecord && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-2xl w-full max-w-md`}>
            {/* Header */}
            <div className={`${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-blue-50 border-blue-100'} border-b rounded-t-2xl px-6 py-5 flex items-center gap-3`}>
              <div className={`p-2 rounded-full ${isDarkMode ? 'bg-blue-900' : 'bg-blue-100'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
              <div>
                <h2 className={`text-base font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Identity Verification</h2>
                <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Enter the date of birth for <span className="font-medium">{pendingRecord.baptismName} {pendingRecord.surname}</span>
                </p>
              </div>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-4">
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                To protect privacy, please enter the date of birth for this record to proceed.
              </p>

              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={dobInput}
                  onChange={(e) => { setDobInput(e.target.value); setDobError(''); }}
                  onKeyDown={(e) => { if (e.key === 'Enter' && dobAttempts < 3) handleDobVerify(); }}
                  disabled={dobAttempts >= 3}
                  className={`w-full px-4 py-2.5 border-2 rounded-xl text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    ${dobError ? 'border-red-400' : isDarkMode ? 'border-gray-600' : 'border-gray-200'}
                    ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}
                    ${dobAttempts >= 3 ? 'opacity-50 cursor-not-allowed' : ''}`}
                />
              </div>

              {dobError && (
                <div className={`flex items-start gap-2 text-sm px-3 py-2.5 rounded-lg ${
                  dobAttempts >= 3
                    ? isDarkMode ? 'bg-red-900/50 text-red-300' : 'bg-red-50 text-red-700'
                    : isDarkMode ? 'bg-yellow-900/50 text-yellow-300' : 'bg-yellow-50 text-yellow-700'
                }`}>
                  <span className="mt-0.5">⚠️</span>
                  <span>{dobError}</span>
                </div>
              )}

              {/* Attempt dots */}
              {dobAttempts > 0 && dobAttempts < 3 && (
                <div className="flex items-center gap-1.5">
                  {[0,1,2].map(i => (
                    <div key={i} className={`h-2 w-2 rounded-full ${i < dobAttempts ? 'bg-red-500' : isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`} />
                  ))}
                  <span className={`text-xs ml-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>incorrect attempts</span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className={`px-6 py-4 border-t rounded-b-2xl flex gap-3 ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
              <button
                onClick={handleDobCancel}
                className={`flex-1 px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition-colors
                  ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
              >
                Cancel
              </button>
              <button
                onClick={handleDobVerify}
                disabled={!dobInput || dobAttempts >= 3}
                className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                Verify &amp; View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Simplified Baptism Record Details Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-hidden`}>
            {/* Simple Header */}
            <div className={`${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} border-b px-6 py-4 flex items-center justify-between`}>
              <div className="flex items-center gap-3">
                <Church className={`h-5 w-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                <div>
                  <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Baptism Record</h2>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>S/No: {selectedRecord.sNo || 'N/A'}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className={`${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'} p-1`}
                title="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
              <div className="p-6">
                {/* Person's Name */}
                <div className={`text-center mb-6 pb-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <h3 className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {selectedRecord.baptismName} {selectedRecord.surname}
                  </h3>
                  {selectedRecord.otherName && (
                    <p className={isDarkMode ? 'text-gray-400 mt-1' : 'text-gray-600 mt-1'}>{selectedRecord.otherName}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h4 className={`font-medium text-sm uppercase tracking-wide ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-900'
                    }`}>Personal Information</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Date of Birth:</span>
                        <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{formatDate(selectedRecord.dateOfBirth)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Home Town:</span>
                        <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{selectedRecord.homeTown || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Baptism Information */}
                  <div className="space-y-4">
                    <h4 className={`font-medium text-sm uppercase tracking-wide ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-900'
                    }`}>Baptism Details</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Date of Baptism:</span>
                        <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{formatDate(selectedRecord.dateOfBaptism)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Place of Baptism:</span>
                        <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{selectedRecord.placeOfBaptism || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Type:</span>
                        <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{selectedRecord.solemnOrPrivate || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Minister:</span>
                        <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{selectedRecord.nameOfMinister || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between items-start">
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>God Parents:</span>
                        <span className={`font-medium text-right ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{selectedRecord.nameOfGodParents || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Parents Information */}
                  <div className="space-y-4">
                    <h4 className={`font-medium text-sm uppercase tracking-wide ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-900'
                    }`}>Parents Information</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Father's Name:</span>
                        <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{selectedRecord.fathersName || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Mother's Name:</span>
                        <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{selectedRecord.mothersName || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Other Sacraments */}
                  <div className="space-y-4">
                    <h4 className={`font-medium text-sm uppercase tracking-wide ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-900'
                    }`}>Other Sacraments</h4>
                    <div className="space-y-3">
                      <div>
                        <p className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>First Holy Communion:</p>
                        <p className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                          {selectedRecord.firstHolyCommunionDate ? 
                            `${formatDate(selectedRecord.firstHolyCommunionDate)}${selectedRecord.firstHolyCommunionPlace ? ` at ${selectedRecord.firstHolyCommunionPlace}` : ''}` : 
                            'Not recorded'
                          }
                        </p>
                      </div>
                      <div>
                        <p className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Confirmation:</p>
                        <p className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                          {selectedRecord.confirmationDate ? 
                            `${formatDate(selectedRecord.confirmationDate)}${selectedRecord.confirmationPlace ? ` at ${selectedRecord.confirmationPlace}` : ''}` : 
                            'Not recorded'
                          }
                        </p>
                      </div>
                      <div>
                        <p className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Marriage:</p>
                        <p className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
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
                    <div className={`md:col-span-2 space-y-4 pt-6 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <h4 className={`font-medium text-sm uppercase tracking-wide ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-900'
                      }`}>Additional Information</h4>
                      <div className="space-y-3">
                        {selectedRecord.dateOfDeath && (
                          <div className="flex justify-between">
                            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Date of Death:</span>
                            <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{formatDate(selectedRecord.dateOfDeath)}</span>
                          </div>
                        )}
                        {selectedRecord.remarks && (
                          <div>
                            <p className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Remarks:</p>
                            <p className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{selectedRecord.remarks}</p>
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