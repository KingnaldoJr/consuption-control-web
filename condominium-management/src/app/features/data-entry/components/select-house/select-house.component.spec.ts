import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectHouseComponent } from './select-house.component';
import { House } from '../../../../core/models/house.model';
import { By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common'; // For *ngFor, *ngIf

describe('SelectHouseComponent', () => {
  let component: SelectHouseComponent;
  let fixture: ComponentFixture<SelectHouseComponent>;

  const mockHouses: House[] = [
    { id: 'house1', number: 'A101', condominiumId: 'condo1', ownerName: 'John Doe' },
    { id: 'house2', number: 'A102', condominiumId: 'condo1', ownerName: 'Jane Smith' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // imports: [SelectHouseComponent] // For standalone
      declarations: [SelectHouseComponent], // For non-standalone
      imports: [CommonModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectHouseComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges(); // Call after setting inputs or in each test
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display "Please select a condominium first" and be disabled if houses input is null', () => {
    component.houses = null;
    fixture.detectChanges();
    const selectElement = fixture.debugElement.query(By.css('select')).nativeElement as HTMLSelectElement;
    expect(selectElement.disabled).toBeTrue();
    
    const placeholderOption = fixture.debugElement.query(By.css('option[disabled]'));
    expect(placeholderOption.nativeElement.textContent.trim()).toBe('Please select a condominium first');
  });

  it('should display "Please select a condominium first" and be disabled if houses input is an empty array', () => {
    component.houses = [];
    fixture.detectChanges();
    const selectElement = fixture.debugElement.query(By.css('select')).nativeElement as HTMLSelectElement;
    expect(selectElement.disabled).toBeTrue();

    const placeholderOption = fixture.debugElement.query(By.css('option[disabled]'));
    expect(placeholderOption.nativeElement.textContent.trim()).toBe('Please select a condominium first');
  });

  it('should display house numbers and owner names if houses are provided and be enabled', () => {
    component.houses = mockHouses;
    fixture.detectChanges();
    const selectElement = fixture.debugElement.query(By.css('select')).nativeElement as HTMLSelectElement;
    expect(selectElement.disabled).toBeFalse();

    const options = fixture.debugElement.queryAll(By.css('option'));
    // Default "choose a house" + 2 houses
    expect(options.length).toBe(mockHouses.length + 1); 
    expect(options[1].nativeElement.textContent.trim()).toBe(`${mockHouses[0].number} - ${mockHouses[0].ownerName}`);
    expect(options[1].nativeElement.value).toBe(mockHouses[0].id);
    expect(options[2].nativeElement.textContent.trim()).toBe(`${mockHouses[1].number} - ${mockHouses[1].ownerName}`);
    expect(options[2].nativeElement.value).toBe(mockHouses[1].id);
  });

  it('should emit houseSelected event with the correct houseId on selection change', () => {
    spyOn(component.houseSelected, 'emit');
    component.houses = mockHouses;
    fixture.detectChanges();

    const selectElement = fixture.debugElement.query(By.css('select')).nativeElement as HTMLSelectElement;
    selectElement.value = mockHouses[1].id; // Select the second house
    selectElement.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(component.houseSelected.emit).toHaveBeenCalledWith(mockHouses[1].id);
  });

  it('should have a default disabled "Please choose a house" option selected initially when enabled', () => {
    component.houses = mockHouses; // Provide data to enable the select
    fixture.detectChanges();
    const selectElement = fixture.debugElement.query(By.css('select')).nativeElement as HTMLSelectElement;
    expect(selectElement.value).toBe(''); // The default option has value ""
    
    const defaultOption = fixture.debugElement.query(By.css('option[value=""]'));
    expect(defaultOption).toBeTruthy();
    expect(defaultOption.nativeElement.selected).toBeTrue();
    expect(defaultOption.nativeElement.disabled).toBeTrue();
  });
});
