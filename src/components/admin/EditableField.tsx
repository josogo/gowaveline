
import React, { useState, useRef, useEffect } from 'react';
import { Edit2, Check, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface EditableFieldProps {
  value: string;
  tableName: string;
  recordId: string;
  fieldName: string;
  userId?: string; // Optional user ID for audit trail
  options?: string[]; // For dropdown fields
}

const EditableField: React.FC<EditableFieldProps> = ({
  value,
  tableName,
  recordId,
  fieldName,
  userId = 'admin',
  options
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLSelectElement>(null);
  
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);
  
  const handleEdit = () => {
    setIsEditing(true);
  };
  
  const handleCancel = () => {
    setCurrentValue(value);
    setIsEditing(false);
  };
  
  const handleSave = async () => {
    if (currentValue === value) {
      setIsEditing(false);
      return;
    }
    
    try {
      const response = await fetch('https://rqwrvkkfixrogxogunsk.supabase.co/functions/v1/edit-field', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tableName,
          recordId,
          fieldName,
          newValue: currentValue,
          userId
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update field');
      }
      
      toast.success(`${fieldName.replace(/_/g, ' ')} updated successfully`);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating field:', error);
      toast.error('Failed to update field');
      setCurrentValue(value);
      setIsEditing(false);
    }
  };
  
  if (isEditing) {
    if (options) {
      return (
        <div className="flex items-center gap-1">
          <select
            ref={inputRef as React.RefObject<HTMLSelectElement>}
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
            className="border rounded px-2 py-1 text-sm w-full"
          >
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <div className="flex gap-1">
            <button
              onClick={handleSave}
              className="text-green-500 hover:text-green-700"
              title="Save"
            >
              <Check className="h-4 w-4" />
            </button>
            <button
              onClick={handleCancel}
              className="text-red-500 hover:text-red-700"
              title="Cancel"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      );
    }
    
    return (
      <div className="flex items-center gap-1">
        <input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          type="text"
          value={currentValue}
          onChange={(e) => setCurrentValue(e.target.value)}
          className="border rounded px-2 py-1 text-sm w-full"
        />
        <div className="flex gap-1">
          <button
            onClick={handleSave}
            className="text-green-500 hover:text-green-700"
            title="Save"
          >
            <Check className="h-4 w-4" />
          </button>
          <button
            onClick={handleCancel}
            className="text-red-500 hover:text-red-700"
            title="Cancel"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      className="group flex items-center cursor-pointer" 
      onClick={handleEdit}
    >
      <span className="mr-2">{value}</span>
      <Edit2 className="h-3.5 w-3.5 opacity-0 group-hover:opacity-70 transition-opacity" />
    </div>
  );
};

export default EditableField;
