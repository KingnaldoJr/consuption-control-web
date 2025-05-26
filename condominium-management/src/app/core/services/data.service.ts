import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Condominium } from '../models/condominium.model';
import { House } from '../models/house.model';
import { UsageRecord, UsageType } from '../models/usage-record.model'; // Added UsageType

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private mockCondominiums: Condominium[] = [
    { id: 'condo1', name: 'Green Valley Condominiums', address: '123 Green Valley Rd' },
    { id: 'condo2', name: 'Blue Sky Apartments', address: '456 Blue Sky Ave' }
  ];

  private mockHouses: House[] = [
    { id: 'house1', number: 'A101', condominiumId: 'condo1', ownerName: 'John Doe' },
    { id: 'house2', number: 'A102', condominiumId: 'condo1', ownerName: 'Jane Smith' },
    { id: 'house3', number: 'B201', condominiumId: 'condo2', ownerName: 'Peter Jones' },
    { id: 'house4', number: 'B202', condominiumId: 'condo2', ownerName: 'Mary Brown' }
  ];

  private mockUsageRecords: UsageRecord[] = [
    // Initial mock data for dashboard display
    { id: 'usage1', houseId: 'house1', type: UsageType.WATER, usage: 120, month: 1, year: 2024, recordedAt: new Date(2024, 0, 15) },
    { id: 'usage2', houseId: 'house1', type: UsageType.ENERGY, usage: 250, month: 1, year: 2024, recordedAt: new Date(2024, 0, 16) },
    { id: 'usage3', houseId: 'house2', type: UsageType.WATER, usage: 100, month: 1, year: 2024, recordedAt: new Date(2024, 0, 17) },
    { id: 'usage4', houseId: 'house3', type: UsageType.GAS, usage: 50, month: 1, year: 2024, recordedAt: new Date(2024, 0, 18) },
    { id: 'usage5', houseId: 'house1', type: UsageType.WATER, usage: 110, month: 2, year: 2024, recordedAt: new Date(2024, 1, 15) },
  ];

  constructor() { }

  getCondominiums(): Observable<Condominium[]> {
    return of(this.mockCondominiums);
  }

  getHousesByCondominium(condominiumId: string): Observable<House[]> {
    const filteredHouses = this.mockHouses.filter(house => house.condominiumId === condominiumId);
    return of(filteredHouses);
  }

  addUsageRecord(record: UsageRecord): Observable<UsageRecord> {
    // Ensure new records also get a unique ID, distinct from initial mocks
    const newIdSuffix = this.mockUsageRecords.filter(r => r.id.startsWith('usageNew')).length + 1;
    record.id = `usageNew${newIdSuffix}`; 
    record.recordedAt = new Date();
    this.mockUsageRecords.push(record);
    console.log('Added usage record:', record);
    return of(record);
  }

  getAllUsageRecords(): Observable<UsageRecord[]> {
    return of(this.mockUsageRecords);
  }

  getUsageRecordsByHouse(houseId: string): Observable<UsageRecord[]> {
    const filteredRecords = this.mockUsageRecords.filter(record => record.houseId === houseId);
    return of(filteredRecords);
  }
}
