import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectCondominiumComponent } from './select-condominium.component';
import { Condominium } from '../../../../core/models/condominium.model';
import { By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common'; // For *ngFor, *ngIf

describe('SelectCondominiumComponent', () => {
  let component: SelectCondominiumComponent;
  let fixture: ComponentFixture<SelectCondominiumComponent>;

  const mockCondominiums: Condominium[] = [
    { id: 'condo1', name: 'Green Valley', address: '123 Green Rd' },
    { id: 'condo2', name: 'Blue Sky', address: '456 Blue Ave' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // imports: [SelectCondominiumComponent] // For standalone
      declarations: [SelectCondominiumComponent], // For non-standalone
      imports: [CommonModule] // For *ngFor, *ngIf
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectCondominiumComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges(); // Call after setting inputs or in each test
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display "Loading condominiums..." if condominiums input is null', () => {
    component.condominiums = null;
    fixture.detectChanges();
    const loadingOption = fixture.debugElement.query(By.css('option[disabled]'));
    // The template has two disabled options: the default "--Please choose..." and the "Loading..."
    // We need to find the one that says "Loading condominiums..."
    const allOptions = fixture.debugElement.queryAll(By.css('option'));
    const loadingTextOption = allOptions.find(opt => opt.nativeElement.textContent.includes('Loading condominiums...'));
    expect(loadingTextOption).toBeTruthy();
    expect(loadingTextOption?.nativeElement.disabled).toBeTrue();
  });

  it('should display "Loading condominiums..." if condominiums input is an empty array', () => {
    component.condominiums = [];
    fixture.detectChanges();
    const allOptions = fixture.debugElement.queryAll(By.css('option'));
    const loadingTextOption = allOptions.find(opt => opt.nativeElement.textContent.includes('Loading condominiums...'));
    expect(loadingTextOption).toBeTruthy();
    expect(loadingTextOption?.nativeElement.disabled).toBeTrue();
  });

  it('should display condominium names in options if condominiums are provided', () => {
    component.condominiums = mockCondominiums;
    fixture.detectChanges();
    const options = fixture.debugElement.queryAll(By.css('option'));
    // Expected options: default disabled, loading (if logic allows), then actual condos
    // The template logic is: <option *ngIf="!condominiums || condominiums.length === 0" disabled>Loading condominiums...</option>
    // So, if condominiums has items, "Loading..." option shouldn't be there.
    // It should have 1 default disabled + 2 condos = 3 options
    expect(options.length).toBe(mockCondominiums.length + 1); // +1 for the default "--Please choose..."
    expect(options[1].nativeElement.textContent.trim()).toBe(mockCondominiums[0].name);
    expect(options[1].nativeElement.value).toBe(mockCondominiums[0].id);
    expect(options[2].nativeElement.textContent.trim()).toBe(mockCondominiums[1].name);
    expect(options[2].nativeElement.value).toBe(mockCondominiums[1].id);
  });

  it('should emit condominiumSelected event with the correct condominiumId on selection change', () => {
    spyOn(component.condominiumSelected, 'emit');
    component.condominiums = mockCondominiums;
    fixture.detectChanges();

    const selectElement = fixture.debugElement.query(By.css('select')).nativeElement as HTMLSelectElement;
    selectElement.value = mockCondominiums[1].id; // Select the second condominium
    selectElement.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(component.condominiumSelected.emit).toHaveBeenCalledWith(mockCondominiums[1].id);
  });
  
  it('should have a default disabled "Please choose" option selected initially', () => {
    component.condominiums = mockCondominiums; // Provide some data
    fixture.detectChanges();
    const selectElement = fixture.debugElement.query(By.css('select')).nativeElement as HTMLSelectElement;
    expect(selectElement.value).toBe(''); // The default option has value ""
    const defaultOption = fixture.debugElement.query(By.css('option[value=""]'));
    expect(defaultOption).toBeTruthy();
    expect(defaultOption.nativeElement.selected).toBeTrue();
    expect(defaultOption.nativeElement.disabled).toBeTrue();
  });
});
