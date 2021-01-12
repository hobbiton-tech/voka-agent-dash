import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllMomoTransactionsComponent } from './all-momo-transactions/all-momo-transactions.component';
import { AirtelMoneyComponent } from './airtel-money/airtel-money.component';
import { MtnMoneyComponent } from './mtn-money/mtn-money.component';
import { ZamtelKwachaComponent } from './zamtel-kwacha/zamtel-kwacha.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'all-momo-transactions',
    component: AllMomoTransactionsComponent,
  },
  {
    path: 'airtel-money',
    component: AirtelMoneyComponent,
  },
  {
    path: 'mtn-money',
    component: MtnMoneyComponent,
  },
  {
    path: 'zamtel-kwacha',
    component: ZamtelKwachaComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MobilePaymentsRoutingModule {}
