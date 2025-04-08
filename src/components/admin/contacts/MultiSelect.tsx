
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
  // Ensure we have valid arrays
  const safeOptions = Array.isArray(options) ? [...options] : [];
  const safeSelected = Array.isArray(selected) ? [...selected] : [];
  
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  // Remove an item from selection
  const handleUnselect = (item: string) => {
    onChange(safeSelected.filter(i => i !== item));
  };

  // Add or remove an item from selection
  const handleSelect = (item: string) => {
    if (!item || item.trim() === '') return;
    
    const trimmedItem = item.trim();
    const isSelected = safeSelected.includes(trimmedItem);
    
    if (isSelected) {
      onChange(safeSelected.filter(i => i !== trimmedItem));
    } else {
      onChange([...safeSelected, trimmedItem]);
    }
    
    setInputValue('');
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  // Create a new tag if it doesn't exist
  const handleCreateTag = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !safeOptions.includes(trimmedValue) && !safeSelected.includes(trimmedValue)) {
      handleSelect(trimmedValue);
    }
  };

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (open && e.key === 'Enter' && inputValue.trim()) {
        handleCreateTag();
        e.preventDefault();
      }
      
      if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, inputValue]);

  return (
    <div className="relative" ref={containerRef}>
      <div
        className="flex flex-wrap gap-1 p-1 border rounded-md bg-background min-h-10"
        onClick={() => {
          setOpen(true);
          setTimeout(() => {
            inputRef.current?.focus();
          }, 0);
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
          onBlur={() => {
            setTimeout(() => {
              if (document.activeElement !== inputRef.current) {
                if (inputValue.trim()) {
                  handleCreateTag();
                }
                setOpen(false);
              }
            }, 150);
          }}
        />
        <div className="self-center ml-auto">
          <ChevronsUpDown className="h-4 w-4 opacity-50" />
        </div>
      </div>

      {open && (
        <div className="absolute top-full w-full z-50 mt-1">
          <div className="w-full border rounded-md shadow-md bg-popover">
            <CommandPrimitive 
              className="w-full rounded-md bg-popover overflow-hidden"
              shouldFilter={false} // Important: handle filtering manually
            >
              <div className="h-auto max-h-64 overflow-auto p-1">
                {safeOptions.length > 0 ? (
                  safeOptions.map((option) => (
                    <CommandPrimitive.Item
                      key={option}
                      onSelect={() => handleSelect(option)}
                      className={cn(
                        "flex items-center gap-2 py-1.5 px-2 rounded-sm text-sm cursor-default",
                        safeSelected.includes(option) ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      <div className={cn("mr-2 flex h-4 w-4 items-center justify-center rounded-sm border",
                        safeSelected.includes(option) ? "bg-primary border-primary" : "opacity-50"
                      )}>
                        {safeSelected.includes(option) && <Check className="h-3 w-3 text-primary-foreground" />}
                      </div>
                      {option}
                    </CommandPrimitive.Item>
                  ))
                ) : (
                  <div className="py-2 px-2 text-sm text-muted-foreground">
                    No options available
                  </div>
                )}
                
                {inputValue.trim() && !safeOptions.includes(inputValue.trim()) && (
                  <CommandPrimitive.Item
                    onSelect={() => handleCreateTag()}
                    className="flex items-center gap-2 py-1.5 px-2 rounded-sm text-sm cursor-default hover:bg-accent hover:text-accent-foreground italic"
                  >
                    Create "{inputValue.trim()}"
                  </CommandPrimitive.Item>
                )}
              </div>
            </CommandPrimitive>
          </div>
        </div>
      )}
    </div>
  );
};
