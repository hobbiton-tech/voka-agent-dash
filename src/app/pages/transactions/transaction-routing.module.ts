import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AllTransactionsComponent } from './all-transactions/all-transactions.component';
import { MtnTransactionsComponent } from './mtn-transactions/mtn-transactions.component';
import { AirtelTransactionsComponent } from './airtel-transactions/airtel-transactions.component';
import { ZamtelTransactionsComponent } from './zamtel-transactions/zamtel-transactions.component';
import { ZescoTransactionsComponent } from './zesco-transactions/zesco-transactions.component';
import { LwscTransactionsComponent } from './lwsc-transactions/lwsc-transactions.component';
import { GotvTransactionsComponent } from './gotv-transactions/gotv-transactions.component';
import { DstvTransactionsComponent } from './dstv-transactions/dstv-transactions.component';
import { TopstarTransactionsComponent } from './topstar-transactions/topstar-transactions.component';
import { AgentTransactionsComponent } from './agent-transactions/agent-transactions.component';

const routes: Routes = [
  {
    path: 'all-transactions',
    component: AllTransactionsComponent,
  },
  {
    path: 'mtn-transactions',
    component: MtnTransactionsComponent,
  },
  {
    path: 'airtel-transactions',
    component: AirtelTransactionsComponent,
  },
  {
    path: 'zamtel-transactions',
    component: ZamtelTransactionsComponent,
  },
  {
    path: 'zesco-transactions',
    component: ZescoTransactionsComponent,
  },
  {
    path: 'lwsc-transactions',
    component: LwscTransactionsComponent,
  },
  {
    path: 'gotv-transactions',
    component: GotvTransactionsComponent,
  },
  {
    path: 'dstv-transactions',
    component: DstvTransactionsComponent,
  },
  {
    path: 'topstar-transactions',
    component: TopstarTransactionsComponent,
  },
  {
    path: 'agent-transactions/:msisdn',
    component: AgentTransactionsComponent,
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransactionRoutingModule {}
