import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface CustomerTableContextType {
  query: string;
  setQuery: (q: string) => void;
  compact: boolean;
  setCompact: (c: boolean) => void;
  selectedIds: Set<string>;
  setSelectedIds: (ids: Set<string>) => void;
  toggleSelect: (id: string) => void;
}

const CustomerTableContext = createContext<CustomerTableContextType | undefined>(undefined);

export const CustomerTableProvider = ({ children }: { children: ReactNode }) => {
  const [query, setQuery] = useState('');
  const [compact, setCompact] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  return (
    <CustomerTableContext.Provider value={{ query, setQuery, compact, setCompact, selectedIds, setSelectedIds, toggleSelect }}>
      {children}
    </CustomerTableContext.Provider>
  );
};

export function useCustomerTable() {
  const ctx = useContext(CustomerTableContext);
  if (!ctx) throw new Error('useCustomerTable must be used within a CustomerTableProvider');
  return ctx;
} 