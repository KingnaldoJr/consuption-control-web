import { TestBed } from '@angular/core/testing';
import { DataService } from './data.service';
import { Condominium } from '../models/condominium.model';
import { House } from '../models/house.model';
import { UsageRecord, UsageType } from '../models/usage-record.model';
import { firstValueFrom } from 'rxjs';

describe('DataService', () => {
  let service: DataService;
  let initialMockRecords: UsageRecord[];

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataService);

    // Define the initial state of mock records used by the service.
    // This should match what the service constructor/initialization does.
    initialMockRecords = [
      { id: 'usage1', houseId: 'house1', type: UsageType.WATER, usage: 120, month: 1, year: 2024, recordedAt: new Date(2024, 0, 15) },
      { id: 'usage2', houseId: 'house1', type: UsageType.ENERGY, usage: 250, month: 1, year: 2024, recordedAt: new Date(2024, 0, 16) },
      { id: 'usage3', houseId: 'house2', type: UsageType.WATER, usage: 100, month: 1, year: 2024, recordedAt: new Date(2024, 0, 17) },
      { id: 'usage4', houseId: 'house3', type: UsageType.GAS, usage: 50, month: 1, year: 2024, recordedAt: new Date(2024, 0, 18) },
      { id: 'usage5', houseId: 'house1', type: UsageType.WATER, usage: 110, month: 2, year: 2024, recordedAt: new Date(2024, 1, 15) },
    ];
    
    // Reset the service's internal mockUsageRecords to a known state before each test.
    // This is a way to handle stateful services in tests. A more advanced setup
    // might involve providing a fresh service instance or using a dedicated testing utility.
    (service as any)['mockUsageRecords'] = JSON.parse(JSON.stringify(initialMockRecords));
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getCondominiums', () => {
    it('should return an observable of mock condominiums', async () => {
      const condominiums = await firstValueFrom(service.getCondominiums());
      expect(condominiums.length).toBe(2);
      expect(condominiums[0].id).toBe('condo1');
      expect(condominiums[1].name).toBe('Blue Sky Apartments');
    });
  });

  describe('getHousesByCondominium', () => {
    it('should return houses for a valid condominiumId', async () => {
      const houses = await firstValueFrom(service.getHousesByCondominium('condo1'));
      expect(houses.length).toBe(2);
      expect(houses[0].condominiumId).toBe('condo1');
      expect(houses[0].ownerName).toBe('John Doe');
    });

    it('should return an empty array for an invalid condominiumId', async () => {
      const houses = await firstValueFrom(service.getHousesByCondominium('invalidCondoId'));
      expect(houses.length).toBe(0);
    });
  });

  describe('addUsageRecord', () => {
    it('should add a usage record and return it with a new ID and recordedAt date', async () => {
      const newRecordData: Omit<UsageRecord, 'id' | 'recordedAt'> = { // Use Omit for new data
        houseId: 'house1',
        type: UsageType.ENERGY,
        usage: 150,
        month: 1,
        year: 2024,
      };

      // Cast to UsageRecord for the method call, ID and recordedAt are set by service
      const addedRecord = await firstValueFrom(service.addUsageRecord(newRecordData as UsageRecord)); 
      
      expect(addedRecord.id).toBeTruthy();
      expect(addedRecord.id).toMatch(/^usageNew\d+$/); // Check new ID format
      expect(addedRecord.houseId).toBe('house1');
      expect(addedRecord.type).toBe(UsageType.ENERGY);
      expect(addedRecord.recordedAt).toBeInstanceOf(Date);

      const allRecords = await firstValueFrom(service.getAllUsageRecords());
      expect(allRecords.length).toBe(initialMockRecords.length + 1);
      expect(allRecords.find(r => r.id === addedRecord.id)).toEqual(jasmine.objectContaining(newRecordData));
    });

    it('should assign unique IDs to subsequently added records', async () => {
      const record1Data: Omit<UsageRecord, 'id' | 'recordedAt'> = { houseId: 'h1', type: UsageType.WATER, usage: 10, month: 1, year: 2024 };
      const record2Data: Omit<UsageRecord, 'id' | 'recordedAt'> = { houseId: 'h2', type: UsageType.GAS, usage: 20, month: 1, year: 2024 };

      const added1 = await firstValueFrom(service.addUsageRecord(record1Data as UsageRecord));
      const added2 = await firstValueFrom(service.addUsageRecord(record2Data as UsageRecord));

      expect(added1.id).toMatch(/^usageNew\d+$/);
      expect(added2.id).toMatch(/^usageNew\d+$/);
      expect(added1.id).not.toBe(added2.id);
    });
  });

  describe('getAllUsageRecords', () => {
    it('should return all mock usage records from the initial set', async () => {
      const records = await firstValueFrom(service.getAllUsageRecords());
      // This test now relies on the beforeEach correctly resetting mockUsageRecords
      expect(records.length).toBe(initialMockRecords.length);
      expect(records).toEqual(initialMockRecords);
    });

    it('should return an updated list of records after adding a new one', async () => {
      const newRecordData: Omit<UsageRecord, 'id' | 'recordedAt'> = {
        houseId: 'houseTest', type: UsageType.ENERGY, usage: 300, month: 3, year: 2024
      };
      const addedRecord = await firstValueFrom(service.addUsageRecord(newRecordData as UsageRecord));
      
      const records = await firstValueFrom(service.getAllUsageRecords());
      expect(records.length).toBe(initialMockRecords.length + 1);
      expect(records.find(r => r.id === addedRecord.id)).toBeTruthy();
    });
  });

  describe('getUsageRecordsByHouse', () => {
    it('should return records for a valid houseId based on initial mock data', async () => {
      const house1Records = await firstValueFrom(service.getUsageRecordsByHouse('house1'));
      const expectedHouse1Records = initialMockRecords.filter(r => r.houseId === 'house1');
      expect(house1Records.length).toBe(expectedHouse1Records.length);
      expect(house1Records).toEqual(expectedHouse1Records);
    });

    it('should return an empty array for a houseId with no records in the initial set', async () => {
      // Assuming 'house4' exists in mockHouses but has no records in initialMockRecords
      const house4Records = await firstValueFrom(service.getUsageRecordsByHouse('house4')); 
      expect(house4Records.length).toBe(0);
    });

    it('should return an empty array for an invalid houseId', async () => {
      const invalidRecords = await firstValueFrom(service.getUsageRecordsByHouse('invalidHouseId'));
      expect(invalidRecords.length).toBe(0);
    });

    it('should return correct records for a house after a new record is added for it', async () => {
      const newRecordData: Omit<UsageRecord, 'id' | 'recordedAt'> = {
        houseId: 'house2', type: UsageType.ENERGY, usage: 175, month: 2, year: 2024
      };
      await firstValueFrom(service.addUsageRecord(newRecordData as UsageRecord));
      
      const house2Records = await firstValueFrom(service.getUsageRecordsByHouse('house2'));
      const expectedHouse2Records = initialMockRecords.filter(r => r.houseId === 'house2');
      // We added one more record for house2
      expect(house2Records.length).toBe(expectedHouse2Records.length + 1); 
      expect(house2Records.find(r => r.usage === 175 && r.type === UsageType.ENERGY)).toBeTruthy();
    });
  });
});
