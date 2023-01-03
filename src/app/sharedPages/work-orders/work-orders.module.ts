import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { WorkOrdersPage } from './work-orders.page';
import { SharedComponentModule } from '../../sharedComponents/shared-component.module';
import { OrderModule } from 'ngx-order-pipe';

const routes: Routes = [
  {
    path: '',
    component: WorkOrdersPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SharedComponentModule,
    OrderModule
  ],
  providers:[DatePipe],
  declarations: [WorkOrdersPage]
})
export class WorkOrdersPageModule {}
