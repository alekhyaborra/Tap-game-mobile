import { FormReferenceListComponent } from './components/form-reference-list/form-reference-list.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';


import { DynamicFieldDirective } from './components/dynamic-field/dynamic-field.directive';
import { DynamicFormComponent } from './containers/dynamic-form/dynamic-form.component';
import { FormInputComponent } from './components/form-input/form-input.component';
import {FormCheckBoxComponent} from './components/form-check-box/form-check-box.component';
import {FormTextAreaComponent} from './components/form-text-area/form-text-area.component';
import {FormDropDownComponent} from './components/form-drop-down/form-drop-down.component';
import { FormCameraComponent } from './components/form-camera/form-camera.component';
import { FormBarcodeComponent } from './components/form-barcode/form-barcode.component';
import { FormSignatureComponent } from './components/form-signature/form-signature.component';
import { ImageViewerModalComponent } from './components/image-viewer-modal/image-viewer-modal.component';
import { SignatureViewModalComponent} from './components/form-signature/signature-view-modal/signature-view-modal.component';
import {FormRadioButtonComponent} from './components/form-radio-button/form-radio-button.component';
import { FormHeaderComponent } from './components/form-heading/form-heading.component';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { FormRatingComponent } from './components/form-rating/form-rating.component';
import { ValidationViewModule } from '../dynamic-form/validation/validation-view/validation-view.module';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { FormDataDistributionService} from './form-data-distribution.service';
import { FormHeadingBreakComponent} from './components/form-heading-break/form-heading-break.component';
import { FormNumberComponent } from './components/form-number/form-number.component';
import { RestrictDirective } from './directives/restrict.directive';
import { FormDatepickerComponent } from './components/form-datepicker/form-datepicker.component';
import { FormMapComponent } from './components/form-map/form-map.component';
//import { DatePicker } from '@ionic-native/date-picker/ngx';
import { FormCalculationComponent } from './components/form-calculation/form-calculation.component';
import { FormDropdownHistoryComponent } from './components/form-dropdown-history/form-dropdown-history.component';
import { FormVideoComponent } from './components/form-video/form-video.component'
import { MediaCapture} from '@awesome-cordova-plugins/media-capture/ngx';
import { StreamingMedia } from '@awesome-cordova-plugins/streaming-media/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';
 import {CanvasWhiteboardModule} from 'ng2-canvas-whiteboard';
import { TableModalComponent } from './components/form-table/table-modal/table-modal.component';

import { FormDrawingComponent } from './components/form-drawing/form-drawing.component';
import { FormTableComponent } from './components/form-table/form-table.component';
import { FormTimeWidgetComponent } from './components/form-time-widget/form-time-widget.component';
import { FormUserPropertiesComponent } from './components/form-user-properties/form-user-properties.component';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { Keyboard } from '@awesome-cordova-plugins/keyboard/ngx';
import { DecimalRestrictDirective } from './directives/decimal-restrict.directive';
@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    ValidationViewModule,
    NgCircleProgressModule.forRoot(),
    CanvasWhiteboardModule
  ],
  declarations: [
    DynamicFieldDirective,
    DynamicFormComponent,
    FormInputComponent,
    FormCheckBoxComponent,
    FormTextAreaComponent,
    FormDropDownComponent,
    FormCameraComponent,
    FormBarcodeComponent,
    FormSignatureComponent,
    ImageViewerModalComponent,
    SignatureViewModalComponent,
    FormRadioButtonComponent,
    FormRatingComponent,
    FormHeaderComponent,
    FormHeadingBreakComponent,
    FormNumberComponent,
    RestrictDirective,
    FormMapComponent,
    FormDatepickerComponent,
    FormCalculationComponent,
    FormDropdownHistoryComponent,
    FormVideoComponent,
    FormDrawingComponent,
    FormTableComponent,
    TableModalComponent,
    FormTimeWidgetComponent,
    FormUserPropertiesComponent,
    FormReferenceListComponent,
    DecimalRestrictDirective,
  ],
  exports: [
    DynamicFormComponent
  ],
  entryComponents: [
    FormInputComponent,
    FormCheckBoxComponent,
    FormTextAreaComponent,
    FormDropDownComponent,
    FormCameraComponent,
    FormBarcodeComponent,
    FormSignatureComponent,
    ImageViewerModalComponent,
    SignatureViewModalComponent,
    FormRadioButtonComponent,
    FormRatingComponent,
    FormHeaderComponent,
    FormHeadingBreakComponent,
    FormNumberComponent,
    FormMapComponent,
    FormDatepickerComponent,
    FormCalculationComponent,
    FormDropdownHistoryComponent,
    FormVideoComponent,
    FormDrawingComponent,
    FormTableComponent,
    TableModalComponent,
    FormTimeWidgetComponent,
    FormUserPropertiesComponent,
    FormReferenceListComponent,
  ],
  providers: [
    BarcodeScanner,
    FormDataDistributionService,
    //DatePicker,
MediaCapture,
    StreamingMedia,
    File,
    Camera,
    Keyboard
  ]
})
export class DynamicFormModule {}
