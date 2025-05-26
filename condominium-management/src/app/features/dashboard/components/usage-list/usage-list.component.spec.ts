import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsageListComponent } from './usage-list.component';
import { UsageRecord, UsageType } from '../../../../core/models/usage-record.model';
import { By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common'; // For DatePipe

describe('UsageListComponent', () => {
  let component: UsageListComponent;
  let fixture: ComponentFixture<UsageListComponent>;

  const mockRecords: UsageRecord[] = [
    { id: '1', houseId: 'H101', type: UsageType.WATER, usage: 120, month: 1, year: 2024, recordedAt: new Date(2024, 0, 10, 10, 30) }, // Jan 10, 2024 10:30
    { id: '2', houseId: 'H102', type: UsageType.ENERGY, usage: 250, month: 1, year: 2024, recordedAt: new Date(2024, 0, 11, 11, 45) }, // Jan 11, 2024 11:45
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // imports: [UsageListComponent] // This is for standalone components
      declarations: [UsageListComponent], // For non-standalone components
      imports: [CommonModule] 
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UsageListComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges(); // Call in individual tests or after inputs are set
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display the title input', () => {
    const testTitle = 'Test Usage Records';
    component.title = testTitle;
    fixture.detectChanges();
    const titleElement = fixture.debugElement.query(By.css('.card-header'));
    expect(titleElement.nativeElement.textContent.trim()).toBe(testTitle);
  });

  it('should display "Usage Records" as default title if no title is provided', () => {
    fixture.detectChanges(); 
    const titleElement = fixture.debugElement.query(By.css('.card-header'));
    expect(titleElement.nativeElement.textContent.trim()).toBe('Usage Records');
  });

  it('should display "No usage records available." if records input is null', () => {
    component.records = null;
    fixture.detectChanges();
    const alertElement = fixture.debugElement.query(By.css('.alert.alert-info'));
    expect(alertElement).toBeTruthy();
    expect(alertElement.nativeElement.textContent.trim()).toBe('No usage records available.');
    const tableElement = fixture.debugElement.query(By.css('table'));
    expect(tableElement).toBeNull();
  });

  it('should display "No usage records available." if records input is an empty array', () => {
    component.records = [];
    fixture.detectChanges();
    const alertElement = fixture.debugElement.query(By.css('.alert.alert-info'));
    expect(alertElement).toBeTruthy();
    expect(alertElement.nativeElement.textContent.trim()).toBe('No usage records available.');
    const tableElement = fixture.debugElement.query(By.css('table'));
    expect(tableElement).toBeNull();
  });

  it('should display the table with records if records are provided', () => {
    component.records = mockRecords;
    fixture.detectChanges();
    const tableElement = fixture.debugElement.query(By.css('table'));
    expect(tableElement).toBeTruthy();
    const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(rows.length).toBe(mockRecords.length);
  });

  it('should display record details correctly in table rows', () => {
    component.records = [mockRecords[0]]; 
    fixture.detectChanges();
    const firstRowCells = fixture.debugElement.queryAll(By.css('tbody tr:first-child td'));
    
    // DatePipe format in template is 'yyyy-MM-dd HH:mm'
    // Check for parts of the date string due to potential timezone/locale issues in test runner
    expect(firstRowCells[0].nativeElement.textContent).toContain('2024-01-10');
    expect(firstRowCells[0].nativeElement.textContent).toContain('10:30'); // Check time part
    expect(firstRowCells[1].nativeElement.textContent.trim()).toBe(mockRecords[0].houseId);
    expect(firstRowCells[2].nativeElement.textContent.trim()).toBe(mockRecords[0].type);
    expect(firstRowCells[3].nativeElement.textContent.trim()).toBe(mockRecords[0].usage.toString());
    expect(firstRowCells[4].nativeElement.textContent.trim()).toBe(mockRecords[0].month.toString());
    expect(firstRowCells[5].nativeElement.textContent.trim()).toBe(mockRecords[0].year.toString());
  });
});
