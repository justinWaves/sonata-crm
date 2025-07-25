import { ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  widthClass?: string; // e.g. 'max-w-md', 'max-w-lg', etc.
}

export default function Modal({ isOpen, onClose, title, children, widthClass = 'max-w-md' }: ModalProps) {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => { 
    setIsClient(true); 
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        console.log('Escape key pressed');
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape, true);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape, true);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !isClient) return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-sm p-0 md:p-4" 
      onClick={(e) => {
        console.log('Backdrop clicked');
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }}
    >
      <div className={`relative w-full h-full md:h-auto ${widthClass} bg-white rounded-none md:rounded-2xl shadow-xl p-6 md:p-8 flex flex-col md:max-h-[90vh]`} onClick={(e) => e.stopPropagation()}>
        <button
          onClick={(e) => {
            console.log('Modal X button clicked');
            e.preventDefault();
            e.stopPropagation();
            onClose();
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          aria-label="Close"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 focus:outline-none z-10 cursor-pointer"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6 pr-10">{title}</h2>
        <div className="flex-1 overflow-y-auto px-6 md:px-10">{children}</div>
      </div>
    </div>,
    document.body
  );
} 