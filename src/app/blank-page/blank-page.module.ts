import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BlankPagePageRoutingModule } from './blank-page-routing.module';

import { BlankPagePage } from './blank-page.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BlankPagePageRoutingModule
  ],
  declarations: [BlankPagePage]
})
export class BlankPagePageModule {}
