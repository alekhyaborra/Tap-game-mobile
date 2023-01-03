import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { DashboardPage } from './dashboard.page';
import { DashboardRoutingModule } from './dashboard-routing.module'
import { ChartsModule } from 'ng2-charts';
import { FormsTabComponent } from './component/forms-tab/forms-tab.component';
import { TaskTabComponent } from './component/task-tab/task-tab.component';
import { SliderModule } from '../slider/slider.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DashboardRoutingModule,
    ChartsModule,
    SliderModule,
  ],
  declarations: [
    DashboardPage, 
    FormsTabComponent, 
    TaskTabComponent
  ]
})
export class DashboardPageModule {}
