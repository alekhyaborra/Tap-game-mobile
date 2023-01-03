import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ReferenceListPage } from './reference-list.page';
import { SharedComponentModule } from '../sharedComponents/shared-component.module';

const routes: Routes = [
  {
    path: '',
    component: ReferenceListPage
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
  declarations: [ReferenceListPage]
})
export class ReferenceListPageModule {}
