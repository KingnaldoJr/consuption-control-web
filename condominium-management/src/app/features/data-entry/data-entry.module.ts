import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DataEntryRoutingModule } from './data-entry-routing.module';

// Import standalone page component for this module's routes
import { DataEntryPageComponent } from './components/data-entry-page/data-entry-page.component';

@NgModule({
  declarations: [
    // Standalone components are not declared in NgModules.
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule, 
    DataEntryRoutingModule,
    // Import the main page component for this module.
    // DataEntryPageComponent itself is standalone and imports its own child components and necessary modules.
    DataEntryPageComponent
  ],
})
export class DataEntryModule { }
