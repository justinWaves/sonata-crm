'use client';
import React, { useState, useEffect } from 'react';
import { useCustomerTable } from './CustomerTableContext';

interface SearchBarProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  const { query, setQuery } = useCustomerTable();
  const [input, setInput] = useState(query);

  useEffect(() => {
    if (typeof value === 'string') return; // controlled mode, skip context
    const handler = setTimeout(() => {
      setQuery(input);
    }, 300);
    return () => clearTimeout(handler);
  }, [input, setQuery, value]);

  return (
    <div className="relative w-full max-w-md">
      <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </span>
      <input
        type="text"
        className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
        placeholder="Search customers..."
        value={typeof value === 'string' ? value : input}
        onChange={onChange ? onChange : e => setInput(e.target.value)}
      />
    </div>
  );
} 