import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TasksListPage } from './tasks-list.page';
import { SharedComponentModule } from '../../sharedComponents/shared-component.module';
import { OrderModule } from 'ngx-order-pipe';
import { NgCircleProgressModule } from 'ng-circle-progress';

const routes: Routes = [
  {
    path: '',
    component: TasksListPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SharedComponentModule,
    OrderModule,
    NgCircleProgressModule.forRoot()
  ],
  declarations: [TasksListPage]
})
export class TasksListPageModule {}
