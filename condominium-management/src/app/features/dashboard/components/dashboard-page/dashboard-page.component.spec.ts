import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { DashboardPageComponent } from './dashboard-page.component';
import { DataService } from '../../../../core/services/data.service';
import { UsageRecord, UsageType } from '../../../../core/models/usage-record.model';
import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core'; // To avoid declaring all child components

describe('DashboardPageComponent', () => {
  let component: DashboardPageComponent;
  let fixture: ComponentFixture<DashboardPageComponent>;
  let mockDataService: jasmine.SpyObj<DataService>;

  // Default mock records for general tests
  const defaultMockUsageRecords: UsageRecord[] = [
    { id: 'r1', houseId: 'h1', type: UsageType.WATER, usage: 100, month: 1, year: 2024, recordedAt: new Date() },
    { id: 'r2', houseId: 'h1', type: UsageType.ENERGY, usage: 200, month: 1, year: 2024, recordedAt: new Date() },
    { id: 'r3', houseId: 'h2', type: UsageType.WATER, usage: 150, month: 1, year: 2024, recordedAt: new Date() },
    { id: 'r4', houseId: 'h1', type: UsageType.GAS, usage: 50, month: 1, year: 2024, recordedAt: new Date() },
    { id: 'r5', houseId: 'h1', type: UsageType.WATER, usage: 120, month: 2, year: 2024, recordedAt: new Date() },
    { id: 'r6', houseId: 'h3', type: UsageType.WATER, usage: 0, month: 1, year: 2024, recordedAt: new Date() }, // Record with zero usage
  ];

  // Helper function to setup TestBed and component
  async function setupTestBed(mockRecords: UsageRecord[]) {
    mockDataService = jasmine.createSpyObj('DataService', ['getAllUsageRecords']);
    mockDataService.getAllUsageRecords.and.returnValue(of(mockRecords));

    await TestBed.configureTestingModule({
        declarations: [DashboardPageComponent],
        imports: [CommonModule],
        providers: [{ provide: DataService, useValue: mockDataService }],
        schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardPageComponent);
    component = fixture.componentInstance;
  }

  describe('with default mock records', () => {
    beforeEach(async () => {
      await setupTestBed(defaultMockUsageRecords);
      fixture.detectChanges(); // Calls ngOnInit
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should call getAllUsageRecords on ngOnInit', () => {
      expect(mockDataService.getAllUsageRecords).toHaveBeenCalled();
    });

    it('should correctly calculate totalWaterUsage$', fakeAsync(() => {
      let totalWater = 0;
      component.totalWaterUsage$.subscribe(value => totalWater = value);
      tick(); 
      expect(totalWater).toBe(270); // 100 (r1) + 150 (r3) + 120 (r5) + 0 (r6)
    }));

    it('should correctly calculate totalEnergyUsage$', fakeAsync(() => {
      let totalEnergy = 0;
      component.totalEnergyUsage$.subscribe(value => totalEnergy = value);
      tick();
      expect(totalEnergy).toBe(200); // 200 (r2)
    }));

    it('should correctly calculate totalGasUsage$', fakeAsync(() => {
      let totalGas = 0;
      component.totalGasUsage$.subscribe(value => totalGas = value);
      tick();
      expect(totalGas).toBe(50); // 50 (r4)
    }));

    it('allUsageRecords$ should emit the records from the service', fakeAsync(() => {
      let emittedRecords: UsageRecord[] = [];
      component.allUsageRecords$.subscribe(records => emittedRecords = records);
      tick();
      expect(emittedRecords.length).toBe(defaultMockUsageRecords.length);
      expect(emittedRecords).toEqual(defaultMockUsageRecords);
    }));
  });

  describe('with no usage records', () => {
    beforeEach(async () => {
      await setupTestBed([]); // Setup with empty records
      fixture.detectChanges(); // Calls ngOnInit
    });

    it('should result in 0 for all total usages', fakeAsync(() => {
      let totalWater = -1, totalEnergy = -1, totalGas = -1;
      component.totalWaterUsage$.subscribe(v => totalWater = v);
      component.totalEnergyUsage$.subscribe(v => totalEnergy = v);
      component.totalGasUsage$.subscribe(v => totalGas = v);
      tick();
      expect(totalWater).toBe(0);
      expect(totalEnergy).toBe(0);
      expect(totalGas).toBe(0);
    }));
  });

  describe('with records of a single type (e.g., only WATER)', () => {
    const onlyWaterRecords: UsageRecord[] = [
      { id: 'w1', houseId: 'h1', type: UsageType.WATER, usage: 100, month: 1, year: 2024, recordedAt: new Date() },
      { id: 'w2', houseId: 'h2', type: UsageType.WATER, usage: 50, month: 1, year: 2024, recordedAt: new Date() },
    ];
    beforeEach(async () => {
      await setupTestBed(onlyWaterRecords);
      fixture.detectChanges();
    });

    it('should calculate totalWaterUsage correctly and others as 0', fakeAsync(() => {
      let totalWater = 0, totalEnergy = -1, totalGas = -1;
      component.totalWaterUsage$.subscribe(v => totalWater = v);
      component.totalEnergyUsage$.subscribe(v => totalEnergy = v);
      component.totalGasUsage$.subscribe(v => totalGas = v);
      tick();
      expect(totalWater).toBe(150);
      expect(totalEnergy).toBe(0);
      expect(totalGas).toBe(0);
    }));
  });
});
