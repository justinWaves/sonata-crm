import React, { useState, useMemo } from 'react';
import Modal from './Modal';
import type { Piano } from '../types/piano';
import { HiSearch, HiChevronLeft, HiChevronRight } from 'react-icons/hi';

interface PianoListModalProps {
  pianos: Piano[];
  onClose: () => void;
}

const PIANOS_PER_PAGE = 6;

const PianoListModal: React.FC<PianoListModalProps> = ({ pianos, onClose }) => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const filteredPianos = useMemo(() => {
    const q = search.toLowerCase();
    return pianos.filter(p =>
      (p.brand || '').toLowerCase().includes(q) ||
      (p.model || '').toLowerCase().includes(q) ||
      (p.serialNumber || '').toLowerCase().includes(q) ||
      (p.notes || '').toLowerCase().includes(q)
    );
  }, [pianos, search]);

  const total = filteredPianos.length;
  const totalPages = Math.max(1, Math.ceil(total / PIANOS_PER_PAGE));
  const pagedPianos = filteredPianos.slice((page - 1) * PIANOS_PER_PAGE, page * PIANOS_PER_PAGE);
  const rangeStart = total === 0 ? 0 : (page - 1) * PIANOS_PER_PAGE + 1;
  const rangeEnd = Math.min(page * PIANOS_PER_PAGE, total);

  React.useEffect(() => { setPage(1); }, [search]);

  return (
    <Modal isOpen={true} onClose={onClose} title="Piano List" widthClass="max-w-lg md:max-w-xl">
      <div className="space-y-6 px-2 pb-2 flex flex-col h-full">
        {/* Search Bar */}
        <div className="mb-2 flex items-center gap-2 bg-gray-50 rounded-lg px-2 py-1 border border-gray-200 w-full max-w-md mx-auto">
          <HiSearch className="text-gray-400 w-5 h-5" />
          <input
            type="text"
            className="flex-1 bg-transparent outline-none text-sm py-1 px-1"
            placeholder="Search pianos by brand, model, serial, notes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        {/* Piano List */}
        <div className="flex-1 min-h-0">
          {pagedPianos.length > 0 ? (
            <div className="space-y-2 max-h-72 md:max-h-96 overflow-y-auto pr-1">
              {pagedPianos.map((piano) => (
                <div key={piano.id} className="flex items-center gap-3 p-2 bg-white rounded-lg shadow hover:shadow-md transition group">
                  {piano.photoUrl ? (
                    <div className="w-14 h-14 rounded-md overflow-hidden border border-gray-200 flex items-center justify-center flex-shrink-0">
                      <img src={piano.photoUrl} alt="Piano" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-14 h-14 bg-gray-200 rounded-md flex items-center justify-center text-gray-400 flex-shrink-0">
                      <span className="text-2xl">🎹</span>
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-gray-900 truncate text-sm">{piano.brand || 'Unknown Brand'} {piano.model || ''}</div>
                    <div className="text-xs text-gray-500 mb-0.5">{piano.type || ''}{piano.year ? ` • ${piano.year}` : ''}</div>
                    {piano.serialNumber && <div className="text-xs text-gray-400">SN: {piano.serialNumber}</div>}
                    {piano.notes && <div className="text-xs text-blue-500 mt-0.5 truncate">{piano.notes}</div>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500 text-sm text-center mt-8">No pianos found.</div>
          )}
        </div>
        {/* Pagination Controls */}
        {total > PIANOS_PER_PAGE && (
          <div className="flex items-center justify-between mt-2 px-1">
            <div className="text-xs text-gray-500">Showing {rangeStart}-{rangeEnd} of {total} pianos</div>
            <div className="flex items-center gap-1">
              <button
                className="p-1 rounded disabled:opacity-40"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                aria-label="Previous page"
              >
                <HiChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-xs font-medium">{page} / {totalPages}</span>
              <button
                className="p-1 rounded disabled:opacity-40"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                aria-label="Next page"
              >
                <HiChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default PianoListModal; 