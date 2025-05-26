import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common'; // Added CommonModule
import { UsageType } from '../../../../core/models/usage-record.model'; 

@Component({
  selector: 'app-usage-summary-card',
  standalone: true, // Mark as standalone
  imports: [CommonModule], // Import CommonModule for *ngIf
  templateUrl: './usage-summary-card.component.html',
  styleUrl: './usage-summary-card.component.scss'
})
export class UsageSummaryCardComponent {
  @Input() title: string | undefined;
  @Input() value: number | undefined; 
  @Input() unit: string | undefined;   
  @Input() period: string | undefined; 
}
