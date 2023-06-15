import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SigninPageRoutingModule } from './signin-routing.module';
import {ShowHidePasswordPageModule} from '../show-hide-password/show-hide-password.module'

import { SigninPage } from './signin.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SigninPageRoutingModule,
    ShowHidePasswordPageModule
  ],
  declarations: [SigninPage],
  // entryComponents:[ShowHidePasswordComponent]
})
export class SigninPageModule {}
