// Enhanced search input component for baptism records
import React, { useState, useEffect } from 'react';
import { Search, X, Loader2, Database } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  onClear: () => void;
  isSearching?: boolean;
  suggestions?: string[];
  searchHistory?: string[];
  isDarkMode?: boolean;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  onSearch,
  onClear,
  isSearching = false,
  suggestions = [],
  searchHistory = [],
  isDarkMode = false
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [debouncedValue, setDebouncedValue] = useState(value);

  // Debounce input changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedValue(value);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [value]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch();
      setShowSuggestions(false);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    onSearch();
    setShowSuggestions(false);
  };

  const hasSuggestions = suggestions.length > 0 || searchHistory.length > 0;

  return (
    <div className="relative">
      <div className="relative">
        <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-400'
        } h-5 w-5`} />
        
        <input
          type="text"
          placeholder="Search by full name (e.g., GEORGENA NGOZICHUKWUKA ONU)..."
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
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
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && hasSuggestions && (
        <div className={`absolute top-full left-0 right-0 mt-2 rounded-xl shadow-lg border z-10 max-h-60 overflow-y-auto ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          {suggestions.length > 0 && (
            <div>
              <div className={`px-4 py-2 text-xs font-semibold uppercase tracking-wide ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Suggestions
              </div>
              {suggestions.map((suggestion, index) => (
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
  );
};
