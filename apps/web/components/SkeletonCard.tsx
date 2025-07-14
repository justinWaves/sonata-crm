import React from 'react';

export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 md:p-5 flex flex-col gap-3 relative w-[calc(100vw-1rem)] max-w-full mx-[-0.5rem] md:mx-0 md:w-auto">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 min-w-[3.5rem] min-h-[3.5rem] rounded-full skeleton-shimmer" />
          <div className="flex flex-col gap-2">
            <div className="h-6 w-32 rounded skeleton-shimmer" />
            <div className="h-4 w-24 rounded skeleton-shimmer" />
            <div className="flex items-center gap-1 mt-1">
              <div className="h-3 w-12 rounded skeleton-shimmer" />
              <div className="h-5 w-5 rounded-full skeleton-shimmer" />
            </div>
          </div>
        </div>
        <div className="w-10 h-10 rounded-full skeleton-shimmer" />
      </div>
    </div>
  );
} 