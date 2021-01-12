import { Injectable, PipeTransform } from '@angular/core';
import { SortDirection } from '../../shared/directives/shared-sortable.directive';
import { Transaction, SearchResult } from '../transactions/transactions.model';
import { BehaviorSubject, Subject, Observable, of } from 'rxjs';
import { DecimalPipe } from '@angular/common';
import {
  tap,
  debounceTime,
  switchMap,
  delay,
  catchError,
} from 'rxjs/operators';

import { HttpHeaders, HttpClient } from '@angular/common/http';

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
    pipe.transform(row.id).includes(term) ||
    pipe.transform(row.agent_msisdn).includes(term) ||
    pipe.transform(row.amount).includes(term) ||
    pipe.transform(row.customer_msisdn).includes(term) ||
    pipe.transform(row.serviceId).includes(term) ||
    row.statusText.toLowerCase().includes(term) ||
    row.message.toLowerCase().includes(term) ||
    row.date_created.toLowerCase().includes(term)
  );
}

@Injectable({
  providedIn: 'root',
})
export class MobilePaymentsService {
  private transactionData: Transaction[];
  private transactionsUrl = 'https://mobicom-pilot.herokuapp.com';

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
    rows = rows.filter((row) => matches(row, searchTerm, this.pipe));
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

  // Get all transactions
  private getTransactions(serviceId?: number): Observable<Transaction[]> {
    let url: string;
    console.debug('serviceId is: ', serviceId);
    switch (serviceId) {
      case undefined:
        url = `${this.transactionsUrl}/records/all-cash-payment-transactions`;
        break;

      default:
        url = `${this.transactionsUrl}/records/cash-payment-transactions-by-serviceId/${serviceId}`;
        break;
    }
    return this.http.get<Transaction[]>(url).pipe(
      tap((_) => this.log('fetched requested transactions')),
      catchError(this.handleError<Transaction[]>('getTransactions', []))
    );
  }

  public _fetchTransactionsByAgent(msisdn: string) {
    this.getTransactionsByAgent(msisdn).subscribe((transactions) => {
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

  private getTransactionsByAgent(msisdn: string): Observable<Transaction[]> {
    let url = `${this.transactionsUrl}/records/cash-payment-transctions-agent/${msisdn}`;

    return this.http.get<Transaction[]>(url).pipe(
      tap((_) => this.log('fetched requested transactions')),
      catchError(this.handleError<Transaction[]>('getTransactionsByAgent', []))
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
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  private log(message: string) {
    console.log(`TransactionsService: ${message}`);
  }

  private mapTransactions(transactions: Transaction[]) {
    return transactions.map((transaction) => {
      if (transaction.status === null) transaction.status = 0;

      // Add statusColor and statusText
      switch (transaction.status) {
        case 0:
          transaction.statusColor = 'danger';
          transaction.statusText = 'failed';
          break;

        case 100:
          transaction.statusColor = 'success';
          transaction.statusText = 'success';
          break;

        case 105:
          transaction.statusColor = 'danger';
          transaction.statusText = 'failed';
          break;

        default:
          transaction.statusColor = 'danger';
          transaction.statusText = 'failed';
          break;
      }

      // Add service text
      switch (transaction.serviceId) {
        case 50:
          transaction.serviceName = 'Airtel Money';
          break;
        case 51:
          transaction.serviceName = 'MTN Money';
          break;
        case 52:
          transaction.serviceName = 'Zamtel Kwacha';
          break;
        default:
          transaction.serviceName = 'Unknown Service';
          break;
      }
      return transaction;
    });
  }
}
