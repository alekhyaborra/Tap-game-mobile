import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { GpsTrackingPage } from './gps-tracking.page';

const routes: Routes = [
  {
    path: '',
    component: GpsTrackingPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [GpsTrackingPage]
})
export class GpsTrackingPageModule {
  constructor(private fb: FormBuilder) {

  }
 
}
