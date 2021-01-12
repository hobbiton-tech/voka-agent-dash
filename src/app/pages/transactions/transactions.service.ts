import { Injectable, PipeTransform } from '@angular/core';
import { SortDirection } from '../../shared/directives/shared-sortable.directive';
import {
  Transaction,
  SearchResult,
  CommissionPercentages,
} from './transactions.model';
import { BehaviorSubject, Subject, Observable, of } from 'rxjs';
import { DecimalPipe, formatDate } from '@angular/common';
import {
  tap,
  debounceTime,
  switchMap,
  delay,
  catchError,
} from 'rxjs/operators';

import { HttpHeaders, HttpClient } from '@angular/common/http';
import exportFromJSON from 'export-from-json';
import { environment } from 'src/environments/environment';

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
 * @param row Transaction field value
 * @param column Fetch the column
 * @param direction Sort direction Ascending or Descending
 */
function sort(
  row: Transaction[],
  column: string,
  direction: string
): Transaction[] {
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
 * Transaction Data Match with Search input
 * @param row Transaction field value fetch
 * @param term Search the value
 */
function matches(row: Transaction, term: string, pipe: PipeTransform) {
  return (
    (row.id !== null && row.id.toString().toLowerCase().includes(term)) ||
    (row.agent_msisdn !== null &&
      row.agent_msisdn.toString().toLowerCase().includes(term)) ||
    (row.customer_msisdn !== null &&
      row.customer_msisdn.toString().toLowerCase().includes(term)) ||
    (row.message !== null && row.message.toLowerCase().includes(term)) ||
    (row.serviceName !== null &&
      row.serviceName.toLowerCase().includes(term)) ||
    (row.statusText !== null && row.statusText.toLowerCase().includes(term)) ||
    (row.date_created !== null &&
      formatDate(row.date_created, 'd LLL yyy, h:mm:ss a', 'en-ZM')
        .toLowerCase()
        .includes(term))
  );
}

@Injectable({
  providedIn: 'root',
})
export class TransactionsService {
  public transactionData: Transaction[] = [];
  public agentTransactionData: Transaction[] = [];
  private transactionsUrl = environment.api.vokaadmin.url;

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'appication/json' }),
  };

  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _rows$ = new BehaviorSubject<Transaction[]>([]);
  private _total$ = new BehaviorSubject<number>(0);
  private _empty$ = new BehaviorSubject<boolean>(false);
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

  constructor(private http: HttpClient, private pipe: DecimalPipe) {}

  /**
   * Returns the value
   */
  get transactions$() {
    return this._rows$.asObservable();
  }
  get total$() {
    return this._total$.asObservable();
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

  // API interaction
  // Fetch all transactions
  public _fetchTransactions(serviceId?: number) {
    this.getTransactions(serviceId).subscribe((transactions) => {
      this.transactionData = this.mapTransactions(transactions);

      this._search$
        .pipe(
          tap(() => this._loading$.next(true)),
          debounceTime(200),
          switchMap(() => this._search(this.transactionData)),
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
  }

  // // Fetch service transactions
  // public _fetchServiceTransactions(serviceId: number) {
  //   switch (serviceId) {

  //   }

  //   this.getTransactions(serviceId).subscribe((transactions) => {
  //     this.transactionData = this.mapTransactions(transactions);

  //     this._search$
  //       .pipe(
  //         tap(() => this._loading$.next(true)),
  //         debounceTime(200),
  //         switchMap(() => this._search(this.transactionData)),
  //         delay(200),
  //         tap(() => this._loading$.next(false))
  //       )
  //       .subscribe((result) => {
  //         this._rows$.next(result.rows);
  //         this._total$.next(result.total);
  //         this._empty$.next(result.empty);
  //       });

  //     this._search$.next();
  //   });
  // }


  // Get all transactions
  public getTransactions(serviceId?: number): Observable<Transaction[]> {
    let url: string;
    switch (serviceId) {
      case undefined:
        url = `${this.transactionsUrl}/records/all-transactions`;
        break;

      default:
        url = `${this.transactionsUrl}/records/get-transaction-by-serviceId/${serviceId}`;
        break;
    }
    return this.http
      .get<Transaction[]>(url)
      .pipe(catchError(this.handleError<Transaction[]>('getTransactions', [])));
  }

  // Get zesco transactions
  public getZescoTransactions(): Observable<Transaction[]> {
    let url: string = `${this.transactionsUrl}/transactions/all-zesco-transactions`;
    return this.http
      .get<Transaction[]>(url)
      .pipe(catchError(this.handleError<Transaction[]>('getZescoTransactions', [])));
  }

  public _fetchTransactionsByPartner(userId: string) {
    this.getTransactionsByPartner(userId).subscribe((transactions) => {
      this.agentTransactionData = this.mapTransactions(transactions);

      this._search$
        .pipe(
          tap(() => this._loading$.next(true)),
          debounceTime(200),
          switchMap(() => this._search(this.agentTransactionData)),
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
  }

  public _fetchTransactionsByAgent(msisdn: string) {
    this.getTransactionsByAgent(msisdn).subscribe((transactions) => {
      this.agentTransactionData = this.mapTransactions(transactions);

      this._search$
        .pipe(
          tap(() => this._loading$.next(true)),
          debounceTime(200),
          switchMap(() => this._search(this.agentTransactionData)),
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
  }

  private getTransactionsByPartner(userId: string): Observable<Transaction[]> {
    let url: string = `${this.transactionsUrl}/records/transactions-by-agent/${userId}`;

    return this.http
      .get<Transaction[]>(url)
      .pipe(
        catchError(
          this.handleError<Transaction[]>('getTransactionsByPartner', [])
        )
      );
  }

  private getTransactionsByAgent(msisdn: string): Observable<Transaction[]> {
    let url: string = `${this.transactionsUrl}/transactions/transactions-by-agent/${msisdn}`;

    return this.http
      .get<Transaction[]>(url)
      .pipe(
        catchError(
          this.handleError<Transaction[]>('getTransactionsByAgent', [])
        )
      );
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

  private mapTransactions(transactions: Transaction[]) {
    return transactions.map((transaction) => {
      let date = new Date(transaction.date_created);
      date.setHours(date.getHours() - 2);

      transaction.date_created = date;

      if (transaction.status === null) transaction.status = 0;
      if (transaction.amount === null) transaction.amount = 0;
      if (transaction.commission === null) transaction.commission = 0;

      // Add statusColor and statusText
      switch (transaction.status) {
        case 100:
          transaction.statusColor = 'success';
          transaction.statusText = 'success';
          break;

        case 105:
          transaction.statusColor = 'warning';
          transaction.statusText = 'pending';
          break;

        default:
          transaction.statusColor = 'danger';
          transaction.statusText = 'failed';
          break;
      }

      // Add service text
      switch (transaction.serviceId) {
        case 1:
          transaction.serviceName = 'Airtel Airtime';
          // transaction.commission =
          //   (CommissionPercentages.AIRTEL_AIRTIME_DISCOUNT_PERCENTAGE / 100) *
          //   transaction.amount;
          break;
        case 2:
          transaction.serviceName = 'MTN Airtime';
          // transaction.commission =
          //   (CommissionPercentages.MTN_AIRTIME_DISCOUNT_PERCENTAGE / 100) *
          //   transaction.amount;
          break;
        case 3:
          transaction.serviceName = 'Zamtel Airtime';
          // transaction.commission =
          //   (CommissionPercentages.ZAMTEL_AIRTIME_DISCOUNT_PERCENTAGE / 100) *
          //   transaction.amount;
          break;
        case 4:
          transaction.serviceName = 'ZESCO';
          // transaction.commission =
          //   (CommissionPercentages.ZESCO_DISCOUNT_PERCENTAGE / 100) *
          //   transaction.amount;
          break;
        case 5:
          transaction.serviceName = 'DSTV';
          break;
        case 6:
          transaction.serviceName = 'GoTv';
          break;
        case 7:
          transaction.serviceName = 'TopStar';
          break;
        case 8:
          transaction.serviceName = 'Lusaka Water and Sewerage';
          break;
        case 50:
          transaction.serviceName = 'Airtel Money';
          break;
        case 51:
          transaction.serviceName = 'MTN Money';
          break;
        case 52:
          transaction.serviceName = 'Zamtel Kwacha';
          break;
        case 54: case 60: case 61: case 62:
          transaction.serviceName = 'Agent Topup';
          break;
        default:
          transaction.serviceName = 'Unknown Service';
          break;
      }

      return transaction;
    });
  }

  public exportTransactions(fileName: string, dateFrom?: Date, dateTo?: Date) {
    // Export type
    const exportType = 'csv';
    // Export data
    let tx: Transaction[], transactionsExport;

    if (dateFrom !== undefined && dateTo !== undefined) {
      // Cater for single day transactions
      if (dateFrom.getTime() === dateTo.getTime()) {
        dateTo.setDate(dateTo.getDate() + 1);
      }
      tx = this.filterByDate(this.transactionData, dateFrom, dateTo);
      transactionsExport = this.mapTransactionExport(tx);
    } else {
      transactionsExport = this.mapTransactionExport(this.transactionData);
    }

    exportFromJSON({ data: transactionsExport, fileName, exportType });
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

  private mapTransactionExport(transactions: Transaction[]) {
    return transactions.map((transaction) => {
      return {
        'Transaction ID': transaction.id,
        'Agent Number': transaction.agent_msisdn,
        'Customer Number': transaction.customer_msisdn,
        Amount: transaction.amount,
        Commission: transaction.commission,
        Message: transaction.message,
        Service: transaction.serviceName,
        'Transaction Status': transaction.statusText,
        'Transaction Date': formatDate(
          transaction.date_created,
          'dd/LL/yyyy hh:mm:ss a z',
          'en-ZM'
        ),
      };
    });
  }
}
