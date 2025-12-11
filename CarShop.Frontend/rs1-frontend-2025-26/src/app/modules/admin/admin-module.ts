import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AdminRoutingModule } from './admin-routing-module';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { AdminSettingsComponent } from './admin-settings/admin-settings.component';
import { SharedModule } from '../shared/shared-module';
import { AdminDashboardComponent } from './dashboard/admin-dashboard/admin-dashboard.component';

@NgModule({
  declarations: [
    AdminLayoutComponent,
    AdminSettingsComponent,
    // NEMA AdminDashboardComponent ovdje!
  ],
  imports: [
    RouterModule,
    AdminRoutingModule,
    SharedModule,
    AdminDashboardComponent, // standalone komponenta ide ovdje
  ]
})
export class AdminModule { }
