import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { GeometryObjectFormPage } from './geometry-object-form.page';
import { DynamicFormModule } from '../../dynamic-form/dynamic-form.module';
import { SharedComponentModule } from '../../sharedComponents/shared-component.module';

const routes: Routes = [
  {
    path: '',
    component: GeometryObjectFormPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    DynamicFormModule,
    SharedComponentModule
  ],
  declarations: [GeometryObjectFormPage]
})
export class GeometryObjectFormPageModule {}
