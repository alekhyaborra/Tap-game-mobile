import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FormsListPage } from './forms-list.page';
import { SharedComponentModule } from '../../sharedComponents/shared-component.module';
import { NgCircleProgressModule } from 'ng-circle-progress';

const routes: Routes = [
  {
    path: '',
    component: FormsListPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SharedComponentModule,
    NgCircleProgressModule.forRoot()
  ],
  declarations: [
    FormsListPage
  ]
})
export class FormsListPageModule {}
