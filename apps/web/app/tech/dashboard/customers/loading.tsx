import SkeletonCard from '../../../../components/SkeletonCard';
import SkeletonTable from '../../../../components/SkeletonTable';

export default function CustomersLoading() {
  return (
    <>
      {/* Desktop */}
      <div className="hidden md:block pt-[44px] w-fit md:pr-8 mx-auto">
        <SkeletonTable />
      </div>
      {/* Mobile */}
      <div className="flex flex-col gap-2 md:hidden p-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </>
  );
} 