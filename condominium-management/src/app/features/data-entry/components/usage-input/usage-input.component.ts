import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms'; // Added ReactiveFormsModule
import { CommonModule } from '@angular/common'; // Added CommonModule
import { UsageType } from '../../../../core/models/usage-record.model';

@Component({
  selector: 'app-usage-input',
  standalone: true, // Mark as standalone
  imports: [CommonModule, ReactiveFormsModule], // Import for *ngIf, *ngFor, formGroup
  templateUrl: './usage-input.component.html',
  styleUrl: './usage-input.component.scss'
})
export class UsageInputComponent {
  @Input() usageFormGroup!: FormGroup; 
  @Input() usageTypes: UsageType[] = Object.values(UsageType); 

  months: number[] = Array.from({ length: 12 }, (_, i) => i + 1);

  get usageTypeValues(): string[] {
    return Object.values(this.usageTypes);
  }
}
