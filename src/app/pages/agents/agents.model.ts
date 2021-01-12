export interface Agent {
  id?: number;
  MSISDN: string;
  first_name: string;
  last_name: string;
  location: string;
  status?: AgentStatus;
  statusText?: string;
  statusColor?: string;
  balance?: number;
  date_created: any;
  pin: string;
  NRC?: string;
  email?: string;
}

export interface Partner {
  id?: number;
  name: string;
  email: string;
  userId?: number;
  created_at?: any;
  updated_at?: any;
  password: string;
  phone_number: string;
  isActive?: string;
  balance?: number;
  commission_balance?: number;
  statusColor?: string;
  statusText?: string;
}

export interface SearchResult {
  rows: any[];
  total: number;
}

export enum AgentStatus {
  ACTIVE = 150,
  INACTIVE = 120,
}
