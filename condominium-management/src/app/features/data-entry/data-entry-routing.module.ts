import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DataEntryPageComponent } from './components/data-entry-page/data-entry-page.component';

const routes: Routes = [
  { path: '', component: DataEntryPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataEntryRoutingModule { }
