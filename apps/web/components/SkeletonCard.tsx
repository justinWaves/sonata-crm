import React from 'react';

export default function SkeletonCard() {
  return (
    <div className="h-24 w-full rounded-lg mb-2 bg-gray-100 animate-pulse flex flex-col gap-3 p-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gray-200" />
        <div className="flex-1 h-5 bg-gray-200 rounded" />
        <div className="w-8 h-8 rounded-full bg-gray-200" />
      </div>
      <div className="flex-1 flex flex-col gap-2 mt-2">
        <div className="h-4 w-1/2 bg-gray-200 rounded" />
        <div className="h-4 w-1/3 bg-gray-200 rounded" />
      </div>
    </div>
  );
} 