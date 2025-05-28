import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-consumption-report',
  templateUrl: './consumption-report.component.html',
  styleUrls: ['./consumption-report.component.scss']
})
export class ConsumptionReportComponent implements OnInit {

  // Properties for form filters
  startDate: string = '';
  endDate: string = '';
  selectedCondominium: string = '';
  selectedHouse: string = '';
  reportType: string = 'detailed'; // Default to 'detailed'

  // Properties for report display
  reportGenerated: boolean = false;
  hasData: boolean = false;
  summaryData: any = {};
  detailedData: any[] = [];

  constructor() { }

  ngOnInit(): void {
    console.log('ConsumptionReportComponent initialized');
  }

  generateReport(): void {
    this.reportGenerated = true;
    console.log('Generating report with filters:', {
      startDate: this.startDate,
      endDate: this.endDate,
      condominium: this.selectedCondominium,
      house: this.selectedHouse,
      reportType: this.reportType
    });

    // Simulate data fetching based on reportType
    if (this.reportType === 'summary') {
      this.summaryData = { totalConsumption: 1200, averageConsumption: 60 };
      this.detailedData = []; // Clear other data types
      this.hasData = true;
    } else if (this.reportType === 'detailed') {
      this.detailedData = [
        { houseUnit: 'A101', prevReading: 1000, currReading: 1150, consumption: 150, readDate: '2023-10-31' },
        { houseUnit: 'B205', prevReading: 500, currReading: 580, consumption: 80, readDate: '2023-10-31' },
        { houseUnit: 'C301', prevReading: 1200, currReading: 1350, consumption: 150, readDate: '2023-10-30' },
      ];
      this.summaryData = {}; // Clear other data types
      this.hasData = true;
    } else if (this.reportType === 'comparative') {
      // For comparative, we might not have specific structured data like above for now.
      // The HTML placeholder is more descriptive.
      this.summaryData = {}; // Clear other data types
      this.detailedData = [];
      // Let's simulate having data for comparative to show the placeholder text
      this.hasData = true;
      // If you wanted to test the "No data found" for comparative:
      // this.hasData = false;
    } else {
      this.hasData = false;
      this.summaryData = {};
      this.detailedData = [];
    }

    // This direct DOM manipulation is generally not recommended in Angular.
    // The HTML template should react to property changes (reportGenerated, hasData, etc.)
    // const reportDisplayArea = document.getElementById('reportDisplayArea');
    // if (reportDisplayArea) {
    //   // Content is now handled by *ngIf/*ngFor in the template
    // }
  }

  exportReport(): void {
    console.log('Export report action triggered.');
    alert('Export functionality is not yet implemented.');
  }

  printReport(): void {
    console.log('Print report action triggered.');
    alert('Print functionality is not yet implemented.');
  }

}
