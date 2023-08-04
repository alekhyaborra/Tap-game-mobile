import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TabsComponent} from './tabs.component'
import { IonicModule } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';




@NgModule({
  declarations: [TabsComponent],
  imports: [
    CommonModule,
    IonicModule,
    HttpClientModule 
  ],
  exports:[TabsComponent],
  entryComponents:[TabsComponent]
})


export class TabsModule { }
