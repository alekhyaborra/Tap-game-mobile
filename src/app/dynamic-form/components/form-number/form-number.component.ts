import { Component, OnInit, NgZone } from '@angular/core';
import { FieldConfig } from '../../models/field-config.interface';
import { FormGroup } from '@angular/forms';
import { FormDataDistributionService } from '../../form-data-distribution.service';
import { widgetKeys } from '../../object-keys-constants';

@Component({
  selector: 'app-form-number',
  templateUrl: './form-number.component.html',
  styleUrls: ['./form-number.component.scss'],
})
export class FormNumberComponent implements OnInit {
  config: FieldConfig;
  group: FormGroup;
  widgetKey: any;
  groupName: any;
  expendedHeaderId: any;
  derivedFields: any;
  derivedFieldsCopy: any;
  isDerivedField: boolean = false;
  bOSubscribe: any;
  data: any;
  tableWidgetId: any;
  tableWidgetIndex: any;
   maxEq = 5;
  minEq = 2;
  minPattern: any = '(^[0-9]*)(\\.([0-9]{';
  decimalLimitPattern: any;
  value: any;
   isTable:boolean;
  constructor(private formDataDistributionService:FormDataDistributionService,
  private ngZone: NgZone){
    this.widgetKey = widgetKeys.keys;
  }
  specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', '-'];
  pattern = /[0-9]/;
  ngOnInit() {
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
