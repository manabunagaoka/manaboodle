'use client';

import React, { useState } from 'react';
import { Calendar, Search, X } from "lucide-react";

interface TimeFiltersProps {
  onFilterChange: (filters: {
    startDate: string;
    endDate: string;
    contentType: string;
    searchQuery: string;
  }) => void;
  onClose: () => void;
}

const TimeFilters: React.FC<TimeFiltersProps> = ({ onFilterChange, onClose }) => {
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    contentType: 'all',
    searchQuery: ''
  });

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = {
      ...filters,
      [key]: value
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const resetFilters = {
      startDate: '',
      endDate: '',
      contentType: 'all',
      searchQuery: ''
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="bg-[#2d2d2d] rounded-lg p-4 mb-4 shadow-lg border border-[#3e3e42]">
      {/* Close button */}
      <div className="flex justify-end mb-2">
        <button
          onClick={onClose}
          className="p-1 hover:bg-[#37373d] rounded-md"
        >
          <X size={20} className="text-gray-400" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label htmlFor="startDate" className="text-sm text-gray-300">
            Start Date
          </label>
          <div className="relative">
            <input
              type="date"
              id="startDate"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              className="w-full bg-[#37373d] text-gray-300 rounded-md pl-10 pr-3 py-2 border border-[#3e3e42] focus:outline-none focus:border-blue-500"
            />
            <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="endDate" className="text-sm text-gray-300">
            End Date
          </label>
          <div className="relative">
            <input
              type="date"
              id="endDate"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              className="w-full bg-[#37373d] text-gray-300 rounded-md pl-10 pr-3 py-2 border border-[#3e3e42] focus:outline-none focus:border-blue-500"
            />
            <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="contentType" className="text-sm text-gray-300">
            Content Type
          </label>
          <select
            id="contentType"
            value={filters.contentType}
            onChange={(e) => handleFilterChange('contentType', e.target.value)}
            className="w-full bg-[#37373d] text-gray-300 rounded-md px-3 py-2 border border-[#3e3e42] focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Content</option>
            <option value="text">Text Only</option>
            <option value="media">With Media</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="search" className="text-sm text-gray-300">
            Search
          </label>
          <div className="relative">
            <input
              type="text"
              id="search"
              placeholder="Search stories..."
              value={filters.searchQuery}
              onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
              className="w-full bg-[#37373d] text-gray-300 rounded-md pl-10 pr-3 py-2 border border-[#3e3e42] focus:outline-none focus:border-blue-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <button
          onClick={clearFilters}
          className="px-4 py-2 bg-[#37373d] text-gray-300 rounded-md hover:bg-[#424242] transition-colors"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default TimeFilters;