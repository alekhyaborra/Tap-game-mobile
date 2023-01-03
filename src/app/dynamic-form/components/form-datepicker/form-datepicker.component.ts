import { Component, OnInit } from '@angular/core';
import { FieldConfig } from '../../models/field-config.interface';
import { FormGroup, FormArray } from '@angular/forms';
import { FormDataDistributionService } from '../../form-data-distribution.service';
import { widgetKeys } from '../../object-keys-constants';
import { FormModuleconstants } from '../../form-module-constants';

@Component({
  selector: 'app-form-datepicker',
  templateUrl: './form-datepicker.component.html',
  styleUrls: ['./form-datepicker.component.scss'],
})
export class FormDatepickerComponent implements OnInit {
  config: FieldConfig;
  group: FormGroup;
  widgetKey: any;
  groupName: any;
  expendedHeaderId: any;
  disabled: boolean = true;
  derivedFields: any;
  derivedFieldsCopy: any;
  isDerivedField: boolean = false;
  bOSubscribe: any;
  data: any;
  tableWidgetId: any;
  tableWidgetIndex: any;
  isTable: boolean;
  historyView: boolean;
  constructor(
    private formDataDistributionService: FormDataDistributionService,
  ) {
    this.widgetKey = widgetKeys.keys;
  }

  get tableWidgetArray() {
    return this.group.get(this.tableWidgetId) as FormArray;
  }
  ngOnInit() {
    let dateValue = this.group.get(this.config[widgetKeys.keys._id]).value ? this.group.get(this.config[widgetKeys.keys._id]).value : '';
    this.group.get(this.config[widgetKeys.keys._id]).setValue(dateValue);
    this.bOSubscribe = this.formDataDistributionService.hederOpen.subscribe(expendedHeaderId => {
      this.expendedHeaderId = expendedHeaderId;
    });
    if (this.config[this.widgetKey.dateType] === FormModuleconstants.systemDate) {
      this.group.get(this.config[this.widgetKey._id]).setValue(new Date());
    }
    
  }

  openDatePicker(formcontrolNameRef: any,event) {
    console.log(event);
    if (!this.historyView) {
           this.group.get(formcontrolNameRef).setValue(event.detail.value);
    }
  }
  ngOnDestroy() {
    if (this.bOSubscribe) {
      this.bOSubscribe.unsubscribe();
    }
  }
}
