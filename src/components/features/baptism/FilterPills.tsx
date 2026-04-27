// Filter pills component for active search filters
import React from 'react';
import { X } from 'lucide-react';

interface FilterPillsProps {
  filters: string[];
  onRemoveFilter: (filter: string) => void;
  onClearAll: () => void;
  isDarkMode?: boolean;
}

export const FilterPills: React.FC<FilterPillsProps> = ({
  filters,
  onRemoveFilter,
  onClearAll,
  isDarkMode = false
}) => {
  if (filters.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <span className={`text-sm font-medium ${
        isDarkMode ? 'text-gray-300' : 'text-gray-700'
      }`}>
        Active filters:
      </span>
      {filters.map((filter, index) => (
        <span
          key={index}
          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
            isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'
          }`}
        >
          {filter}
          <button
            onClick={() => onRemoveFilter(filter)}
            className={`ml-1 hover:${isDarkMode ? 'text-blue-100' : 'text-blue-600'}`}
            title={`Remove filter: ${filter}`}
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
      <button
        onClick={onClearAll}
        className={`text-sm ${
          isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        Clear all
      </button>
    </div>
  );
};
