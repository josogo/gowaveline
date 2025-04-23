
export interface Bank {
  id: number;
  name: string;
  compatibility: number;
  notes: string;
  apiAvailable: boolean;
}

export interface BankRoutingSystemProps {
  onBack: () => void;
}
