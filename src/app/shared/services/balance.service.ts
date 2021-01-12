import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { Balance } from '../models/balance.model';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Transaction } from '../../pages/transactions/transactions.model';

@Injectable({
  providedIn: 'root',
})
export class BalanceService {
  private balancesUrl = environment.api.vokaadmin.url;
  private _mtnFloat = new BehaviorSubject<number>(0);
  private _necorFloat = new BehaviorSubject<number>(0);

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient) {}

  // Getters
  get mtnFloat$() {
    return this._mtnFloat.asObservable();
  }

  get necorFloat$() {
    return this._necorFloat.asObservable();
  }

  public _fetchBalance(): void {
    this.getBalance().subscribe((_) => this._mtnFloat.next(_.balance));
  }

  public _fetchMtnBalance(): void {
    this.getMtnBalance().subscribe((_) => this._mtnFloat.next(_.balance));
  }

  public _fetchNecorBalance(): void {
    this.getNecorBalance().subscribe((_) => this._necorFloat.next(_.balance));
  }

  public _fetchCommission(): void {
    this.getCommissionTransactions().subscribe((transactions) => {
      const commissionSum = transactions.reduce((sum, transaction) => {
        const today = new Date().toDateString();
        const transactionDate = new Date(
          transaction.date_created
        ).toDateString();
        if (transaction.status === 100 && transactionDate === today) {
          return sum + transaction.commission;
        }

        return sum;
      }, 0);

      this._necorFloat.next(commissionSum);
    });
  }

  // Get balance
  private getBalance(): Observable<Balance> {
    const url = `${this.balancesUrl}/master-balance/balance`;
    // const url = `${this.balancesUrl}/master-balance`;
    return this.http
      .get<Balance>(url)
      .pipe(catchError(this.handleError<Balance>(`getBalance`)));
  }

  // get MTN Balance
  private getMtnBalance(): Observable<Balance> {
    const url = `${this.balancesUrl}/float-management/mtn-float-balance`;
    return this.http
      .get<Balance>(url)
      .pipe(catchError(this.handleError<Balance>(`getBalance`)));
  }

  // Get necor balance
  private getNecorBalance(): Observable<Balance> {
    const url = `${this.balancesUrl}​/float-management/necor-float-balance`;
    return this.http
      .get<Balance>(url)
      .pipe(catchError(this.handleError<Balance>(`getBalance`)));
  }

  // Calculate today's commission
  private getCommissionTransactions(): Observable<Transaction[]> {
    const url = `${this.balancesUrl}/records/all-transactions`;

    return this.http
      .get<Transaction[]>(url)
      .pipe(
        catchError(
          this.handleError<Transaction[]>(`getCommissionTransactions`, [])
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
      // console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      // console.error(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  private log(message: string) {
    console.info(`BalanceService: ${message}`);
  }
}
