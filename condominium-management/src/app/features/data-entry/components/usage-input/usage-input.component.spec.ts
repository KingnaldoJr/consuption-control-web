import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsageInputComponent } from './usage-input.component';
import { UsageType } from '../../../../core/models/usage-record.model';
import { By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common'; // For *ngFor

describe('UsageInputComponent', () => {
  let component: UsageInputComponent;
  let fixture: ComponentFixture<UsageInputComponent>;
  let parentForm: FormGroup;
  const fb = new FormBuilder();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // imports: [UsageInputComponent] // For standalone
      declarations: [UsageInputComponent], // For non-standalone
      imports: [ReactiveFormsModule, CommonModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsageInputComponent);
    component = fixture.componentInstance;

    // Create a parent form group that contains the usageDetails form group
    parentForm = fb.group({
      usageDetails: fb.group({
        type: ['', Validators.required],
        usage: ['', [Validators.required, Validators.min(0.01)]],
        month: ['', [Validators.required, Validators.min(1), Validators.max(12)]],
        year: ['', [Validators.required, Validators.min(2000), Validators.max(2050)]]
      })
    });
    // Pass the nested usageDetails group to the component
    component.usageFormGroup = parentForm.get('usageDetails') as FormGroup;
    
    // fixture.detectChanges(); // Call after setting inputs or in each test
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display usage types in the select options', () => {
    fixture.detectChanges();
    const typeSelect = fixture.debugElement.query(By.css('#usage-type'));
    const options = typeSelect.queryAll(By.css('option'));
    
    // +1 for the default "--Select Type--" option
    expect(options.length).toBe(Object.values(UsageType).length + 1); 
    // Example check for one of the types
    const waterOption = options.find(opt => opt.nativeElement.value === UsageType.WATER);
    expect(waterOption).toBeTruthy();
    expect(waterOption?.nativeElement.textContent.trim()).toBe(UsageType.WATER);
  });

  it('should link form controls to the input fields', () => {
    fixture.detectChanges();
    const usageDetails = component.usageFormGroup;
    
    usageDetails.get('type')?.setValue(UsageType.ENERGY);
    usageDetails.get('usage')?.setValue(150);
    usageDetails.get('month')?.setValue(7);
    usageDetails.get('year')?.setValue(2023);
    fixture.detectChanges(); // Update view with form values

    const typeSelect = fixture.debugElement.query(By.css('#usage-type')).nativeElement as HTMLSelectElement;
    const usageInput = fixture.debugElement.query(By.css('#usage-amount')).nativeElement as HTMLInputElement;
    const monthSelect = fixture.debugElement.query(By.css('#usage-month')).nativeElement as HTMLSelectElement;
    const yearInput = fixture.debugElement.query(By.css('#usage-year')).nativeElement as HTMLInputElement;

    expect(typeSelect.value).toBe(UsageType.ENERGY);
    expect(usageInput.valueAsNumber).toBe(150);
    expect(monthSelect.value).toBe('7'); // Select values are strings
    expect(yearInput.valueAsNumber).toBe(2023);
  });

  it('should display validation error for type when touched and invalid', () => {
    fixture.detectChanges(); // Initial render
    const typeControl = component.usageFormGroup.get('type');
    typeControl?.markAsTouched(); // Mark as touched
    fixture.detectChanges(); // Re-render to show error message

    const errorDiv = fixture.debugElement.query(By.css('#usage-type + .text-danger')); // Adjust selector if HTML is different
    expect(errorDiv).toBeTruthy();
    expect(errorDiv.nativeElement.textContent).toContain('Usage type is required.');
  });
  
  it('should display validation error for usage when touched and invalid (e.g., negative value)', () => {
    fixture.detectChanges();
    const usageControl = component.usageFormGroup.get('usage');
    usageControl?.setValue(-5); // Invalid value
    usageControl?.markAsTouched();
    fixture.detectChanges();

    const errorDiv = fixture.debugElement.query(By.css('#usage-amount + .text-danger'));
    expect(errorDiv).toBeTruthy();
    expect(errorDiv.nativeElement.textContent).toContain('Usage amount must be a positive number.');
  });
  
  it('should display months correctly in the month select', () => {
    fixture.detectChanges();
    const monthSelect = fixture.debugElement.query(By.css('#usage-month'));
    const options = monthSelect.queryAll(By.css('option'));
    // 1 (default "--Select Month--") + 12 months
    expect(options.length).toBe(12 + 1); 
    expect(options[1].nativeElement.textContent.trim()).toBe('1');
    expect(options[12].nativeElement.textContent.trim()).toBe('12');
  });
});
