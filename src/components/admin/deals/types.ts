
import { Deal, DealDocument } from "@/contexts/CrmDataContext";
import { Contact } from "@/components/admin/contacts/types";

export type DealDialogType = 'add' | 'edit' | 'detail' | 'document' | null;

export interface DealsState {
  isDialogOpen: boolean;
  isDetailOpen: boolean;
  isDocUploadOpen: boolean;
  editingDeal: string | null;
  selectedDeal: Deal | null;
  searchQuery: string;
  sortField: keyof Deal;
  sortDirection: 'asc' | 'desc';
  editingContact: Contact | null;
}

export interface DocumentTypeMap {
  [key: string]: string;
}
