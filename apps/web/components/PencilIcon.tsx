export default function PencilIcon({ className = '' }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center justify-center border border-gray-300 rounded bg-white hover:bg-gray-100 cursor-pointer transition p-1 ${className}`}
      tabIndex={0}
      role="button"
    >
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 3.487a2.25 2.25 0 1 1 3.182 3.182L7.5 19.213l-4 1 1-4 12.362-12.726z" />
      </svg>
    </span>
  );
} 