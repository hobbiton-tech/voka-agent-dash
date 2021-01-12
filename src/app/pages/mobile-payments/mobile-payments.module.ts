import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllMomoTransactionsComponent } from './all-momo-transactions/all-momo-transactions.component';
import { AirtelMoneyComponent } from './airtel-money/airtel-money.component';
import { MtnMoneyComponent } from './mtn-money/mtn-money.component';
import { ZamtelKwachaComponent } from './zamtel-kwacha/zamtel-kwacha.component';
import { MobilePaymentsRoutingModule } from './mobile-payments-routing.module';
import { SharedModule } from '../apps/email/shared/shared.module';
import { UIModule } from '../../shared/ui/ui.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NgbPaginationModule,
  NgbTypeaheadModule,
} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AllMomoTransactionsComponent,
    AirtelMoneyComponent,
    MtnMoneyComponent,
    ZamtelKwachaComponent,
  ],
  imports: [
    CommonModule,
    UIModule,
    FormsModule,
    ReactiveFormsModule,
    NgbPaginationModule,
    NgbTypeaheadModule,
    MobilePaymentsRoutingModule,
    SharedModule,
  ],
})
export class MobilePaymentsModule {}
