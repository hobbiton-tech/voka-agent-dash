import {
  Component,
  OnInit,
  ViewChildren,
  QueryList,
  OnDestroy,
} from '@angular/core';
import { DecimalPipe, formatDate } from '@angular/common';

import { Observable, Subject, Subscription, forkJoin } from 'rxjs';
import {
  SharedSortableDirective,
  SortEvent,
} from '../../../shared/directives/shared-sortable.directive';
import { SalesReportService } from '../sales-report.service';
import { ServiceSale } from '../reports.model';
import { takeUntil, take, mergeMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Transaction } from '../../transactions/transactions.model';

interface SelectedDateRange {
  from: Date;
  to?: Date;
}

interface Commission {
  serviceId: number;
  commission: string;
}

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  providers: [SalesReportService, DecimalPipe],
})
export class OverviewComponent implements OnInit, OnDestroy {
  errors = {
    agentNumber: false,
  };
  submit: boolean;
  selectedDateRange: SelectedDateRange;
  // Bread crumb data
  breadCrumbItems: Array<{}>;
  private unsubscribe$: Subject<void> = new Subject<void>();
  sales$: ServiceSale[];
  total$: number;
  empty$: boolean;
  transactions$: Transaction[];
  _agentMSISDN: string;

  @ViewChildren(SharedSortableDirective) headers: QueryList<
    SharedSortableDirective
  >;

  constructor(
    public salesReportService: SalesReportService,
    private router: Router
  ) {}

  ngOnInit() {
    this.breadCrumbItems = [
      {
        label: 'Voka Admin',
        path: '/',
      },
      {
        label: 'Reports',
        path: '/',
      },
      {
        label: 'All Transactions',
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
    this.salesReportService._fetchSales();

    // Subscriptions
    this.salesReportService.sales$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((sales) => (this.sales$ = sales));
    this.salesReportService.total$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((total) => (this.total$ = total));
    this.salesReportService.empty$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((empty) => (this.empty$ = empty));
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
    this.salesReportService.sortColumn = column;
    this.salesReportService.sortDirection = direction;
  }

  /**
   * Export Report
   */
  export() {
    if (this.selectedDateRange === undefined) {
      this.salesReportService.exportSales(
        this.genFilename(this.selectedDateRange)
      );
    } else if (
      this.selectedDateRange.from !== undefined &&
      this.selectedDateRange.to === undefined
    ) {
      this.selectedDateRange.to = new Date(this.selectedDateRange.from);
      this.salesReportService.exportSales(
        this.genFilename(this.selectedDateRange),
        this.selectedDateRange.from,
        this.selectedDateRange.to
      );
    } else {
      this.salesReportService.exportSales(
        this.genFilename(this.selectedDateRange),
        this.selectedDateRange.from,
        this.selectedDateRange.to
      );
    }
  }

  genFilename(selectedDateRange: SelectedDateRange): string {
    if (selectedDateRange === undefined) {
      return `${formatDate(new Date(), 'yyyyLLdd', 'en-ZM')}_MobiCom_Sales`;
    } else if (
      selectedDateRange.from.getTime() === selectedDateRange.to.getTime()
    ) {
      return `${formatDate(
        selectedDateRange.from,
        'yyyyLLdd',
        'en-ZM'
      )}_MobiCom_Sales`;
    } else {
      return `${formatDate(
        selectedDateRange.from,
        'yyyyLLdd',
        'en-ZM'
      )}_${formatDate(
        selectedDateRange.to,
        'yyyyLLdd',
        'en-ZM'
      )}_MobiCom_Sales`;
    }
  }

  viewAgentTransactions(agentNumber: string) {
    this.errors.agentNumber = !/^(260)[0-9]{9}$/.test(agentNumber);
    this.submit = false;

    if (!this.errors.agentNumber) {
      this.submit = true;
      this.router.navigateByUrl(
        `/transactions/agent-transactions/${agentNumber}`
      );
    }

    return;
  }
}
