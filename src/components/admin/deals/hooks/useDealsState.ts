
import { useState, useMemo } from 'react';
import { useCrmData, Deal } from '@/contexts/CrmDataContext';
import { DealsState } from '../types';

export const useDealsState = (dealIdFromUrl: string | null) => {
  const { deals, setDeals } = useCrmData();
  
  const [state, setState] = useState<DealsState>({
    isDialogOpen: false,
    isDetailOpen: false,
    isDocUploadOpen: false,
    editingDeal: null,
    selectedDeal: null,
    searchQuery: '',
    sortField: 'createdAt',
    sortDirection: 'desc',
    editingContact: null
  });

  // Initialize selected deal from URL if provided
  useState(() => {
    if (dealIdFromUrl) {
      const deal = deals.find(d => d.id === dealIdFromUrl);
      if (deal) {
        setState(prev => ({
          ...prev,
          selectedDeal: deal,
          isDetailOpen: true
        }));
      }
    }
  });

  const filteredDeals = useMemo(() => {
    console.log('Filtering deals with search query:', state.searchQuery);
    return deals
      .filter(deal => 
        deal.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        deal.contactName.toLowerCase().includes(state.searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        if (state.sortField === 'value') {
          return state.sortDirection === 'asc' 
            ? a.value - b.value 
            : b.value - a.value;
        } else {
          const valueA = a[state.sortField]?.toString() || '';
          const valueB = b[state.sortField]?.toString() || '';
          return state.sortDirection === 'asc'
            ? valueA.localeCompare(valueB)
            : valueB.localeCompare(valueA);
        }
      });
  }, [deals, state.searchQuery, state.sortField, state.sortDirection]);

  return {
    state,
    setState,
    filteredDeals
  };
};
