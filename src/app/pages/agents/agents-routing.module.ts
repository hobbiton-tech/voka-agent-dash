import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AllAgentsComponent } from './all-agents/all-agents.component';

const routes: Routes = [
  {
    path: 'all-agents',
    component: AllAgentsComponent,
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgentsRoutingModule {}
