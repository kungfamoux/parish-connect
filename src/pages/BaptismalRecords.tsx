import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Church, Loader2, Users } from 'lucide-react';
import BaptismRecordModal from '../components/baptism/BaptismRecordModal';
import BaptismRecordsTable from '../components/baptism/BaptismRecordsTable';
import SearchComponent from '../components/baptism/SearchComponent';

export default function BaptismalRecords() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const observer = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const recordsPerPage = 20;

  // Anti-screenshot protection
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    const handleBeforePrint = (e: Event) => e.preventDefault();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen' || (e.ctrlKey && e.shiftKey && e.key === 'S')) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('beforeprint', handleBeforePrint);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('beforeprint', handleBeforePrint);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Check system preference for dark mode
  useEffect(() => {
    const checkDarkMode = () => {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
    };

    checkDarkMode();

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  const fetchRecords = async (page: number = 1, append: boolean = false) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: recordsPerPage.toString(),
        search: searchTerm
      });
      
      const response = await fetch(`/api/baptism-records?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch records');
      }
      
      const data = await response.json();
      
      if (append) {
        setRecords(prev => [...prev, ...data.records]);
      } else {
        setRecords(data.records);
      }
      
      setTotalRecords(data.total);
      setHasMore(data.records.length === recordsPerPage && data.records.length > 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      if (append) {
        setLoadingMore(false);
      } else {
        setLoading(false);
      }
    }
  };

  const loadMoreRecords = useCallback(() => {
    if (loadingMore || !hasMore) return;
    
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchRecords(nextPage, true);
  }, [currentPage, loadingMore, hasMore, searchTerm]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          loadMoreRecords();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px'
      }
    );
    
    if (loadMoreRef.current) {
      observer.current.observe(loadMoreRef.current);
    }
    
    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [loadMoreRecords, hasMore, loadingMore]);

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
    setRecords([]);
    setHasMore(true);
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
    setRecords([]);
    setHasMore(true);
  };

  useEffect(() => {
    fetchRecords();
  }, [currentPage, searchTerm]);

  if (loading && records.length === 0) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className={`text-lg font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Loading baptism records...</p>
          <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Please wait while we fetch your data</p>
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
        {/* Search */}
        <SearchComponent
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          handleSearch={handleSearch}
          handleKeyPress={handleKeyPress}
          clearSearch={clearSearch}
          isDarkMode={isDarkMode}
        />

        {/* Error Message */}
        {error && (
          <div className={`${isDarkMode ? 'bg-red-900 border-red-800 text-red-300' : 'bg-red-50 border-red-200 text-red-700'} border-2 px-6 py-4 rounded-xl mb-6`}>
            <div className="flex items-center gap-2">
              <span className={isDarkMode ? 'text-red-400' : 'text-red-600'}>⚠️</span>
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Showing <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{records.length}</span> of{' '}
            <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{totalRecords.toLocaleString()}</span> records
          </div>
          {searchTerm && (
            <div className={`text-sm px-3 py-1 rounded-full ${
              isDarkMode ? 'text-blue-400 bg-blue-900' : 'text-blue-600 bg-blue-50'
            }`}>
              Filtered by: "{searchTerm}"
            </div>
          )}
        </div>

        {/* Records Table */}
        <BaptismRecordsTable
          records={records}
          loadingMore={loadingMore}
          hasMore={hasMore}
          isDarkMode={isDarkMode}
          formatDate={formatDate}
          setSelectedRecord={setSelectedRecord}
          loadMoreRef={loadMoreRef}
        />

        {/* Empty State */}
        {records.length === 0 && !loading && (
          <div className="text-center py-16">
            <Users className={`h-16 w-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-300'}`} />
            <div className={`text-xl font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>No records found</div>
            <p className={`mt-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Try adjusting your search criteria</p>
          </div>
        )}
        
        {/* Loading indicator for infinite scroll */}
        {loadingMore && records.length > 0 && (
          <div className="text-center py-4">
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Loading more records...</span>
            </div>
          </div>
        )}
        
        {/* End of records indicator */}
        {!hasMore && records.length > 0 && (
          <div className="text-center py-4">
            <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              Showing {records.length} of {totalRecords.toLocaleString()} records
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      <BaptismRecordModal
        selectedRecord={selectedRecord}
        setSelectedRecord={setSelectedRecord}
        isDarkMode={isDarkMode}
        formatDate={formatDate}
      />
    </div>
  );
}
