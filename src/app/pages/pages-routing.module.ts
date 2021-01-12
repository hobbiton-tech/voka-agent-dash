import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  // { path: '', component: DashboardComponent },
  { path: '', redirectTo: '/reports/overview', pathMatch: 'full' },
  {
    path: 'agents',
    loadChildren: () =>
      import('./agents/agents.module').then((m) => m.AgentsModule),
  },
  {
    path: 'reports',
    loadChildren: () =>
      import('./reports/reports.module').then((m) => m.ReportsModule),
  },
  {
    path: 'transactions',
    loadChildren: () =>
      import('./transactions/transactions.module').then(
        (m) => m.TransactionsModule
      ),
  },
  {
    path: 'agents',
    loadChildren: () =>
      import('./agents/agents.module').then((m) => m.AgentsModule),
  },
  {
    path: 'mobile-payments',
    loadChildren: () =>
      import('./mobile-payments/mobile-payments.module').then(
        (m) => m.MobilePaymentsModule
      ),
  },
  // {
  //   path: 'apps',
  //   loadChildren: () => import('./apps/apps.module').then((m) => m.AppsModule),
  // },
  // {
  //   path: 'other',
  //   loadChildren: () =>
  //     import('./other/other.module').then((m) => m.OtherModule),
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
