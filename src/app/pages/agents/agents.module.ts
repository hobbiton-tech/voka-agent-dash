import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgentsRoutingModule } from './agents-routing.module';
import { UIModule } from '../../shared/ui/ui.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NgbPaginationModule,
  NgbTypeaheadModule,
} from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../shared/shared.module';

// Components
import { AllAgentsComponent } from './all-agents/all-agents.component';
import { AgentDetailsComponent } from './agent-details/agent-details.component';
import { NewAgentComponent } from './new-agent/new-agent.component';
import { AgentTopUpComponent } from './agent-top-up/agent-top-up.component';
import { LayoutsModule } from '../../layouts/layouts.module';
import { NgbAlertModule, NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { TransactionsService } from '../transactions/transactions.service';

@NgModule({
  declarations: [
    AllAgentsComponent,
    AgentDetailsComponent,
    NewAgentComponent,
    AgentTopUpComponent,
  ],
  entryComponents: [
    AgentDetailsComponent,
    NewAgentComponent,
    AgentTopUpComponent,
  ],
  imports: [
    CommonModule,
    AgentsRoutingModule,
    UIModule,
    FormsModule,
    ReactiveFormsModule,
    NgbPaginationModule,
    NgbTypeaheadModule,
    SharedModule,
    LayoutsModule,
    NgbAlertModule,
    NgbToastModule,
  ],
  providers: [TransactionsService],
})
export class AgentsModule {}
