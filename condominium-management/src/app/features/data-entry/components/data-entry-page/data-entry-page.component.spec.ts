import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { DataEntryPageComponent } from './data-entry-page.component';
import { DataService } from '../../../../core/services/data.service';
import { Condominium } from '../../../../core/models/condominium.model';
import { House } from '../../../../core/models/house.model';
import { UsageType } from '../../../../core/models/usage-record.model';
import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core'; // To avoid declaring all child components

describe('DataEntryPageComponent', () => {
  let component: DataEntryPageComponent;
  let fixture: ComponentFixture<DataEntryPageComponent>;
  let mockDataService: jasmine.SpyObj<DataService>;

  const mockCondominiums: Condominium[] = [
    { id: 'condo1', name: 'Green Valley', address: '123 Green Rd' },
    { id: 'condo2', name: 'Blue Sky', address: '456 Blue Ave' }
  ];
  const mockHousesCondo1: House[] = [
    { id: 'house1', number: 'A101', condominiumId: 'condo1', ownerName: 'John Doe' },
    { id: 'house2', number: 'A102', condominiumId: 'condo1', ownerName: 'Jane Smith' }
  ];

  beforeEach(async () => {
    mockDataService = jasmine.createSpyObj('DataService', ['getCondominiums', 'getHousesByCondominium', 'addUsageRecord']);
    mockDataService.getCondominiums.and.returnValue(of(mockCondominiums));
    mockDataService.getHousesByCondominium.and.returnValue(of(mockHousesCondo1));
    mockDataService.addUsageRecord.and.callFake((record) => of({ ...record, id: 'usage123', recordedAt: new Date() }));

    await TestBed.configureTestingModule({
      // Instead of imports: [DataEntryPageComponent], use declarations for standalone: false
      declarations: [DataEntryPageComponent], 
      imports: [
        ReactiveFormsModule,
        CommonModule 
      ],
      providers: [
        { provide: DataService, useValue: mockDataService }
      ],
      schemas: [NO_ERRORS_SCHEMA] 
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DataEntryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // This calls ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the dataEntryForm with default values and validators', () => {
    expect(component.dataEntryForm).toBeDefined();
    expect(component.dataEntryForm.get('condominiumId')).toBeDefined();
    expect(component.dataEntryForm.get('houseId')).toBeDefined();
    expect(component.dataEntryForm.get('houseId')?.disabled).toBeTrue(); 
    expect(component.usageDetailsFormGroup).toBeDefined();
    expect(component.usageDetailsFormGroup.get('type')).toBeDefined();
    expect(component.usageDetailsFormGroup.get('usage')).toBeDefined();
    expect(component.usageDetailsFormGroup.get('month')).toBeDefined();
    expect(component.usageDetailsFormGroup.get('year')).toBeDefined();
  });

  it('should load condominiums on init', fakeAsync(() => {
    // ngOnInit already called by fixture.detectChanges() in beforeEach
    component.condominiums$.subscribe(condos => {
      expect(condos.length).toBe(2);
      expect(condos[0].name).toBe('Green Valley');
    });
    tick(); // Complete the observable stream
    expect(mockDataService.getCondominiums).toHaveBeenCalled();
  }));

  it('should load houses when condominiumId changes and enable houseId control', fakeAsync(() => {
    component.dataEntryForm.get('condominiumId')?.setValue('condo1');
    tick(); // Process condoId valueChange for houses$
    
    component.houses$.subscribe(houses => {
      expect(houses).toBeTruthy();
      if (houses) { // Type guard
        expect(houses.length).toBe(2);
        expect(houses[0].ownerName).toBe('John Doe');
      }
    });
    tick(); // Complete the houses$ stream
    expect(mockDataService.getHousesByCondominium).toHaveBeenCalledWith('condo1');
    expect(component.dataEntryForm.get('houseId')?.enabled).toBeTrue();
  }));

  it('should disable and reset houseId control if condominiumId is cleared', fakeAsync(() => {
    // First, set a condo to enable houseId
    component.dataEntryForm.get('condominiumId')?.setValue('condo1');
    tick();
    
    // Now, clear condo selection
    component.dataEntryForm.get('condominiumId')?.setValue(''); 
    tick(); // Process condoId valueChange

    component.houses$.subscribe(houses => {
      expect(houses).toBeNull();
    });
    tick(); // Complete the houses$ stream
    expect(component.dataEntryForm.get('houseId')?.disabled).toBeTrue();
    expect(component.dataEntryForm.get('houseId')?.value).toBeNull(); 
  }));

  describe('Form Validation', () => {
    it('should be invalid when condominiumId is empty', () => {
      component.dataEntryForm.setValue({
        condominiumId: '',
        houseId: '', // Will be disabled initially, but set for completeness
        usageDetails: { type: UsageType.WATER, usage: 10, month: 1, year: 2024 }
      });
      expect(component.dataEntryForm.get('condominiumId')?.valid).toBeFalse();
      expect(component.dataEntryForm.valid).toBeFalse();
    });

    it('should be invalid when houseId is empty after a condominium is selected', fakeAsync(() => {
      component.dataEntryForm.get('condominiumId')?.setValue('condo1');
      tick(); // allow houses to load and houseId to be enabled
      component.dataEntryForm.patchValue({
        houseId: '',
        usageDetails: { type: UsageType.WATER, usage: 10, month: 1, year: 2024 }
      });
      expect(component.dataEntryForm.get('houseId')?.valid).toBeFalse();
      expect(component.dataEntryForm.valid).toBeFalse();
    }));

    it('should be invalid if usage is not a positive number', () => {
      component.usageDetailsFormGroup.patchValue({ usage: -5 });
      expect(component.usageDetailsFormGroup.get('usage')?.valid).toBeFalse();
      // To check the whole form, we'd need condoId and houseId to be valid first
    });

    it('should be invalid if month is out of range', () => {
      component.usageDetailsFormGroup.patchValue({ month: 13 });
      expect(component.usageDetailsFormGroup.get('month')?.valid).toBeFalse();
      component.usageDetailsFormGroup.patchValue({ month: 0 });
      expect(component.usageDetailsFormGroup.get('month')?.valid).toBeFalse();
    });
     
    it('should be invalid if year is out of reasonable range', () => {
      const currentYear = new Date().getFullYear();
      component.usageDetailsFormGroup.patchValue({ year: currentYear - 21 }); // Too old based on validator min(currentYear - 20)
      expect(component.usageDetailsFormGroup.get('year')?.valid).toBeFalse();
      component.usageDetailsFormGroup.patchValue({ year: currentYear + 6 }); // Too new based on validator max(currentYear + 5)
      expect(component.usageDetailsFormGroup.get('year')?.valid).toBeFalse();
    });

    it('should be valid when all fields are correctly filled', fakeAsync(() => {
      component.dataEntryForm.get('condominiumId')?.setValue('condo1');
      tick(); // For houses$
      component.dataEntryForm.patchValue({ houseId: 'house1' });
      component.usageDetailsFormGroup.setValue({
        type: UsageType.ENERGY,
        usage: 150,
        month: 12,
        year: new Date().getFullYear()
      });
      expect(component.dataEntryForm.valid).toBeTrue();
    }));
  });

  describe('onSubmit', () => {
    beforeEach(fakeAsync(() => {
      // Set up a valid form state before each onSubmit test
      component.dataEntryForm.get('condominiumId')?.setValue('condo1');
      tick(); // Allow houses$ to emit and houseId control to enable
      component.dataEntryForm.get('houseId')?.setValue('house1');
      component.usageDetailsFormGroup.setValue({
        type: UsageType.WATER,
        usage: 100,
        month: 5,
        year: 2024
      });
      tick(); // Allow form to stabilize
      fixture.detectChanges(); // Reflect data model changes to the form
    }));

    it('should call dataService.addUsageRecord if form is valid', () => {
      // Ensure form is actually valid before testing submission
      expect(component.dataEntryForm.valid).withContext('Form should be valid before onSubmit test').toBeTrue();
      component.onSubmit();
      expect(mockDataService.addUsageRecord).toHaveBeenCalled();
    });

    it('should reset the form, including usageDetails, and disable houseId after successful submission', fakeAsync(() => {
      spyOn(component.dataEntryForm, 'reset').and.callThrough();
      // Cannot spy on usageDetailsFormGroup.reset directly if it's a getter returning a new instance or if it's reset via the parent.
      // Instead, check values after reset.
      
      component.onSubmit();
      tick(); 

      expect(component.dataEntryForm.reset).toHaveBeenCalled();
      
      // Check that specific fields are reset
      expect(component.dataEntryForm.get('condominiumId')?.value).toBeNull(); // Or '' depending on reset behavior
      expect(component.dataEntryForm.get('houseId')?.value).toBeNull(); // Or ''
      expect(component.usageDetailsFormGroup.get('type')?.value).toBeNull(); // Or ''
      expect(component.usageDetailsFormGroup.get('usage')?.value).toBeNull(); // Or ''
      expect(component.usageDetailsFormGroup.get('month')?.value).toBeNull(); // Or ''
      expect(component.usageDetailsFormGroup.get('year')?.value).toBeNull(); // Or ''
      
      expect(component.dataEntryForm.get('houseId')?.disabled).toBeTrue();
    }));
    
    it('should log success and alert on successful submission', fakeAsync(() => { // Test remains largely the same
      spyOn(console, 'log');
      spyOn(window, 'alert');
      component.onSubmit();
      tick();
      expect(window.alert).toHaveBeenCalledWith('Usage record saved successfully!');
    }));

    it('should not call dataService.addUsageRecord if form is invalid', () => {
      component.dataEntryForm.get('condominiumId')?.setValue(''); 
      fixture.detectChanges();
      expect(component.dataEntryForm.invalid).toBeTrue();
      
      component.onSubmit();
      expect(mockDataService.addUsageRecord).not.toHaveBeenCalled();
    });

    it('should mark all fields as touched if form is invalid and submitted', () => {
      component.dataEntryForm.get('condominiumId')?.setValue(''); 
      spyOn(component.dataEntryForm, 'markAllAsTouched');
      component.onSubmit();
      expect(component.dataEntryForm.markAllAsTouched).toHaveBeenCalled();
    });

    it('should handle error from dataService.addUsageRecord', fakeAsync(() => {
      mockDataService.addUsageRecord.and.returnValue(throwError(() => new Error('Test error')));
      spyOn(console, 'error');
      spyOn(window, 'alert');
      component.onSubmit();
      tick();
      expect(console.error).toHaveBeenCalledWith('Error saving usage record:', jasmine.any(Error));
      expect(window.alert).toHaveBeenCalledWith('Failed to save usage record.');
    }));
  });
});
