import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { BlueToothDevicesPage } from './blue-tooth-devices.page';

const routes: Routes = [
  {
    path: '',
    component: BlueToothDevicesPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [BlueToothDevicesPage]
})
export class BlueToothDevicesPageModule {}
