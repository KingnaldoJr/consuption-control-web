import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common'; // Added CommonModule
import { Condominium } from '../../../../core/models/condominium.model';

@Component({
  selector: 'app-select-condominium',
  standalone: true, // Mark as standalone
  imports: [CommonModule], // Import CommonModule for *ngIf, *ngFor
  templateUrl: './select-condominium.component.html',
  styleUrl: './select-condominium.component.scss'
})
export class SelectCondominiumComponent {
  @Input() condominiums: Condominium[] | null = null;
  @Output() condominiumSelected = new EventEmitter<string>();

  onSelectionChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.condominiumSelected.emit(selectElement.value);
  }
}
