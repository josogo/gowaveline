
import React, { useState, useRef, useEffect } from 'react';
import { Command, CommandGroup, CommandItem } from '@/components/ui/command';
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
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUnselect = (item: string) => {
    onChange(selected.filter(i => i !== item));
  };

  const handleSelect = (item: string) => {
    if (selected.includes(item)) {
      handleUnselect(item);
    } else {
      onChange([...selected, item]);
    }
  };

  const handleCreateTag = () => {
    if (inputValue && !options.includes(inputValue) && !selected.includes(inputValue)) {
      handleSelect(inputValue);
      setInputValue('');
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (open && e.key === 'Enter' && inputValue) {
        handleCreateTag();
        e.preventDefault();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, inputValue]);

  return (
    <div className="relative">
      <div
        className="flex flex-wrap gap-1 p-1 border rounded-md bg-background min-h-10"
        onClick={() => {
          setOpen(true);
          inputRef.current?.focus();
        }}
      >
        {selected.map(item => (
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
          placeholder={selected.length ? '' : placeholder}
          className="flex-1 outline-none bg-transparent py-1 px-2 text-sm placeholder:text-muted-foreground"
          onFocus={() => setOpen(true)}
          onBlur={() => {
            setOpen(false);
            handleCreateTag();
          }}
        />
        <div className="self-center ml-auto">
          <ChevronsUpDown className="h-4 w-4 opacity-50" />
        </div>
      </div>
      {open && (
        <Command className="absolute top-full w-full z-10 mt-1 border rounded-md shadow-md bg-popover">
          <CommandGroup className="h-auto max-h-64 overflow-auto">
            {options.map(option => (
              <CommandItem
                key={option}
                onSelect={() => handleSelect(option)}
                className="flex items-center gap-2 py-1"
              >
                <div className={`mr-2 flex h-4 w-4 items-center justify-center rounded-sm border ${
                  selected.includes(option) ? 'bg-primary border-primary' : 'opacity-50'
                }`}>
                  {selected.includes(option) && <Check className="h-3 w-3 text-primary-foreground" />}
                </div>
                {option}
              </CommandItem>
            ))}
            {inputValue && !options.includes(inputValue) && (
              <CommandItem
                onSelect={handleCreateTag}
                className="flex items-center gap-2 py-1 italic"
              >
                Create "{inputValue}"
              </CommandItem>
            )}
          </CommandGroup>
        </Command>
      )}
    </div>
  );
};
