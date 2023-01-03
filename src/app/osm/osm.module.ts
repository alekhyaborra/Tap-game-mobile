import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { OsmPage } from './osm.page';
import { SharedComponentModule } from '../sharedComponents/shared-component.module';
const routes: Routes = [
  {
    path: '',
    component: OsmPage
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
  declarations: [OsmPage]
})
export class OsmPageModule {}
