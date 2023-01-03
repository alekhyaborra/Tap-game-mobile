import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MapPage } from './map.page';
import { MarkerInfoComponent } from'./marker-info/marker-info.component'
import { SharedComponentModule } from '../sharedComponents/shared-component.module';
const routes: Routes = [
  {
    path: '',
    component: MapPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SharedComponentModule
  ],
  declarations: [MapPage,MarkerInfoComponent],
  entryComponents: [MarkerInfoComponent]
})
export class MapPageModule {}
