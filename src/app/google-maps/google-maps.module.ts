import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { GoogleMapsPage } from './google-maps.page';
import { SharedComponentModule } from '../sharedComponents/shared-component.module';

const routes: Routes = [
  {
    path: '',
    component: GoogleMapsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SharedComponentModule
  ],
  declarations: [GoogleMapsPage]
})
export class GoogleMapsPageModule {}
