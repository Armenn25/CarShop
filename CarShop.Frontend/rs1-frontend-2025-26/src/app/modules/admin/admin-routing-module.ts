import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import {AdminSettingsComponent} from './admin-settings/admin-settings.component';
import { AdminDashboardComponent } from './dashboard/admin-dashboard/admin-dashboard.component';

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
        path: 'settings',
        component: AdminSettingsComponent,
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
