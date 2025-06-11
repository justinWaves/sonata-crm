import Image from 'next/image';

export default function Logo({ className = '', width = 64, height = 64 }: { className?: string; width?: number; height?: number }) {
  return (
    <Image
      src="/sonarta-crm-logo.svg"
      alt="Sonata CRM Logo"
      width={width}
      height={height}
      className={className}
      priority
      style={{ height: 'auto', width: width }}
    />
  );
} 