import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BlankPagePage } from './blank-page.page';

const routes: Routes = [
  {
    path: '',
    component: BlankPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BlankPagePageRoutingModule {}
