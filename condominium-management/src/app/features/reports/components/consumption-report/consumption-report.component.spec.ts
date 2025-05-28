import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConsumptionReportComponent } from './consumption-report.component';
import { CommonModule } from '@angular/common'; // Import CommonModule for basic directives

describe('ConsumptionReportComponent', () => {
  let component: ConsumptionReportComponent;
  let fixture: ComponentFixture<ConsumptionReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsumptionReportComponent ],
      imports: [ CommonModule ] // Add CommonModule or other necessary modules for testing
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsumptionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the report title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h2')?.textContent).toContain('Consumption Report');
  });

  it('should have a "Generate Report" button', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('button.btn')?.textContent).toContain('Generate Report');
  });

});
