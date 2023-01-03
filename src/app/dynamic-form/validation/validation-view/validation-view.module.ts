import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ValidationComponent} from './components/validation/validation.component'

@NgModule({
  declarations: [ValidationComponent],
  imports: [
    CommonModule
  ],
  exports:[ValidationComponent]
})
export class ValidationViewModule { }
