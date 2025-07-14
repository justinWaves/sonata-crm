export default function AvailabilitySkeleton() {
  return (
    <div className="w-full max-w-full md:max-w-4xl lg:max-w-7xl mx-auto space-y-8">
      {/* Weekly Availability Section */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="mb-8">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2 skeleton-shimmer"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 skeleton-shimmer"></div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-4 flex flex-col max-w-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-5 bg-gray-200 rounded w-16 skeleton-shimmer"></div>
                  <div className="flex items-center">
                    <div className="w-5 h-5 bg-gray-200 rounded skeleton-shimmer"></div>
                    <div className="ml-2 h-3 bg-gray-200 rounded w-16 skeleton-shimmer"></div>
                  </div>
                </div>
                
                <div className="flex flex-grow">
                  <div className="flex flex-col items-center w-8 mr-4">
                    <div className="w-5 h-5 bg-gray-200 rounded-full skeleton-shimmer"></div>
                    <div className="flex-grow w-px bg-gray-300 my-1"></div>
                    <div className="w-5 h-5 bg-gray-200 rounded-full skeleton-shimmer"></div>
                  </div>
                  
                  <div className="space-y-3 flex-grow">
                    {[1, 2].map((j) => (
                      <div key={j} className="p-3 rounded-lg border border-gray-200 bg-gray-100">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="h-4 bg-gray-200 rounded w-20 mb-1 skeleton-shimmer"></div>
                            <div className="h-3 bg-gray-200 rounded w-16 skeleton-shimmer"></div>
                          </div>
                          <div className="h-3 bg-gray-200 rounded w-8 skeleton-shimmer"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end mt-4">
                  <div className="h-6 bg-gray-200 rounded w-16 skeleton-shimmer"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Exception Days Section */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="mb-8">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2 skeleton-shimmer"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 skeleton-shimmer"></div>
        </div>

        <div className="space-y-6">
          <div className="flex justify-end">
            <div className="h-10 bg-gray-200 rounded w-32 skeleton-shimmer"></div>
          </div>
          
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="p-4 bg-orange-50 rounded-xl border border-orange-200">
                <div className="flex justify-between items-start mb-4">
                  <div className="h-5 bg-gray-200 rounded w-24 skeleton-shimmer"></div>
                  <div className="h-6 bg-gray-200 rounded w-16 skeleton-shimmer"></div>
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-32 skeleton-shimmer"></div>
                  <div className="h-4 bg-gray-200 rounded w-40 skeleton-shimmer"></div>
                  <div className="h-4 bg-gray-200 rounded w-28 skeleton-shimmer"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 