import { Component, OnInit } from '@angular/core';
import { Field } from '../../models/field.interface';
import { FieldConfig } from '../../models/field-config.interface';
import { FormGroup, FormArray } from '@angular/forms';
import { widgetKeys } from '../../object-keys-constants'
import { FormDataDistributionService} from '../../form-data-distribution.service'
import { CommonService } from '../../../sharedServices/commonServices/common.service';

@Component({
  selector: 'app-form-header',
  templateUrl: './form-heading.component.html',
  styleUrls: ['./form-heading.component.scss'],
})
export class FormHeaderComponent implements OnInit,Field{

  config: FieldConfig;
  group: FormGroup;
  widgetKey: any;
  openGroupId: any;
  expendedHeaderId: any;
  derivedFields: any;
  derivedFieldsCopy: any;
  data: any;
  isTable: boolean;
 constructor(
  private formDataDistributionService:FormDataDistributionService,
  private commonService : CommonService       
  ){
  this.widgetKey = widgetKeys.keys;
 }

 ngOnInit() {
     
  this.formDataDistributionService.hederOpen.subscribe(expendedHeaderId => {
    this.expendedHeaderId = expendedHeaderId;
  });
  this.commonService.setAllFieldsForTable(this.group);
  if(this.data[this.config[widgetKeys.keys._id]]){
    this.selectValueChanged(this.config)
  }

 }

 selectValueChanged(config) {
  let selectedValue = this.group.get(this.config[widgetKeys.keys._id]).value;
  let selectedOptionIndex = config.options.findIndex(record => record.value == selectedValue);    
  if(selectedOptionIndex == -1)
    return;
  this.hideWidgets();
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
              this.group.get(element[widgetKeys.keys._id]).disable();
            }else {
              this.group.get(element[widgetKeys.keys._id]).enable();
            }
          }
        });
      }
      else if (index == widgetKeys.dependFields.Hide) {
        dependFields[index].forEach(element => {
          const derivedFieldIndex = this.derivedFields.indexOf(element[widgetKeys.keys._id]);
          if(derivedFieldIndex == -1){
            this.derivedFields.push(element[widgetKeys.keys._id]);
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

hideWidgets(){
  let getTypeList = this.formDataDistributionService.getTypeList();
  this.config.options.forEach(value => {
    for (var index in value['dependFields']) {
      if (index == widgetKeys.dependFields.Hide || index == widgetKeys.dependFields.Show || index == widgetKeys.dependFields.Readonly) {
        value['dependFields'][index].forEach(element => {
          const derivedFieldIndex = this.derivedFields.indexOf(element[widgetKeys.keys._id]);
          if(derivedFieldIndex == -1){
            this.derivedFields.push(element[widgetKeys.keys._id]);
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

tableWidgetArray(tableWidgetId) {
  return this.group.get(tableWidgetId) as FormArray;
}

  expendingWidgets(widget){
    if(this.expendedHeaderId== widget[this.widgetKey._id])
      this.formDataDistributionService.headerOpend("");
    else
      this.formDataDistributionService.headerOpend(widget[this.widgetKey._id]);
  }

  ngOnDestroy() {
    this.formDataDistributionService.headerOpend("");
  }

}
