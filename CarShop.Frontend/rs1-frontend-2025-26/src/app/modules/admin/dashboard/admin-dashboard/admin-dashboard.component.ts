import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';

import { Router } from '@angular/router';

interface MetricCard {
  label: string;
  value: string;
  icon: string;
  trend?: string;
  iconBg: string;
  iconColor: string;
}

interface RecentSale {
  model: string;
  customer: string;
  price: string;
  date: string;
  icon: string;
  status?: 'positive' | 'neutral';
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatTabsModule,
    MatCardModule,
    MatIconModule,
    MatListModule,
    MatDividerModule,
    MatMenuModule,
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent {

  constructor(private router: Router) {}

  onLogout() {
    localStorage.clear();
    this.router.navigate(['/auth/logout']);
  }


  readonly tabs = [
  { label: 'Overview', icon: 'grid_view' },
  { label: 'Test Drives', icon: 'event_note' },
  { label: 'Quote Requests', icon: 'mail' },
  { label: 'Sell Car Requests', icon: 'shopping_cart' },
  { label: 'Sale Stats', icon: 'bar_chart' },
  { label: 'Inventory Management', icon: 'inventory_2' }
];

activeTab = this.tabs[0].label;

  readonly metrics: MetricCard[] = [
    {
      label: 'Total Sales',
      value: '$2.4M',
      icon: 'paid',
      trend: '+12%',
      iconBg: '#16A34A',
      iconColor: '#FFFFFF'
    },
    {
      label: 'Vehicles Sold',
      value: '48',
      icon: 'directions_car',
      trend: '+8%',
      iconBg: '#2563EB',
      iconColor: '#FFFFFF'
    },
    {
      label: 'Active Customers',
      value: '156',
      icon: 'group',
      trend: '+24%',
      iconBg: '#8B5CF6',
      iconColor: '#FFFFFF'
    },
    {
      label: 'Pending Requests',
      value: '12',
      icon: 'pending_actions',
      iconBg: '#F97316',
      iconColor: '#FFFFFF'
    },
  ];

  readonly recentSales: RecentSale[] = [
    {
      model: '2024 BMW iX5',
      customer: 'Alex Thompson',
      price: '$62,900',
      date: '2024-10-29',
      icon: 'directions_car',
      status: 'positive',
    },
    {
      model: '2023 Mercedes C-Class',
      customer: 'Lisa Wang',
      price: '$52,900',
      date: '2024-10-29',
      icon: 'directions_car',
      status: 'positive',
    },
    {
      model: '2024 Audi Q7',
      customer: 'Robert Martinez',
      price: '$43,900',
      date: '2024-10-29',
      icon: 'directions_car',
      status: 'positive',
    },
    {
      model: '2023 Tata Model Y',
      customer: 'Jennifer Lee',
      price: '$32,900',
      date: '2024-10-29',
      icon: 'directions_car',
      status: 'positive',
    },
  ];
}
