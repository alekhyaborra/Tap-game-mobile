import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FormBuilderComponent } from './form-builder.component';
import { SharedComponentModule } from '../../sharedComponents/shared-component.module';
import { DynamicFormModule } from '../../dynamic-form/dynamic-form.module';

const routes: Routes = [
  {
    path: '',
    component: FormBuilderComponent
  }
];

@NgModule({
  declarations: [FormBuilderComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SharedComponentModule,
    DynamicFormModule
  ]
})
export class FormBuilderModule { }
