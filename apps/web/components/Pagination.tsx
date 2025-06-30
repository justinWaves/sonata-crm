import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  // Show up to 5 page numbers, with ellipsis if needed
  let start = Math.max(1, currentPage - 2);
  let end = Math.min(totalPages, currentPage + 2);
  if (end - start < 4) {
    if (start === 1) end = Math.min(totalPages, start + 4);
    if (end === totalPages) start = Math.max(1, end - 4);
  }
  const pages = [];
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <nav className="flex items-center justify-center gap-2 mt-6 select-none" aria-label="Pagination">
      <button
        className="px-2 py-1 rounded disabled:opacity-50"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <span aria-hidden>←</span>
      </button>
      {start > 1 && (
        <button className="px-2 py-1 rounded" onClick={() => onPageChange(1)}>1</button>
      )}
      {start > 2 && <span className="px-1">…</span>}
      {pages.map(page => (
        <button
          key={page}
          className={`px-3 py-1 rounded font-medium ${page === currentPage ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 text-gray-700'}`}
          onClick={() => onPageChange(page)}
          aria-current={page === currentPage ? 'page' : undefined}
        >
          {page}
        </button>
      ))}
      {end < totalPages - 1 && <span className="px-1">…</span>}
      {end < totalPages && (
        <button className="px-2 py-1 rounded" onClick={() => onPageChange(totalPages)}>{totalPages}</button>
      )}
      <button
        className="px-2 py-1 rounded disabled:opacity-50"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <span aria-hidden>→</span>
      </button>
    </nav>
  );
};

export default Pagination; 