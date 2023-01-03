import { NgModule } from '@angular/core';
import { CommonModule, LowerCasePipe , DatePipe} from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FormHeaderComponent } from './form-header/form-header.component';
import { IonicModule } from '@ionic/angular';
import { SlectedActionComponent } from './slected-action/slected-action.component';
import { InfoModalComponent } from './info-modal/info-modal.component';
import { DateAgoPipe } from '../pipes/date-ago.pipe';
import { HistoryListComponent } from './history-list/history-list.component'
import { FilterModalComponent } from './filter-modal/filter-modal.component';
import { EllipsePopoverComponent } from './ellipse-popover/ellipse-popover.component';
import { SearchComponent } from './header/search/search.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterComponent } from './filter/filter.component';
import { HeaderEllipseComponent } from './header-ellipse/header-ellipse.component';
import { NotificationComponent } from './notification/notification.component';
import { DataModalComponent } from '../map/data-modal/data-modal.component';
import { MarkerInfoComponent } from './marker-info/marker-info.component';
import { SketchingToolComponent } from './sketching-tool/sketching-tool.component';
import { GeometryFormComponent } from './geometry-form/geometry-form.component';
import { DynamicFormModule } from '../dynamic-form/dynamic-form.module';
import { MapMenuComponent } from './map-menu/map-menu.component';
import { AttachmentModalComponent } from './attachment-modal/attachment-modal.component';
import { HttpClientModule } from '@angular/common/http';
import { ShowHidePasswordComponent } from './show-hide-password/show-hide-password.component';
import { BookmarksComponent } from '../map/bookmarks/bookmarks.component';
import { BookmarkModelComponent } from '../map/bookmark-model/bookmark-model.component';
import { FindRouteComponent } from '../map/find-route/find-route.component';
import {AssetFormComponent} from './asset-form/asset-form/asset-form.component'
@NgModule({
  declarations: [
    HeaderComponent,
    SlectedActionComponent,
    FormHeaderComponent,
    InfoModalComponent,
    DateAgoPipe,
    HistoryListComponent,
    FilterModalComponent,
    EllipsePopoverComponent,
    FilterComponent,
    HeaderEllipseComponent,
    SearchComponent,
    FilterComponent,
    NotificationComponent,
    DataModalComponent,
    MarkerInfoComponent,
    SketchingToolComponent,
    GeometryFormComponent,
    MapMenuComponent,
    AttachmentModalComponent,
    ShowHidePasswordComponent,
    BookmarksComponent,
    BookmarkModelComponent,
    FindRouteComponent,
    AssetFormComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    DynamicFormModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  exports:[
    HeaderComponent,
    SlectedActionComponent,
    FormHeaderComponent,
    DateAgoPipe,
    FilterComponent,
    HeaderEllipseComponent,
    HistoryListComponent,
    SearchComponent,
    FilterComponent,
    NotificationComponent,
    DataModalComponent,
    MarkerInfoComponent,
    SketchingToolComponent,
    GeometryFormComponent,
    MapMenuComponent,
    ShowHidePasswordComponent,
    BookmarksComponent,
    BookmarkModelComponent,
    FindRouteComponent,
    AssetFormComponent
  ],
  providers:[LowerCasePipe, DatePipe],
  entryComponents:[
    InfoModalComponent,
    FilterModalComponent,
    EllipsePopoverComponent,
    DataModalComponent,
    MarkerInfoComponent,
    SketchingToolComponent,
    GeometryFormComponent,
    MapMenuComponent,
    AttachmentModalComponent,
    ShowHidePasswordComponent,
    BookmarksComponent,
    BookmarkModelComponent,
    FindRouteComponent,
    AssetFormComponent
  ]
})
export class SharedComponentModule { }
