import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';

// Import components
import { DashboardPageComponent } from './components/dashboard-page/dashboard-page.component';
import { UsageSummaryCardComponent } from './components/usage-summary-card/usage-summary-card.component';
import { UsageListComponent } from './components/usage-list/usage-list.component';

@NgModule({
  declarations: [
    // Standalone components are not declared in NgModules.
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    // Import standalone components here if they are used by this module's routes or declared components.
    // Since these components are routed to or used by DashboardPageComponent (which is also standalone and imported for routing),
    // they are effectively part of the feature's public API or internal structure.
    DashboardPageComponent, 
    UsageSummaryCardComponent, 
    UsageListComponent
  ],
  exports: [
    // DashboardPageComponent // No need to export if only used for routing within this module bundle
  ]
})
export class DashboardModule { }
