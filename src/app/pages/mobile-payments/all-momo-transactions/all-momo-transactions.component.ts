import { Component, OnInit, ViewChildren, QueryList, OnDestroy } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { Observable, Subject } from 'rxjs';
import { Transaction } from '../../transactions/transactions.model';
import {
  SharedSortableDirective,
  SortEvent,
} from '../../../shared/directives/shared-sortable.directive';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TransactionDetailComponent } from '../../transactions/transaction-detail/transaction-detail.component';
import { MobilePaymentsService } from '../mobile-payments.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-all-momo-transactions',
  templateUrl: './all-momo-transactions.component.html',
  styleUrls: ['./all-momo-transactions.component.scss'],
  providers: [MobilePaymentsService, DecimalPipe],
})
export class AllMomoTransactionsComponent implements OnInit, OnDestroy {
  // Breadcrumb data
  breadCrumbItems: Array<{}>;
  private unsubscribe$: Subject<void> = new Subject<void>()
  transactions$: Transaction[];
  total$: number;
  empty$: boolean;

  @ViewChildren(SharedSortableDirective) headers: QueryList<
    SharedSortableDirective
  >;

  constructor(
    public transactionsService: MobilePaymentsService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    // Breadcrumb items
    this.breadCrumbItems = [
      {
        label: 'Voka Admin',
        path: '/',
      },
      {
        label: 'Mobile Payments',
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
    this.transactionsService._fetchTransactions();

    // Subscriptions
    this.transactionsService.transactions$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((transactions) => (this.transactions$ = transactions));
    this.transactionsService.total$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((total) => (this.total$ = total));
    this.transactionsService.empty$
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
}
