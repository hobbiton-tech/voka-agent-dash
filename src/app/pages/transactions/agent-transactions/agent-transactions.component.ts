import {
  Component,
  OnInit,
  ViewChildren,
  QueryList,
  OnDestroy,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TransactionsService } from '../transactions.service';
import { Location, DecimalPipe, formatDate } from '@angular/common';

import { Subject } from 'rxjs';
import { Transaction } from '../transactions.model';
import {
  SharedSortableDirective,
  SortEvent,
} from '../../../shared/directives/shared-sortable.directive';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TransactionDetailComponent } from '../transaction-detail/transaction-detail.component';
import { AgentsService } from '../../agents/agents.service';
import { Agent, Partner } from '../../agents/agents.model';
import { takeUntil } from 'rxjs/operators';
import { AgentSalesReportsService } from './agent-sales-reports.service';
import { ServiceSale } from '../../reports/reports.model';

interface SelectedDateRange {
  from: Date;
  to: Date;
}
@Component({
  selector: 'app-agent-transactions',
  templateUrl: './agent-transactions.component.html',
  styleUrls: ['./agent-transactions.component.scss'],
  providers: [
    AgentsService,
    TransactionsService,
    AgentSalesReportsService,
    DecimalPipe,
  ],
})
export class AgentTransactionsComponent implements OnInit, OnDestroy {
  selectedDateRange: SelectedDateRange;
  // Bread crumb data
  breadCrumbItems: Array<{}>;
  private unsubscribe$: Subject<void> = new Subject<void>();
  transactions$: Transaction[];
  total$: number;
  empty$: boolean;
  agentSales$: ServiceSale[];
  agentSalesTotal$: number;
  agentSalesEmpty$: boolean;
  agent$: Agent;

  userId: string;

  @ViewChildren(SharedSortableDirective) headers: QueryList<
    SharedSortableDirective
  >;

  constructor(
    private route: ActivatedRoute,
    public transactionsService: TransactionsService,
    public salesReportService: AgentSalesReportsService,
    public agentsService: AgentsService,
    private location: Location,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.breadCrumbItems = [
      {
        label: 'Voka Admin',
        path: '/',
      },
      {
        label: 'Transactions',
        path: '/transactions/all-transactions',
      },
      {
        label: `Agent Transactions`,
        path: '/',
        active: true,
      },
    ];

    /**
     * fetch data
     */
    this._fetchData();
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  _fetchData(): void {
    this.userId = this.route.snapshot.paramMap.get('msisdn');
    this.agentsService._fetchAgent(this.userId);
    this.transactionsService._fetchTransactionsByPartner(this.userId);
    this.salesReportService._fetchSales(this.userId);

    // Subscriptions
    this.agentsService.agent$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((partner) => (this.agent$ = partner));
    this.transactionsService.transactions$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((transactions) => (this.transactions$ = transactions));
    this.transactionsService.empty$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((empty) => (this.empty$ = empty));
    this.transactionsService.total$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((total) => (this.total$ = total));

    this.salesReportService.sales$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((sales) => (this.agentSales$ = sales));
    this.salesReportService.total$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((total) => (this.agentSalesTotal$ = total));
    this.salesReportService.empty$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((empty) => (this.agentSalesEmpty$ = empty));
  }

  goBack(): void {
    this.location.back();
  }

  /**
   * Sort table data
   * @param param0 sort the column
   *
   */
  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    this.headers.forEach((header) => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });
    this.transactionsService.sortColumn = column;
    this.transactionsService.sortDirection = direction;
  }

  /**
   * View transaction details
   */
  viewTransaction(data: Transaction) {
    const modalRef = this.modalService.open(TransactionDetailComponent);
    modalRef.componentInstance.title = `Transaction #${data.id} Details`;
    modalRef.componentInstance.transaction = data;
  }

  /**
   * Export Report
   */
  export() {
    if (this.selectedDateRange === undefined) {
      this.transactionsService.exportTransactions(
        this.genFilename(this.selectedDateRange)
      );
    } else if (
      this.selectedDateRange.from !== undefined &&
      this.selectedDateRange.to === undefined
    ) {
      this.selectedDateRange.to = new Date(this.selectedDateRange.from);
      this.transactionsService.exportTransactions(
        this.genFilename(this.selectedDateRange),
        this.selectedDateRange.from,
        this.selectedDateRange.to
      );
    } else {
      this.transactionsService.exportTransactions(
        this.genFilename(this.selectedDateRange),
        this.selectedDateRange.from,
        this.selectedDateRange.to
      );
    }
  }

  exportSales() {
    if (this.selectedDateRange === undefined) {
      this.salesReportService.exportSales(
        this.genSalesFilename(this.selectedDateRange)
      );
    } else if (
      this.selectedDateRange.from !== undefined &&
      this.selectedDateRange.to === undefined
    ) {
      this.selectedDateRange.to = new Date(this.selectedDateRange.from);
      this.salesReportService.exportSales(
        this.genSalesFilename(this.selectedDateRange),
        this.selectedDateRange.from,
        this.selectedDateRange.to
      );
    } else {
      this.salesReportService.exportSales(
        this.genSalesFilename(this.selectedDateRange),
        this.selectedDateRange.from,
        this.selectedDateRange.to
      );
    }
  }

  genFilename(selectedDateRange: SelectedDateRange): string {
    if (selectedDateRange === undefined) {
      return `${formatDate(new Date(), 'yyyyLLdd', 'en-ZM')}_Agent_${
        this.agent$.MSISDN
      }_VOKA_Transactions`;
    } else if (
      selectedDateRange.from.getTime() === selectedDateRange.to.getTime()
    ) {
      return `${formatDate(
        selectedDateRange.from,
        'yyyyLLdd',
        'en-ZM'
      )}_Agent_${this.agent$.MSISDN}_VOKA_Transactions`;
    } else {
      return `${formatDate(
        this.selectedDateRange.from,
        'yyyyLLdd',
        'en-ZM'
      )}_${formatDate(this.selectedDateRange.to, 'yyyyLLdd', 'en-ZM')}_Agent_${
        this.agent$.MSISDN
      }_VOKA_Transactions`;
    }
  }

  genSalesFilename(selectedDateRange: SelectedDateRange): string {
    if (selectedDateRange === undefined) {
      return `${formatDate(new Date(), 'yyyyLLdd', 'en-ZM')}_Agent_${
        this.agent$.MSISDN
      }_VOKA_Sales`;
    } else if (
      selectedDateRange.from.getTime() === selectedDateRange.to.getTime()
    ) {
      return `${formatDate(
        selectedDateRange.from,
        'yyyyLLdd',
        'en-ZM'
      )}_Agent_${this.agent$.MSISDN}_VOKA_Sales`;
    } else {
      return `${formatDate(
        selectedDateRange.from,
        'yyyyLLdd',
        'en-ZM'
      )}_${formatDate(selectedDateRange.to, 'yyyyLLdd', 'en-ZM')}_Agent_${
        this.agent$.MSISDN
      }_VOKA_Sales`;
    }
  }
}
