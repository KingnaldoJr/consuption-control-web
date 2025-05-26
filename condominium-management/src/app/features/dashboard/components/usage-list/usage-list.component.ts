import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common'; // Added CommonModule
import { UsageRecord } from '../../../../core/models/usage-record.model';

@Component({
  selector: 'app-usage-list',
  standalone: true, // Mark as standalone
  imports: [CommonModule], // Import CommonModule for *ngIf, *ngFor, DatePipe
  templateUrl: './usage-list.component.html',
  styleUrl: './usage-list.component.scss'
})
export class UsageListComponent {
  @Input() records: UsageRecord[] | null = null;
  @Input() title: string = 'Usage Records';
}
