import React from 'react';
import { Search } from 'lucide-react';

interface SearchComponentProps {
  searchInput: string;
  setSearchInput: (value: string) => void;
  handleSearch: () => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  clearSearch: () => void;
  isDarkMode: boolean;
}

export default function SearchComponent({ 
  searchInput, 
  setSearchInput, 
  handleSearch, 
  handleKeyPress, 
  clearSearch,
  isDarkMode 
}: SearchComponentProps) {
  return (
    <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl shadow-xl border p-6 mb-8`}>
      <div className="space-y-4">
        <div className="space-y-3">
          <div className="relative">
            <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'} h-5 w-5`} />
            <input
              type="text"
              placeholder="Search by full name (e.g., GEORGENA NGOZICHUKWUKA ONU)..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-500 focus:border-transparent text-lg transition-all duration-200 ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'border-gray-200 text-gray-900 placeholder-gray-500'
              }`}
            />
          </div>
          <div className={`flex flex-wrap gap-2 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <span className={`${isDarkMode ? 'bg-green-900 text-green-300' : 'bg-green-50'} px-2 py-1 rounded-full`}>
              Works with: First name, Last name, or complete full name
            </span>
            <span className={`${isDarkMode ? 'bg-purple-900 text-purple-300' : 'bg-purple-50'} px-2 py-1 rounded-full`}>
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
  );
}
