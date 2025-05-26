import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsageSummaryCardComponent } from './usage-summary-card.component';
import { By } from '@angular/platform-browser';
import { Component, Input } from '@angular/core'; // For NO_ERRORS_SCHEMA if not used

// NO_ERRORS_SCHEMA can be used if child components are not relevant to the test
// import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('UsageSummaryCardComponent', () => {
  let component: UsageSummaryCardComponent;
  let fixture: ComponentFixture<UsageSummaryCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsageSummaryCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsageSummaryCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
