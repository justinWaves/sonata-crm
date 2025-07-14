import React from 'react';

export default function SkeletonModal() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl">
        {/* Title bar */}
        <div className="h-8 w-40 bg-gray-200 rounded mb-8 skeleton-shimmer" />
        {/* Form fields */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-2">
            <div className="w-full md:w-1/2">
              <div className="h-4 w-24 bg-gray-100 rounded mb-2 skeleton-shimmer" />
              <div className="h-10 w-full bg-gray-200 rounded skeleton-shimmer" />
            </div>
            <div className="w-full md:w-1/2">
              <div className="h-4 w-24 bg-gray-100 rounded mb-2 skeleton-shimmer" />
              <div className="h-10 w-full bg-gray-200 rounded skeleton-shimmer" />
            </div>
          </div>
          <div>
            <div className="h-4 w-32 bg-gray-100 rounded mb-2 skeleton-shimmer" />
            <div className="h-10 w-full bg-gray-200 rounded skeleton-shimmer" />
          </div>
          <div className="flex flex-col md:flex-row gap-2">
            <div className="w-full md:w-1/2">
              <div className="h-4 w-24 bg-gray-100 rounded mb-2 skeleton-shimmer" />
              <div className="h-10 w-full bg-gray-200 rounded skeleton-shimmer" />
            </div>
            <div className="w-full md:w-1/2 flex flex-col md:flex-row gap-2">
              <div className="w-full md:w-1/3">
                <div className="h-4 w-16 bg-gray-100 rounded mb-2 skeleton-shimmer" />
                <div className="h-10 w-full bg-gray-200 rounded skeleton-shimmer" />
              </div>
              <div className="w-full md:w-1/3">
                <div className="h-4 w-16 bg-gray-100 rounded mb-2 skeleton-shimmer" />
                <div className="h-10 w-full bg-gray-200 rounded skeleton-shimmer" />
              </div>
              <div className="w-full md:w-1/3">
                <div className="h-4 w-20 bg-gray-100 rounded mb-2 skeleton-shimmer" />
                <div className="h-10 w-full bg-gray-200 rounded skeleton-shimmer" />
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex items-center">
              <div className="h-4 w-24 bg-gray-100 rounded mr-2 skeleton-shimmer" />
              <div className="h-5 w-5 bg-gray-200 rounded skeleton-shimmer" />
            </div>
            <div className="flex items-center">
              <div className="h-4 w-24 bg-gray-100 rounded mr-2 skeleton-shimmer" />
              <div className="h-5 w-5 bg-gray-200 rounded skeleton-shimmer" />
            </div>
          </div>
        </div>
        {/* Pianos section */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <div className="h-5 w-20 bg-gray-200 rounded skeleton-shimmer" />
            <div className="h-8 w-24 bg-gray-100 rounded skeleton-shimmer" />
          </div>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {[1, 2].map(i => (
                <li key={i} className="py-3 px-4 flex items-center justify-between group">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0 skeleton-shimmer" />
                    <div className="min-w-0 flex-1">
                      <div className="h-4 w-32 bg-gray-200 rounded mb-1 skeleton-shimmer" />
                      <div className="h-3 w-24 bg-gray-100 rounded mb-1 skeleton-shimmer" />
                      <div className="h-3 w-20 bg-gray-100 rounded skeleton-shimmer" />
                    </div>
                  </div>
                  <div className="h-8 w-16 bg-gray-100 rounded ml-3 flex-shrink-0 skeleton-shimmer" />
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* Sticky Action Bar */}
        <div className="flex justify-end gap-3 mt-8">
          <div className="h-10 w-24 bg-gray-200 rounded skeleton-shimmer" />
          <div className="h-10 w-32 bg-gray-200 rounded skeleton-shimmer" />
        </div>
      </div>
    </div>
  );
} 