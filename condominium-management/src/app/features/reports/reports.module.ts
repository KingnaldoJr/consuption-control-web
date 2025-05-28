import { NgModule } from '@angular/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { ConsumptionReportComponent } from './components/consumption-report/consumption-report.component';

const routes: Routes = [
  {
    path: 'consumption', // This path will be relative to the path defined in app.routes.ts for lazy loading
    component: ConsumptionReportComponent
  },
  {
    path: '', // Default route for this module, e.g., if navigating to /reports
    redirectTo: 'consumption', // Redirect to the consumption report by default
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [
    ConsumptionReportComponent
  ],
  imports: [
    CommonModule,
    FormsModule, // Add FormsModule here
    RouterModule.forChild(routes)
  ],
  exports: [
    ConsumptionReportComponent, // Export if it needs to be used in other modules' templates
    RouterModule
  ]
})
export class ReportsModule { }
