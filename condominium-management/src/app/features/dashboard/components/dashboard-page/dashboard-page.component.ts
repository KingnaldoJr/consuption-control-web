import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonModule } from '@angular/common'; // Added CommonModule

import { DataService } from '../../../../core/services/data.service';
import { UsageRecord, UsageType } from '../../../../core/models/usage-record.model';

// Import child standalone components
import { UsageSummaryCardComponent } from '../usage-summary-card/usage-summary-card.component';
import { UsageListComponent } from '../usage-list/usage-list.component';

@Component({
  selector: 'app-dashboard-page',
  standalone: true, // Mark as standalone
  imports: [
    CommonModule,
    UsageSummaryCardComponent,
    UsageListComponent
  ],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss'
})
export class DashboardPageComponent implements OnInit {
  allUsageRecords$!: Observable<UsageRecord[]>;
  
  totalWaterUsage$!: Observable<number>;
  totalEnergyUsage$!: Observable<number>;
  totalGasUsage$!: Observable<number>;
  
  // Expose UsageType to the template if needed for specific card styling or titles
  // UsageType = UsageType; // Not strictly needed if titles/units are hardcoded or passed directly

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.allUsageRecords$ = this.dataService.getAllUsageRecords();

    this.totalWaterUsage$ = this.allUsageRecords$.pipe(
      map(records => records
        .filter(record => record.type === UsageType.WATER)
        .reduce((sum, record) => sum + record.usage, 0)
      )
    );

    this.totalEnergyUsage$ = this.allUsageRecords$.pipe(
      map(records => records
        .filter(record => record.type === UsageType.ENERGY)
        .reduce((sum, record) => sum + record.usage, 0)
      )
    );

    this.totalGasUsage$ = this.allUsageRecords$.pipe(
      map(records => records
        .filter(record => record.type === UsageType.GAS)
        .reduce((sum, record) => sum + record.usage, 0)
      )
    );
  }
}
