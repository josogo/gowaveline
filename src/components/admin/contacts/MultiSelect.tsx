
import React, { useState, useRef, useEffect } from 'react';
import { Command as CommandPrimitive } from 'cmdk';
import { X, Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MultiSelectProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  selected,
  onChange,
  placeholder = 'Select options'
}) => {
  // Ensure we always have valid arrays, never undefined
  const safeOptions = Array.isArray(options) ? options : [];
  const safeSelected = Array.isArray(selected) ? selected : [];
  
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const commandRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Remove an item from selection
  const handleUnselect = (item: string) => {
    onChange(safeSelected.filter(i => i !== item));
  };

  // Toggle select/unselect for an item
  const handleSelect = (item: string) => {
    if (!item || item.trim() === '') return;
    
    const itemExists = safeSelected.includes(item);
    if (itemExists) {
      onChange(safeSelected.filter(i => i !== item));
    } else {
      onChange([...safeSelected, item]);
    }
    
    setInputValue('');
    inputRef.current?.focus();
  };

  // Create a new tag if it doesn't exist
  const handleCreateTag = () => {
    const value = inputValue.trim();
    if (!value) return;
    
    if (!safeOptions.includes(value) && !safeSelected.includes(value)) {
      handleSelect(value);
    }
    setInputValue('');
  };

  // Filter options based on input value
  const filteredOptions = safeOptions.filter(option => 
    !safeSelected.includes(option) && 
    option.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <div className="relative" ref={containerRef}>
      <div
        className="flex flex-wrap gap-1 p-1 border rounded-md bg-background min-h-10"
        onClick={() => {
          setOpen(true);
          setTimeout(() => inputRef.current?.focus(), 0);
        }}
      >
        {safeSelected.map((item) => (
          <div
            key={item}
            className="flex items-center bg-secondary text-secondary-foreground h-7 rounded-sm px-2 text-xs"
          >
            {item}
            <button
              type="button"
              className="ml-1 outline-none"
              onClick={(e) => {
                e.stopPropagation();
                handleUnselect(item);
              }}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove {item}</span>
            </button>
          </div>
        ))}
        <input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={safeSelected.length ? '' : placeholder}
          className="flex-1 outline-none bg-transparent py-1 px-2 text-sm placeholder:text-muted-foreground"
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && inputValue.trim()) {
              e.preventDefault();
              handleCreateTag();
            }
            if (e.key === 'Escape') {
              setOpen(false);
            }
          }}
        />
        <div className="self-center ml-auto">
          <ChevronsUpDown className="h-4 w-4 opacity-50" />
        </div>
      </div>

      {open && (
        <div className="absolute top-full w-full z-50 mt-1">
          <div className="w-full border rounded-md shadow-md bg-popover p-1">
            <div ref={commandRef} className="max-h-64 overflow-auto">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <div
                    key={option}
                    className={cn(
                      "flex items-center gap-2 py-1.5 px-2 rounded-sm text-sm cursor-default hover:bg-accent hover:text-accent-foreground"
                    )}
                    onClick={() => handleSelect(option)}
                  >
                    <div className="mr-2 flex h-4 w-4 items-center justify-center rounded-sm border opacity-50">
                      {safeSelected.includes(option) && <Check className="h-3 w-3 text-primary-foreground" />}
                    </div>
                    {option}
                  </div>
                ))
              ) : (
                <div className="py-2 px-2 text-sm text-muted-foreground">
                  {inputValue.trim() ? 'No matching options' : 'No options available'}
                </div>
              )}
              
              {inputValue.trim() && !safeOptions.includes(inputValue.trim()) && !safeSelected.includes(inputValue.trim()) && (
                <div
                  className="flex items-center gap-2 py-1.5 px-2 rounded-sm text-sm cursor-default hover:bg-accent hover:text-accent-foreground italic"
                  onClick={() => handleCreateTag()}
                >
                  Create "{inputValue.trim()}"
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
