import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HowToPlayPageRoutingModule } from './how-to-play-routing.module';

import { HowToPlayPage } from './how-to-play.page';
import { TabsModule } from '../tabs/tabs.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HowToPlayPageRoutingModule,
    TabsModule
  ],
  declarations: [HowToPlayPage]
})
export class HowToPlayPageModule {}
