import { Injectable, PipeTransform } from '@angular/core';
import { SortDirection } from '../../shared/directives/shared-sortable.directive';
import { BehaviorSubject, Subject, Observable, of } from 'rxjs';
import { DecimalPipe } from '@angular/common';
import {
  catchError,
  tap,
  debounceTime,
  switchMap,
  delay,
} from 'rxjs/operators';

// Data
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ServiceSale, SearchResult } from './reports.model';
import { Transaction } from '../transactions/transactions.model';

import exportFromJSON from 'export-from-json';
import { environment } from 'src/environments/environment';
import { TransactionsService } from '../transactions/transactions.service';

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: string;
  sortDirection: SortDirection;
  startIndex: number;
  endIndex: number;
  totalRecords: number;
}

function compare(v1, v2) {
  return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
}

/**
 * Sort the table data
 * @param row ServiceSale field value
 * @param column Fetch the column
 * @param direction Sort direction Ascending or Descending
 */
function sort(
  row: ServiceSale[],
  column: string,
  direction: string
): ServiceSale[] {
  if (direction === '') {
    return row;
  } else {
    return [...row].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

/**
 * ServiceSale Data Match with Search input
 * @param row ServiceSale field value fetch
 * @param term Search the value
 */
function matches(row: ServiceSale, term: string, pipe: PipeTransform) {
  return (
    // row.serviceId.toString().toLowerCase().includes(term) ||
    (row.sum_of_transactions !== null &&
      row.sum_of_transactions.toString().toLowerCase().includes(term)) ||
    row.serviceName.toLowerCase().includes(term)
  );
}
@Injectable({
  providedIn: 'root',
})
export class SalesReportService {
  serviceSales: ServiceSale[] = [];

  private reportsUrl = environment.api.vokaadmin.url;

  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _rows$ = new BehaviorSubject<ServiceSale[]>([]);
  private _total$ = new BehaviorSubject<number>(0);
  private _empty$ = new BehaviorSubject<boolean>(false);
  private _commissions$ = new BehaviorSubject([]);
  private _state: State = {
    page: 1,
    pageSize: 10,
    searchTerm: '',
    sortColumn: '',
    sortDirection: '',
    startIndex: 1,
    endIndex: 10,
    totalRecords: 0,
  };
  private _services = [
    {
      serviceId: 1,
      serviceName: 'Airtel Airtime',
    },
    {
      serviceId: 2,
      serviceName: 'MTN Airtime',
    },
    {
      serviceId: 3,
      serviceName: 'Zamtel Airtime',
    },
    {
      serviceId: 4,
      serviceName: 'ZESCO',
    },
    {
      serviceId: 5,
      serviceName: 'DSTV',
    },
    {
      serviceId: 6,
      serviceName: 'GoTV',
    },
    {
      serviceId: 7,
      serviceName: 'TopStar',
    },
    {
      serviceId: 8,
      serviceName: 'Lusaka Water and Sewerage',
    },
    {
      serviceId: 50,
      serviceName: 'Airtel Money',
    },
    {
      serviceId: 51,
      serviceName: 'MTN Money',
    },
    {
      serviceId: 52,
      serviceName: 'Zamtel Kwacha',
    },
    // {
    //   serviceId: 54,
    //   serviceName: 'Agent Topup',
    // },
  ];

  constructor(
    private http: HttpClient,
    private pipe: DecimalPipe,
    private transactionsService: TransactionsService
  ) {}

  /**
   * Returns the value
   */
  get sales$() {
    return this._rows$.asObservable();
  }
  get total$() {
    return this._total$.asObservable();
  }

  get commissions$() {
    return this._commissions$.asObservable();
  }

  get empty$() {
    return this._empty$.asObservable();
  }

  get loading$() {
    return this._loading$.asObservable();
  }
  get page() {
    return this._state.page;
  }
  get pageSize() {
    return this._state.pageSize;
  }
  get searchTerm() {
    return this._state.searchTerm;
  }
  get startIndex() {
    return this._state.startIndex;
  }
  get endIndex() {
    return this._state.endIndex;
  }
  get totalRecords() {
    return this._state.totalRecords;
  }

  set page(page: number) {
    this._set({ page });
  }
  set pageSize(pageSize: number) {
    this._set({ pageSize });
  }
  set startIndex(startIndex: number) {
    this._set({ startIndex });
  }
  set endIndex(endIndex: number) {
    this._set({ endIndex });
  }
  set totalRecords(totalRecords: number) {
    this._set({ totalRecords });
  }
  set searchTerm(searchTerm: string) {
    this._set({ searchTerm });
  }
  set sortColumn(sortColumn: string) {
    this._set({ sortColumn });
  }
  set sortDirection(sortDirection: SortDirection) {
    this._set({ sortDirection });
  }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  /**
   * Search Method
   */
  private _search(transactionData): Observable<SearchResult> {
    const {
      sortColumn,
      sortDirection,
      pageSize,
      page,
      searchTerm,
    } = this._state;

    // 1. sort
    let rows = sort(transactionData, sortColumn, sortDirection);

    // 2. filter
    rows = rows.filter((row) =>
      matches(row, searchTerm.toLowerCase(), this.pipe)
    );
    const total = rows.length;
    const empty = total === 0;

    // 3. paginate
    this.totalRecords = rows.length;
    this._state.startIndex = (page - 1) * this.pageSize;
    this._state.endIndex = (page - 1) * this.pageSize + this.pageSize;
    if (this.endIndex > this.totalRecords) {
      this.endIndex = this.totalRecords;
    }
    rows = rows.slice(this._state.startIndex, this._state.endIndex);

    return of({ rows, total, empty });
  }

  // API
  // Get all transactions
  public getSumOfTransactions(serviceId: number): Observable<ServiceSale[]> {
    this.transactionsService._fetchTransactions();
    let url = `${this.reportsUrl}/records/sum-of-transactions-by-serviceId/${serviceId}`;

    return this.http
      .get<ServiceSale[]>(url)
      .pipe(
        catchError(this.handleError<ServiceSale[]>('getSumOfTransactions', []))
      );
  }

  public _fetchSales() {
    this._services.forEach(({ serviceId, serviceName }) => {
      this.getSumOfTransactions(serviceId).subscribe((transactionSum) => {
        let sale = this.mapServiceSales(transactionSum);
        this.serviceSales.push({
          ...sale[0],
          serviceId,
          serviceName,
        });

        this._search$
          .pipe(
            tap(() => this._loading$.next(true)),
            debounceTime(200),
            switchMap(() => this._search(this.serviceSales)),
            delay(200),
            tap(() => this._loading$.next(false))
          )
          .subscribe((result) => {
            this._rows$.next(result.rows);
            this._total$.next(result.total);
            this._empty$.next(result.empty);
          });

        this._search$.next();
      });
    });
  }

  public exportSales(fileName: string, dateFrom?: Date, dateTo?: Date) {
    // Export type
    const exportType = 'csv';
    // Export data
    let tx: Transaction[] = this.transactionsService.transactionData;
    let salesExport;

    if (dateFrom !== undefined && dateTo !== undefined) {
      // Cater for single day transactions
      if (dateFrom.getTime() === dateTo.getTime()) {
        dateTo.setDate(dateTo.getDate() + 1);
      }
      tx = this.filterByDate(tx, dateFrom, dateTo);
      salesExport = this.mapSalesExport(this.mapSales(tx));
    } else {
      salesExport = this.mapSalesExport(this.mapSales(tx));
    }

    exportFromJSON({ data: salesExport, fileName, exportType });
  }

  private filterByDate(
    transactions: Transaction[],
    dateFrom: Date,
    dateTo: Date
  ): Transaction[] {
    let tx = transactions;
    tx = tx.map((transaction) => {
      return Object.assign(transaction, {
        date_created: new Date(transaction.date_created),
      });
    });
    tx = tx.filter((transaction) => {
      if (
        transaction.date_created.getTime() >= dateFrom.getTime() &&
        transaction.date_created.getTime() <= dateTo.getTime()
      )
        return transaction;
    });

    return tx;
  }

  private mapSalesExport(serviceSales: ServiceSale[]) {
    return serviceSales.map((serviceSale) => {
      return {
        Service: serviceSale.serviceName,
        'Sum of Sales': serviceSale.sum_of_transactions,
        'Total Commission':
          serviceSale.sum_of_commission !== null
            ? serviceSale.sum_of_commission
            : Number(0).toFixed(2),
      };
    });
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.error(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  private log(message: string) {
    console.info(`TransactionsService: ${message}`);
  }

  private mapSales(transactions: Transaction[]): ServiceSale[] {
    return this._services.map((service) => {
      return {
        ...service,
        sum_of_transactions: transactions.reduce(
          (sum, { serviceId, status, amount }) =>
            status === 100 && serviceId === service.serviceId
              ? sum + amount
              : sum,
          0
        ),
        sum_of_commission: transactions.reduce(
          (sum, { serviceId, status, commission }) =>
            status === 100 && serviceId === service.serviceId
              ? sum + commission
              : sum,
          0
        ),
      };
    });
  }

  private mapServiceSales(sales: ServiceSale[]) {
    return sales.map((sale) => {
      if (sale.sum_of_commission === null) sale.sum_of_commission = 0;
      if (sale.sum_of_transactions === null) sale.sum_of_transactions = 0;

      return sale;
    });
  }
}
