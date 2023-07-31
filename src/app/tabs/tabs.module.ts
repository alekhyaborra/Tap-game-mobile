import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TabsComponent} from './tabs.component'
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [TabsComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports:[TabsComponent],
  entryComponents:[TabsComponent]
})
export class TabsModule { }
