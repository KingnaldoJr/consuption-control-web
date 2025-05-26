import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // Added ReactiveFormsModule
import { Observable, of } from 'rxjs';
import { switchMap, startWith, tap } from 'rxjs/operators';
import { CommonModule } from '@angular/common'; // Added CommonModule

import { DataService } from '../../../../core/services/data.service';
import { Condominium } from '../../../../core/models/condominium.model';
import { House } from '../../../../core/models/house.model';
import { UsageRecord, UsageType } from '../../../../core/models/usage-record.model';

// Import child standalone components
import { SelectCondominiumComponent } from '../select-condominium/select-condominium.component';
import { SelectHouseComponent } from '../select-house/select-house.component';
import { UsageInputComponent } from '../usage-input/usage-input.component';

@Component({
  selector: 'app-data-entry-page',
  standalone: true, // Mark as standalone
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SelectCondominiumComponent,
    SelectHouseComponent,
    UsageInputComponent
  ],
  templateUrl: './data-entry-page.component.html',
  styleUrl: './data-entry-page.component.scss'
})
export class DataEntryPageComponent implements OnInit {
  dataEntryForm!: FormGroup;
  condominiums$!: Observable<Condominium[]>;
  houses$!: Observable<House[] | null>;

  constructor(
    private fb: FormBuilder,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.dataEntryForm = this.fb.group({
      condominiumId: ['', Validators.required],
      houseId: [{ value: '', disabled: true }, Validators.required], // Start disabled
      usageDetails: this.fb.group({
        type: ['', Validators.required],
        usage: ['', [Validators.required, Validators.min(0.01)]],
        month: ['', [Validators.required, Validators.min(1), Validators.max(12)]],
        year: ['', [Validators.required, Validators.min(new Date().getFullYear() - 20), Validators.max(new Date().getFullYear() + 5)]] 
      })
    });

    this.condominiums$ = this.dataService.getCondominiums();

    this.houses$ = this.dataEntryForm.get('condominiumId')!.valueChanges.pipe(
      startWith(this.dataEntryForm.get('condominiumId')!.value), // emit initial value
      tap(condoId => {
        const houseIdControl = this.dataEntryForm.get('houseId');
        houseIdControl?.reset(); 
        if (condoId) {
          houseIdControl?.enable();
        } else {
          houseIdControl?.disable();
        }
      }),
      switchMap(condoId => {
        if (condoId) {
          return this.dataService.getHousesByCondominium(condoId);
        } else {
          return of(null); 
        }
      })
    );
  }

  get usageDetailsFormGroup(): FormGroup {
    return this.dataEntryForm.get('usageDetails') as FormGroup;
  }

  onSubmit(): void {
    this.dataEntryForm.markAllAsTouched();
    if (this.dataEntryForm.valid) {
      const formValue = this.dataEntryForm.getRawValue(); // Use getRawValue to include disabled controls like houseId
      const usageDetailsValue = formValue.usageDetails;

      const newRecord: UsageRecord = {
        id: '', // Will be set by the service
        houseId: formValue.houseId,
        type: usageDetailsValue.type as UsageType,
        usage: parseFloat(usageDetailsValue.usage),
        month: parseInt(usageDetailsValue.month, 10),
        year: parseInt(usageDetailsValue.year, 10),
        recordedAt: new Date() 
      };

      this.dataService.addUsageRecord(newRecord).subscribe({
        next: (savedRecord) => {
          console.log('Usage record saved:', savedRecord);
          alert('Usage record saved successfully!'); 
          this.dataEntryForm.reset();
          this.dataEntryForm.get('condominiumId')?.setValue(''); // Explicitly clear dropdown
          this.dataEntryForm.get('houseId')?.setValue(''); // Explicitly clear dropdown
          this.dataEntryForm.get('houseId')?.disable(); // Re-disable houseId
          this.usageDetailsFormGroup.reset(); // Reset the nested form group
        },
        error: (err) => {
          console.error('Error saving usage record:', err);
          alert('Failed to save usage record.'); 
        }
      });
    } else {
      console.log('Form is invalid. Please check all fields.');
      alert('Form is invalid. Please check all fields.');
    }
  }
}
