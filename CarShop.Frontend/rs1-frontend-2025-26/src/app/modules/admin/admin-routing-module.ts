import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { AdminDashboardComponent } from './dashboard/admin-dashboard/admin-dashboard.component';
import { AdminTestDrivesComponent } from './test-drives/admin-test-drives/admin-test-drives.component';
import { AdminQuoteRequestsComponent } from './quote-requests/admin-quote-requests/admin-quote-requests.component';
import { AdminSellCarRequestsComponent } from './sell-car-requests/sell-car-requests.component';
import { AdminSalesStatsComponent} from './sales-stats/sales-stats.component';
import { AdminInventoryManagementComponent } from './inventory-management/admin-inventory-management.component';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      
      {
        path: 'dashboard',
        component: AdminDashboardComponent,
      },      

      {
        path: 'test-drives',
        component: AdminTestDrivesComponent,
      },   

      {
        path: 'quote-requests',
        component: AdminQuoteRequestsComponent,
      },

      {
        path: 'sell-car-requests',
        component: AdminSellCarRequestsComponent,
      },
      
      {
        path: 'sales-stats',
        component: AdminSalesStatsComponent,
      },

      {
        path: 'inventory-management',
        component: AdminInventoryManagementComponent,
      },


      // default admin route → /admin/dashboard
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
