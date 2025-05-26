import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common'; // Added CommonModule
import { House } from '../../../../core/models/house.model';

@Component({
  selector: 'app-select-house',
  standalone: true, // Mark as standalone
  imports: [CommonModule], // Import CommonModule for *ngIf, *ngFor
  templateUrl: './select-house.component.html',
  styleUrl: './select-house.component.scss'
})
export class SelectHouseComponent {
  @Input() houses: House[] | null = null;
  @Output() houseSelected = new EventEmitter<string>();

  onSelectionChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.houseSelected.emit(selectElement.value);
  }
}
