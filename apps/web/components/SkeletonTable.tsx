import React from 'react';

export default function SkeletonTable() {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 w-full">
      <div className="mb-8">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-2 skeleton-shimmer"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 skeleton-shimmer"></div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-max">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Name</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Phone</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Email</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Address</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Pianos</th>
              <th className="text-right py-4 px-6 text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3].map((i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-4 px-6">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full skeleton-shimmer"></div>
                    <div className="ml-4">
                      <div className="h-4 w-24 rounded skeleton-shimmer"></div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="h-4 w-20 rounded skeleton-shimmer"></div>
                </td>
                <td className="py-4 px-6">
                  <div className="h-4 w-28 rounded skeleton-shimmer"></div>
                </td>
                <td className="py-4 px-6">
                  <div className="h-4 w-32 text-nowrap rounded skeleton-shimmer"></div>
                </td>
                <td className="py-4 px-6">
                  <div className="h-4 w-16 rounded skeleton-shimmer"></div>
                </td>
                <td className="py-4 px-6 text-right">
                  <div className="flex justify-end space-x-3">
                    <div className="h-4 w-8 rounded skeleton-shimmer"></div>
                    <div className="h-4 w-8 rounded skeleton-shimmer"></div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6 flex justify-end">
        <div className="h-10 w-32 rounded skeleton-shimmer"></div>
      </div>
    </div>
  );
} 