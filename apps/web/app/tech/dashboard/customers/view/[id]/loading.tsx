export default function ViewCustomerLoading() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <div className="h-8 bg-gray-200 rounded w-40 skeleton-shimmer"></div>
            <div className="w-6 h-6 bg-gray-200 rounded skeleton-shimmer"></div>
          </div>
          
          {/* Content */}
          <div className="p-6">
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full skeleton-shimmer"></div>
                  <div className="space-y-2">
                    <div className="h-6 bg-gray-200 rounded w-32 skeleton-shimmer"></div>
                    <div className="h-4 bg-gray-200 rounded w-24 skeleton-shimmer"></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-20 skeleton-shimmer"></div>
                    <div className="h-4 bg-gray-200 rounded w-32 skeleton-shimmer"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-16 skeleton-shimmer"></div>
                    <div className="h-4 bg-gray-200 rounded w-28 skeleton-shimmer"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-12 skeleton-shimmer"></div>
                    <div className="h-4 bg-gray-200 rounded w-40 skeleton-shimmer"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-14 skeleton-shimmer"></div>
                    <div className="h-4 bg-gray-200 rounded w-36 skeleton-shimmer"></div>
                  </div>
                </div>
              </div>
              
              {/* Pianos Section */}
              <div className="space-y-4">
                <div className="h-5 bg-gray-200 rounded w-24 skeleton-shimmer"></div>
                <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <div key={i} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg skeleton-shimmer"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-32 skeleton-shimmer"></div>
                          <div className="h-3 bg-gray-200 rounded w-24 skeleton-shimmer"></div>
                          <div className="h-3 bg-gray-200 rounded w-28 skeleton-shimmer"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4">
                <div className="h-10 bg-gray-200 rounded w-20 skeleton-shimmer"></div>
                <div className="h-10 bg-gray-200 rounded w-24 skeleton-shimmer"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 