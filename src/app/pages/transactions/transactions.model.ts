// Transaction data
export interface Transaction {
  id: number;
  agent_msisdn: number;
  customer_msisdn: number;
  serviceId: number;
  serviceName?: string;
  amount: number;
  message: string;
  status?: any;
  statusText?: string;
  statusColor?: string;
  transaction_id?: string;
  commission?: number;
  date_created: any;
  transaction_date?: any;
  transaction_amount?: number;
}

export interface SearchResult {
  rows: Transaction[];
  total: number;
  empty: boolean;
}

export enum CommissionPercentages {
  ZESCO_DISCOUNT_PERCENTAGE = 1,
  AIRTEL_AIRTIME_DISCOUNT_PERCENTAGE = 4,
  MTN_AIRTIME_DISCOUNT_PERCENTAGE = 4,
  ZAMTEL_AIRTIME_DISCOUNT_PERCENTAGE = 5,
}
