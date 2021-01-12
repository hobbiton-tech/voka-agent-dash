import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { ReportsRoutingModule } from './reports-routing.module';
import { OverviewComponent } from './overview/overview.component';
import {
  NgbDropdownModule,
  NgbTypeaheadModule,
  NgbPaginationModule,
} from '@ng-bootstrap/ng-bootstrap';
import { FlatpickrModule } from 'angularx-flatpickr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UIModule } from '../../shared/ui/ui.module';
import { SharedModule } from '../apps/email/shared/shared.module';
import { TransactionsService } from '../transactions/transactions.service';

@NgModule({
  declarations: [OverviewComponent],
  imports: [
    CommonModule,
    UIModule,
    ReportsRoutingModule,
    NgbDropdownModule,
    FlatpickrModule,
    FormsModule,
    ReactiveFormsModule,
    NgbTypeaheadModule,
    NgbPaginationModule,
    SharedModule,
  ],
  providers: [TransactionsService, DecimalPipe],
})
export class ReportsModule {}
