import { Injectable, PipeTransform } from '@angular/core';
import { SortDirection } from '../../shared/directives/shared-sortable.directive';
import { Agent, AgentStatus, Partner, SearchResult } from './agents.model';
import { BehaviorSubject, Subject, Observable, of } from 'rxjs';
import { DecimalPipe, formatDate } from '@angular/common';
import {
  catchError,
  tap,
  debounceTime,
  switchMap,
  delay,
} from 'rxjs/operators';

// Data
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

interface StatusChange {
  MSISDN: number;
  status: AgentStatus;
}

interface TopUp {
  MSISDN: string;
  amount: number;
}

function compare(v1, v2) {
  return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
}

/**
 * Sort the table data
 * @param row Agent field value
 * @param column Fetch the column
 * @param direction Sort direction Ascending or Descending
 */
function sort(row: any[], column: string, direction: string): any[] {
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
 * Agent Data Match with Search input
 * @param row Agent field value fetch
 * @param term Search the value
 */
function matches(row: Agent, term: string, pipe: PipeTransform) {
  return (
    (row.id !== null && row.id.toString().toLowerCase().includes(term)) ||
    (row.MSISDN !== null && row.MSISDN.toLowerCase().includes(term)) ||
    (row.last_name !== null && row.last_name.toLowerCase().includes(term)) ||
    (row.balance !== null &&
      row.balance.toString().toLowerCase().includes(term)) ||
    (row.location !== null && row.location.toLowerCase().includes(term)) ||
    (row.date_created !== null &&
      formatDate(row.date_created, 'd LLL yyy, h:mm:ss a', 'en-ZM')
        .toLowerCase()
        .includes(term)) // ||
    // (row.NRC !== null && row.NRC.toLowerCase().includes(term))
  );
}

@Injectable({
  providedIn: 'root',
})
export class AgentsService {
  private agentsArray: Agent[];
  private _agent$ = new BehaviorSubject<Agent>(null);
  private agentsUrl = environment.api.vokaadmin.url;

  private partnersArray: Partner[];
  private _partner$ = new BehaviorSubject<Partner>(null);
  private partnersUrl = environment.api.vokaadmin.url;

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _rows$ = new BehaviorSubject<Agent[]>([]);
  private _newRows$ = new BehaviorSubject<Partner[]>([]);
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
  get agents$() {
    return this._rows$.asObservable();
  }

  get agent$() {
    return this._agent$.asObservable();
  }

  get Agents$() {
    return this._newRows$.asObservable();
  }

  get partner$() {
    return this._partner$.asObservable();
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

  private _search(agentData): Observable<SearchResult> {
    const {
      sortColumn,
      sortDirection,
      pageSize,
      page,
      searchTerm,
    } = this._state;

    // 1. sort
    let rows = sort(agentData, sortColumn, sortDirection);

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

  // API Interaction
  // Fetch all agents
  public _fetchAgents() {
    this.getAgents().subscribe((agents) => {
      this.agentsArray = this.mapAgents(agents);

      this._search$
        .pipe(
          tap(() => this._loading$.next(true)),
          debounceTime(200),
          // switchMap(() => this._search()),
          switchMap(() => this._search(this.agentsArray)),
          delay(200),
          tap(() => this._loading$.next(false))
        )
        .subscribe((result) => {
          this._rows$.next(result.rows);
          this._total$.next(result.total);
        });

      this._search$.next();
    });
  }

  // Fetch all Agents
  public _fetchPartners() {
    this.getPartners().subscribe((Agents) => {
      this.partnersArray = this.mapPartners(Agents);

      this._search$
        .pipe(
          tap(() => this._loading$.next(true)),
          debounceTime(200),
          // switchMap(() => this._search()),
          switchMap(() => this._search(this.partnersArray)),
          delay(200),
          tap(() => this._loading$.next(false))
        )
        .subscribe((result) => {
          this._newRows$.next(result.rows);
          this._total$.next(result.total);
        });

      this._search$.next();
    });
  }

  // Get all agents
  private getAgents(): Observable<Agent[]> {
    const url = `${this.agentsUrl}/agent-kyc/fetch-all-agents`;
    return this.http
      .get<Agent[]>(url)
      .pipe(catchError(this.handleError<Agent[]>('getAgents', [])));
  }

  // Get all Agents
  private getPartners(): Observable<Partner[]> {
    const url = `${this.partnersUrl}/users/fetch-all-users`;
    return this.http
      .get<Partner[]>(url)
      .pipe(catchError(this.handleError<Partner[]>('getPartner', [])));
  }

  // Get single agent
  _fetchAgent(msisdn: string): void {
    this.getAgentByNumber(msisdn).subscribe((agents) => {
      let agent: Agent[] = this.mapAgents(agents);
      this._agent$.next(agent[0]);
    });
  }

  // Get single Id
  _fetchPartner(userId: string): void {
    this.getPartnerById(userId).subscribe((Agents) => {
      let partner: Partner[] = this.mapPartners(Agents);
      this._partner$.next(partner[0]);
    });
  }

  // Get agent by MSISDN
  private getAgentByNumber(msisdn: string): Observable<Agent[]> {
    const url = `${this.agentsUrl}/agent-kyc/fetch-agent/${msisdn}`;
    return this.http
      .get<Agent[]>(url)
      .pipe(
        catchError(this.handleError<Agent[]>(`getAgent number ${msisdn}`, []))
      );
  }

  // Get agent by Id
  private getPartnerById(userId: string): Observable<Partner[]> {
    const url = `${this.partnersUrl}/users/fetch-user/${userId}`;
    return this.http
      .get<Partner[]>(url)
      .pipe(
        catchError(this.handleError<Partner[]>(`getAgent Id ${userId}`, []))
      );
  }

  // Add agent
  addAgent(payload: Agent): Observable<Agent> {
    const url = `${this.agentsUrl}/agent-kyc/create-agent`;
    return this.http
      .post<Agent>(url, payload, this.httpOptions)
      .pipe(catchError(this.handleError<Agent>('addAgent')));
  }

  // Add partner
  addPartner(payload: Partner): Observable<Partner> {
    const url = `${this.partnersUrl}/users/create-user`;
    return this.http
      .post<Partner>(url, payload, this.httpOptions)
      .pipe(catchError(this.handleError<Partner>('addPartner')));
  }

  // Top up agent balance
  agentTopUp(payload: TopUp): Observable<Agent> {
    const url = `${this.agentsUrl}/agent-kyc/update-balance`;
    return this.http
      .post<Agent>(url, payload, this.httpOptions)
      .pipe(catchError(this.handleError<Agent>('agentTopUp')));
  }

  // Top up partner balance
  partnerTopUp(payload: any): Observable<any> {
    const url = `${this.partnersUrl}/agent-kyc/mobile-money-float-top-up`;
    return this.http
      .post<any>(url, payload, this.httpOptions)
      .pipe(catchError(this.handleError<any>('partnerTopUp')));
  }

  // Change the status of an agent
  _changeAgentStatus(payload: StatusChange): Observable<Agent> {
    const url = `${this.agentsUrl}/agent-kyc/change-agent-status`;
    return this.http
      .post<Agent>(url, payload, this.httpOptions)
      .pipe(catchError(this.handleError<Agent>('_changeAgentStatus')));
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
    console.info(`AgentsService: ${message}`);
  }

  private mapAgents(agents: Agent[]) {
    return agents.map((agent) => {
      let date = new Date(agent.date_created);
      date.setHours(date.getHours() - 2);

      agent.date_created = date;

      if (agent.balance === null) agent.balance = 0;
      switch (agent.status) {
        case 150:
          agent.statusColor = 'success';
          agent.statusText = 'active';
          break;

        default:
          agent.statusColor = 'danger';
          agent.statusText = 'inactive';
          break;
      }

      return agent;
    });
  }

  private mapPartners(Agents: Partner[]) {
    return Agents.map((partner) => {
      let date = new Date(partner.created_at);
      date.setHours(date.getHours() - 2);

      partner.created_at = date;

      if (partner.balance === null) partner.balance = 0;

      switch (partner.isActive) {
        case 'true':
          partner.statusColor = 'success';
          partner.statusText = 'active';
          break;

        default:
          partner.statusColor = 'danger';
          partner.statusText = 'inactive';
          break;
      }

      return partner;
    });
  }
}
