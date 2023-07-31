import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';
// import {TabsComponent} from '../tabs/tabs.component'

import { HomePage } from './home.page';
import { TabsModule } from '../tabs/tabs.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    TabsModule
  ],
  declarations: [HomePage],
  providers: [DatePipe],
  entryComponents: [],
})
export class HomePageModule {}
