import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RewardsPageRoutingModule } from './rewards-routing.module';

import { RewardsPage } from './rewards.page';
import { ModalComponent } from './modal/modal.component';
import { TabsModule } from '../tabs/tabs.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RewardsPageRoutingModule,
    TabsModule
  ],
  declarations: [RewardsPage, ModalComponent]
})
export class RewardsPageModule {}
