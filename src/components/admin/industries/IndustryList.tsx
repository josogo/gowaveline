
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Industry } from './types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Loader2, PlusCircle } from 'lucide-react';
import { toast } from 'sonner';

interface IndustryListProps {
  onSelectIndustry: (id: string) => void;
}

export const IndustryList: React.FC<IndustryListProps> = ({ onSelectIndustry }) => {
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [loading, setLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newIndustry, setNewIndustry] = useState({ name: '', description: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchIndustries();
  }, []);

  const fetchIndustries = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('industries')
        .select('*')
        .order('name');
        
      if (error) {
        throw error;
      }
      
      setIndustries(data || []);
      if (data && data.length > 0 && !industries.length) {
        onSelectIndustry(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching industries:', error);
      toast.error('Failed to load industries');
    } finally {
      setLoading(false);
    }
  };

  const handleAddIndustry = async () => {
    if (!newIndustry.name.trim()) {
      toast.error('Industry name is required');
      return;
    }

    setSaving(true);
    try {
      const { data, error } = await supabase
        .from('industries')
        .insert([
          {
            name: newIndustry.name.trim(),
            description: newIndustry.description.trim() || null
          }
        ])
        .select();

      if (error) {
        throw error;
      }

      toast.success(`Industry "${newIndustry.name}" added successfully`);
      setNewIndustry({ name: '', description: '' });
      setAddDialogOpen(false);
      fetchIndustries();
      
      if (data && data.length > 0) {
        onSelectIndustry(data[0].id);
      }
    } catch (error: any) {
      console.error('Error adding industry:', error);
      toast.error(error.message || 'Failed to add industry');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Industries</h2>
        <Button
          onClick={() => setAddDialogOpen(true)}
          variant="ghost"
          size="sm"
        >
          <PlusCircle className="h-4 w-4 mr-1" />
          Add
        </Button>
      </div>
      
      <div className="max-h-[600px] overflow-y-auto">
        {loading ? (
          <div className="flex justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
          </div>
        ) : industries.length === 0 ? (
          <p className="text-gray-500 p-4 text-center">No industries found. Add your first industry.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {industries.map((industry) => (
              <li key={industry.id}>
                <button
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors"
                  onClick={() => onSelectIndustry(industry.id)}
                >
                  <h3 className="font-medium text-gray-900">{industry.name}</h3>
                  {industry.description && (
                    <p className="text-sm text-gray-500 mt-1 truncate">{industry.description}</p>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Industry</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Industry Name
              </label>
              <Input
                id="name"
                value={newIndustry.name}
                onChange={(e) => setNewIndustry({ ...newIndustry, name: e.target.value })}
                placeholder="e.g., Healthcare"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description (Optional)
              </label>
              <Input
                id="description"
                value={newIndustry.description}
                onChange={(e) => setNewIndustry({ ...newIndustry, description: e.target.value })}
                placeholder="Brief description of this industry"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddIndustry} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Industry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
