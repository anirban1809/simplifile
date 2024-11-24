import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { FileItem } from '../types';

interface SearchBarProps {
  onSearch: (query: string, filters: SearchFilters) => void;
}

export interface SearchFilters {
  fileType: string[];
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  sizeRange: {
    min: number;
    max: number;
  };
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    fileType: [],
    dateRange: { start: null, end: null },
    sizeRange: { min: 0, max: 100000000 } // 100MB default max
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query, filters);
  };

  return (
    <div className="w-full max-w-2xl">
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Search files and folders..."
          />
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <Filter className="h-5 w-5" />
          </button>
        </div>

        {showFilters && (
          <div className="absolute z-10 mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 p-4">
            <div className="space-y-4">
              {/* File Type Filter */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">File Type</h4>
                <div className="flex flex-wrap gap-2">
                  {['Images', 'Documents', 'Archives'].map((type) => (
                    <label key={type} className="inline-flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-blue-600"
                        checked={filters.fileType.includes(type)}
                        onChange={(e) => {
                          const newTypes = e.target.checked
                            ? [...filters.fileType, type]
                            : filters.fileType.filter(t => t !== type);
                          setFilters({ ...filters, fileType: newTypes });
                        }}
                      />
                      <span className="ml-2 text-sm text-gray-700">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Date Range Filter */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Date Range</h4>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="date"
                    className="form-input block w-full rounded-md border-gray-300"
                    onChange={(e) => setFilters({
                      ...filters,
                      dateRange: {
                        ...filters.dateRange,
                        start: e.target.value ? new Date(e.target.value) : null
                      }
                    })}
                  />
                  <input
                    type="date"
                    className="form-input block w-full rounded-md border-gray-300"
                    onChange={(e) => setFilters({
                      ...filters,
                      dateRange: {
                        ...filters.dateRange,
                        end: e.target.value ? new Date(e.target.value) : null
                      }
                    })}
                  />
                </div>
              </div>

              {/* Size Range Filter */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">File Size</h4>
                <div className="px-2">
                  <input
                    type="range"
                    min="0"
                    max="100000000"
                    step="1000000"
                    value={filters.sizeRange.max}
                    onChange={(e) => setFilters({
                      ...filters,
                      sizeRange: {
                        ...filters.sizeRange,
                        max: parseInt(e.target.value)
                      }
                    })}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>0 MB</span>
                    <span>{Math.round(filters.sizeRange.max / 1000000)} MB</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white rounded-md py-2 hover:bg-blue-700 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}