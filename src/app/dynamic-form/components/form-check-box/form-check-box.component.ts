import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';

import { Field } from '../../models/field.interface';
import { FieldConfig } from '../../models/field-config.interface';
import { widgetKeys } from '../../object-keys-constants'
import { FormDataDistributionService } from '../../form-data-distribution.service'
import { CommonService } from '../../../sharedServices/commonServices/common.service'
@Component({
  selector: 'app-form-check-box',
  templateUrl: './form-check-box.component.html',
  styleUrls: ['./form-check-box.component.scss'],
})
export class FormCheckBoxComponent implements Field, OnInit{
  config: FieldConfig;
  group: FormGroup;
  widgetKey: any;
  data : any;
  historyView:boolean;
  expendedHeaderId:any;
  derivedFields: any;
  derivedFieldsCopy: any;
  isDerivedField: boolean = false;
  bOSubscribe: any;
  tableWidgetId: any;
  tableWidgetIndex: any;
  isTable:boolean;
  constructor(
    private formDataDistributionService:FormDataDistributionService,
    private commonService : CommonService
     ) {
    this.widgetKey = widgetKeys.keys;
  }
  tableWidgetArray(tableWidgetId) {
    return this.group.get(tableWidgetId) as FormArray;
  }
  ngOnInit() {
    this.bOSubscribe = this.formDataDistributionService.hederOpen.subscribe(expendedHeaderId => {
      this.expendedHeaderId = expendedHeaderId;
      this.data[this.config[widgetKeys.keys._id]] = this.group.get(this.config[widgetKeys.keys._id]).value;
    });
    
    if(this.data[this.config[widgetKeys.keys._id]]){
      let selectedOption = this.data[this.config[widgetKeys.keys._id]].split(",");
      if(selectedOption != 'null'){
        selectedOption.forEach(option => {          
          this.showOrHideWidgets(this.config,option)
        });
      }        
    }
   }
  getSelectedCheckBoxValue(formcontrolNameRef: any, value: any) {
    if (this.group.get(formcontrolNameRef).value) {
      var list = this.group.get(formcontrolNameRef).value.split(',');
      if (list.indexOf(value) == -1) {
        let valuesStr = this.group.get(formcontrolNameRef).value + ',' + value;
        this.group.get(formcontrolNameRef).setValue(valuesStr);
        //this.data[formcontrolNameRef] = valuesStr;
      }
      else {
        list.splice(list.indexOf(value), 1);
        this.group.get(formcontrolNameRef).setValue(list.toString());
        //this.data[formcontrolNameRef] = list.toString();
      }

    }
    else {
      this.group.get(formcontrolNameRef).setValue(value);
      //this.data[formcontrolNameRef] = value;
    }
  }  

  ngOnDestroy() {
    if (this.bOSubscribe) {
      this.bOSubscribe.unsubscribe();
    }
  }

  selectValueChanged() {
    let selectedOption = this.group.get(this.config[widgetKeys.keys._id]).value.split(',');
    this.hideWidgets();
    selectedOption.forEach(option => {
      this.showOrHideWidgets(this.config, option)
    });
  }

  hideWidgets() {
    let getTypeList = this.formDataDistributionService.getTypeList();
    this.config.options.forEach(value => {
      for (var index in value['dependFields']) {
        if (index == widgetKeys.dependFields.Hide || index == widgetKeys.dependFields.Show || index == widgetKeys.dependFields.Readonly) {
          value['dependFields'][index].forEach(element => {
            const derivedFieldIndex = this.derivedFields.indexOf(element[widgetKeys.keys._id]);
            if (derivedFieldIndex == -1) {
              this.derivedFields.push(element[widgetKeys.keys._id]);
              if (element[widgetKeys.keys._id] == this.expendedHeaderId ){
                this.formDataDistributionService.headerOpend("");
              }
              if(getTypeList[element[widgetKeys.keys._id]] == widgetKeys.fieldTypes.table){
                for(let i=1;i<this.group.get(this.config[widgetKeys.keys._id]).value.length;i++){
                  this.tableWidgetArray(element[widgetKeys.keys._id]).removeAt(i)
                }
              }
              else
                this.group.get(element[widgetKeys.keys._id]).reset();
            }
          });
        }
      }
    });
  }

  showOrHideWidgets(config,selectedValue){
    let selectedOptionIndex = config.options.findIndex(record => record.value == selectedValue); 
    if(selectedOptionIndex == -1){
      return;
    }   
    let dependFields = config.options[selectedOptionIndex][widgetKeys.dependFields.dependFields];
    if (dependFields) {
      let getTypeList = this.formDataDistributionService.getTypeList();
      for (var index in dependFields) {       
        if (index == widgetKeys.dependFields.Show || index == widgetKeys.dependFields.Readonly) {
          dependFields[index].forEach(element => {
            const derivedFieldIndex = this.derivedFields.indexOf(element[widgetKeys.keys._id]);
            if(derivedFieldIndex > -1){
              this.derivedFields.splice(derivedFieldIndex, 1);             
              if(getTypeList[element[widgetKeys.keys._id]] == widgetKeys.fieldTypes.rating){
                this.group.get(element[widgetKeys.keys._id]).setValue(this.data[element[widgetKeys.keys._id]] ? this.data[element[widgetKeys.keys._id]] : 1);
              }
              else if (this.data && this.data.length > 0) {               
                this.group.get(element[widgetKeys.keys._id]).setValue(this.data[element[widgetKeys.keys._id]]);
              }
              if (index == widgetKeys.dependFields.Readonly){
                if(element[widgetKeys.keys.type] == widgetKeys.fieldTypes.heading){
                  let readOnlyFieldsForHeader = this.commonService.getHeaderFieldsbyHeaderId(element[widgetKeys.keys._id]);
                  readOnlyFieldsForHeader.forEach((headerFeild)=>{
                    this.group.get(headerFeild[widgetKeys.keys._id]).disable();
                  })
                }
                this.group.get(element[widgetKeys.keys._id]).disable();
              }
            }
          });
        }
        else if (index == widgetKeys.dependFields.Hide) {
          dependFields[index].forEach(element => {
            const derivedFieldIndex = this.derivedFields.indexOf(element[widgetKeys.keys._id]);
            if(derivedFieldIndex == -1){
              this.derivedFields.push(element[widgetKeys.keys._id]);
              if (element[widgetKeys.keys._id] == this.expendedHeaderId ){
                this.formDataDistributionService.headerOpend("");
              }
              if(getTypeList[element[widgetKeys.keys._id]] == widgetKeys.fieldTypes.table){
                for(let i=1;i<this.group.get(this.config[widgetKeys.keys._id]).value.length;i++){
                  this.tableWidgetArray(element[widgetKeys.keys._id]).removeAt(i)
                }
              }
              this.group.get(element[widgetKeys.keys._id]).reset();
            }
          });
        }
      }
    }
  }
}
