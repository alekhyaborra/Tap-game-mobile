import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QueryService } from './query/query.service';
import { QueryProcessService } from './query-process/query-process.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  exports: [
  ],
  providers: [
    QueryService,
    QueryProcessService
  ]
})
export class OfflineModule { }
