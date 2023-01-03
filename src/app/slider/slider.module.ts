import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { SliderContainerComponent } from './slider-container/slider-container.component';
import { ChartsModule } from 'ng2-charts';
// import { NgChartsModule } from 'ng2-charts';
import { TaskInfoComponent } from './component/task-info/task-info.component';
import { FormsInfoComponent} from './component/forms-info/forms-info.component';
import { WorkOrderInfoComponent } from './component/work-order-info/work-order-info.component';
import { UserInfoComponent } from './component/user-info/user-info.component';

@NgModule({
  declarations: [
    SliderContainerComponent,
    TaskInfoComponent,
    FormsInfoComponent,
    WorkOrderInfoComponent,
    UserInfoComponent
  ],
  imports: [
    CommonModule,
    ChartsModule,
   //NgChartsModule,
    IonicModule
  ],
  exports:[
    SliderContainerComponent
  ],
  entryComponents:[

  ]
})
export class SliderModule { }
