import { Component, ViewContainerRef } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';

import { Field } from '../../models/field.interface';
import { FieldConfig } from '../../models/field-config.interface';
import { widgetKeys } from '../../object-keys-constants'
import { FormDataDistributionService } from '../../form-data-distribution.service'
import {CommonService} from '../../../sharedServices/commonServices/common.service'
@Component({
  selector: 'form-input',
  styleUrls: ['form-input.component.scss'],
  templateUrl: './form-input.component.html',
})
export class FormInputComponent implements Field {
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
  Fieldsearch:any;
  fieldSearchvalue:any;
  serachmatch:any
  isTable:boolean;
  constructor(private formDataDistributionService: FormDataDistributionService,private commonService: CommonService,) {
    this.widgetKey = widgetKeys.keys;
  }
  
  ngOnInit() {  
       let check = new RegExp(this.Fieldsearch);
       this.serachmatch = this.config[widgetKeys.keys.label].match(check)
    if(!this.derivedFields)
      this.derivedFields = [];
    this.formDataDistributionService.hederOpen.subscribe(expendedHeaderId => {
      this.expendedHeaderId = expendedHeaderId;
    });
    let getTypeList = this.formDataDistributionService.getTypeList();
    getTypeList[this.config[widgetKeys.keys._id]] = this.config[widgetKeys.keys.type];
    this.formDataDistributionService.setTypeList(getTypeList);
    
  }

  

  ngOnDestroy() {
    if (this.bOSubscribe) {
      this.bOSubscribe.unsubscribe();
    }
  }
}
