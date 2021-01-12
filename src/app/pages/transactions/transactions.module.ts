import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionRoutingModule } from './transaction-routing.module';

import { UIModule } from '../../shared/ui/ui.module';
import {
  NgbPaginationModule,
  NgbTypeaheadModule,
} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

// Components
import { AllTransactionsComponent } from './all-transactions/all-transactions.component';
import { TransactionDetailComponent } from './transaction-detail/transaction-detail.component';
import { MtnTransactionsComponent } from './mtn-transactions/mtn-transactions.component';
import { AirtelTransactionsComponent } from './airtel-transactions/airtel-transactions.component';
import { ZamtelTransactionsComponent } from './zamtel-transactions/zamtel-transactions.component';
import { ZescoTransactionsComponent } from './zesco-transactions/zesco-transactions.component';
import { LwscTransactionsComponent } from './lwsc-transactions/lwsc-transactions.component';
import { GotvTransactionsComponent } from './gotv-transactions/gotv-transactions.component';
import { DstvTransactionsComponent } from './dstv-transactions/dstv-transactions.component';
import { TopstarTransactionsComponent } from './topstar-transactions/topstar-transactions.component';
import { AgentTransactionsComponent } from './agent-transactions/agent-transactions.component';
import { FlatpickrModule } from 'angularx-flatpickr';

@NgModule({
  declarations: [
    AllTransactionsComponent,
    MtnTransactionsComponent,
    TransactionDetailComponent,
    AirtelTransactionsComponent,
    ZamtelTransactionsComponent,
    ZescoTransactionsComponent,
    LwscTransactionsComponent,
    GotvTransactionsComponent,
    DstvTransactionsComponent,
    TopstarTransactionsComponent,
    AgentTransactionsComponent,
  ],
  entryComponents: [TransactionDetailComponent],
  imports: [
    CommonModule,
    UIModule,
    TransactionRoutingModule,
    FormsModule,
    FlatpickrModule,
    ReactiveFormsModule,
    NgbPaginationModule,
    NgbTypeaheadModule,
    SharedModule,
  ],
})
export class TransactionsModule {}
