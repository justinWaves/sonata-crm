import React, { useState, useRef, useEffect } from 'react';

interface ComboBoxProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const ComboBox: React.FC<ComboBoxProps> = ({ label, options, value, onChange, placeholder }) => {
  const [inputValue, setInputValue] = useState(value || '');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Filter options based on input
  const filteredOptions = options.filter(
    (opt) => opt.toLowerCase().includes(inputValue.toLowerCase()) && opt !== ''
  );

  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  useEffect(() => {
    if (isOpen && listRef.current) {
      const el = listRef.current.children[highlightedIndex] as HTMLElement;
      if (el) el.scrollIntoView({ block: 'nearest' });
    }
  }, [highlightedIndex, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setIsOpen(true);
    setHighlightedIndex(0);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // Delay closing to allow click
    setTimeout(() => setIsOpen(false), 100);
  };

  const handleOptionClick = (option: string) => {
    setInputValue(option);
    onChange(option);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      setIsOpen(true);
      return;
    }
    if (e.key === 'ArrowDown') {
      setHighlightedIndex((i) => Math.min(i + 1, filteredOptions.length - 1));
    } else if (e.key === 'ArrowUp') {
      setHighlightedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      if (isOpen && filteredOptions[highlightedIndex]) {
        handleOptionClick(filteredOptions[highlightedIndex]);
      } else {
        onChange(inputValue);
        setIsOpen(false);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative w-full">
      <label className="block text-sm font-medium mb-1 text-gray-700">{label}</label>
      <input
        ref={inputRef}
        type="text"
        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        aria-autocomplete="list"
        aria-expanded={isOpen}
        aria-controls="combobox-listbox"
        aria-activedescendant={isOpen ? `combobox-option-${highlightedIndex}` : undefined}
      />
      {isOpen && filteredOptions.length > 0 && (
        <ul
          ref={listRef}
          id="combobox-listbox"
          className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded shadow-lg max-h-56 overflow-auto"
          role="listbox"
        >
          {filteredOptions.map((option, idx) => (
            <li
              key={option}
              id={`combobox-option-${idx}`}
              role="option"
              aria-selected={highlightedIndex === idx}
              className={`px-3 py-2 cursor-pointer ${highlightedIndex === idx ? 'bg-blue-100 text-blue-900' : ''}`}
              onMouseDown={() => handleOptionClick(option)}
              onMouseEnter={() => setHighlightedIndex(idx)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ComboBox; 