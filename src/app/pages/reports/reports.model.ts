export interface ServiceSale {
  serviceId?: number;
  serviceName?: string;
  sum_of_transactions: number;
  sum_of_commission: number;
}

export interface SearchResult {
  rows: ServiceSale[];
  total: number;
  empty: boolean;
}
