import React, { useState, useRef, useEffect } from 'react';
import { Command, CommandGroup, CommandItem, CommandEmpty } from '@/components/ui/command';
import { X, Check, ChevronsUpDown } from 'lucide-react';

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
  // Make absolutely sure we have valid arrays for options and selected
  const safeOptions = Array.isArray(options) ? [...options] : [];
  const safeSelected = Array.isArray(selected) ? [...selected] : [];
  
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const commandRef = useRef<HTMLDivElement>(null);
  const [commandItems, setCommandItems] = useState<string[]>([]);

  // Set command items whenever safeOptions changes
  useEffect(() => {
    setCommandItems(safeOptions);
  }, [safeOptions]);

  const handleUnselect = (item: string) => {
    onChange(safeSelected.filter(i => i !== item));
  };

  const handleSelect = (item: string) => {
    if (!item) return; // Guard against empty values
    
    const isSelected = safeSelected.includes(item);
    
    if (isSelected) {
      onChange(safeSelected.filter(i => i !== item));
    } else {
      onChange([...safeSelected, item]);
    }
    
    // Keep focus on input and reset input value after selection
    setInputValue('');
    inputRef.current?.focus();
  };

  const handleCreateTag = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !safeOptions.includes(trimmedValue) && !safeSelected.includes(trimmedValue)) {
      handleSelect(trimmedValue);
    }
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (commandRef.current && !commandRef.current.contains(event.target as Node)) {
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

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (open && e.key === 'Enter' && inputValue) {
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
    <div className="relative" ref={commandRef}>
      <div
        className="flex flex-wrap gap-1 p-1 border rounded-md bg-background min-h-10"
        onClick={() => {
          setOpen(true);
          setTimeout(() => {
            inputRef.current?.focus();
          }, 0);
        }}
      >
        {safeSelected.map(item => (
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
            // Delayed closing to allow click events to register first
            setTimeout(() => {
              if (document.activeElement !== inputRef.current) {
                handleCreateTag();
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
          <Command className="w-full border rounded-md shadow-md bg-popover">
            <CommandGroup className="h-auto max-h-64 overflow-auto">
              {safeOptions.length > 0 ? (
                safeOptions.map(option => (
                  <CommandItem
                    key={option}
                    onSelect={() => handleSelect(option)}
                    className="flex items-center gap-2 py-1"
                  >
                    <div className={`mr-2 flex h-4 w-4 items-center justify-center rounded-sm border ${
                      safeSelected.includes(option) ? 'bg-primary border-primary' : 'opacity-50'
                    }`}>
                      {safeSelected.includes(option) && <Check className="h-3 w-3 text-primary-foreground" />}
                    </div>
                    {option}
                  </CommandItem>
                ))
              ) : (
                <CommandItem disabled className="py-2 px-2 text-sm text-muted-foreground">
                  No options available
                </CommandItem>
              )}
              {inputValue.trim() && !safeOptions.includes(inputValue.trim()) && (
                <CommandItem
                  onSelect={() => handleCreateTag()}
                  className="flex items-center gap-2 py-1 italic"
                >
                  Create "{inputValue.trim()}"
                </CommandItem>
              )}
            </CommandGroup>
          </Command>
        </div>
      )}
    </div>
  );
};
