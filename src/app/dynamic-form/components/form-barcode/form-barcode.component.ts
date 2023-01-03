import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { FormGroup, FormArray } from '@angular/forms';
import { FieldConfig } from '../../models/field-config.interface';
import { widgetKeys } from '../../object-keys-constants'
import { FormDataDistributionService } from '../../form-data-distribution.service'
import { ToastService } from '../../../sharedServices/toast.service';
import { FormModuleconstants } from '../../form-module-constants';

@Component({
  selector: 'form-barcode',
  templateUrl: './form-barcode.component.html',
  styleUrls: ['./form-barcode.component.scss'],
})
export class FormBarcodeComponent implements OnInit {
  config: FieldConfig;
  group: FormGroup;
  barcode:any;
  historyView:boolean
  widgetKey: any;
  expendedHeaderId: any;
  derivedFields: any;
  derivedFieldsCopy: any;
  isDerivedField: boolean = false;
  bOSubscribe: any;
  data: any;
  tableWidgetId: any;
  tableWidgetIndex: any;
  isTable:boolean;
  
  constructor(private toastService: ToastService, 
              private barcodeScanner: BarcodeScanner,
              private formDataDistributionService:FormDataDistributionService){
    this.widgetKey = widgetKeys.keys;
   }
   captureBarcodeCheck(event){
    if(!this.historyView){
      this.captureBarcode(event)
    }
   }
  captureBarcode(formcontrolNameRef:any){
    this.barcodeScanner.scan().then(barcodeData => {
      this.barcode=barcodeData.text;
      this.group.get(formcontrolNameRef).setValue(barcodeData.text);
     }).catch(err => {
      this.toastService.showToast(FormModuleconstants.barcodeFail);
     });
  }

  get tableWidgetArray() {
    return this.group.get(this.tableWidgetId) as FormArray;
  }

  ngOnInit() {
    let brValue = this.group.get(this.config[widgetKeys.keys._id]).value ? this.group.get(this.config[widgetKeys.keys._id]).value : '';
    this.group.get(this.config[widgetKeys.keys._id]).setValue(brValue);
    this.bOSubscribe = this.formDataDistributionService.hederOpen.subscribe(expendedHeaderId => {
      this.expendedHeaderId = expendedHeaderId;
    });
   }

   ngOnDestroy() {
    if (this.bOSubscribe) {
      this.bOSubscribe.unsubscribe();
    }
  }
}
