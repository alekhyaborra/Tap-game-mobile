import { Component, OnInit } from '@angular/core';
import { Field } from '../../models/field.interface';
import { FieldConfig } from '../../models/field-config.interface';
import { FormGroup, FormArray } from '@angular/forms';
import { widgetKeys } from '../../object-keys-constants'
import { FormDataDistributionService } from '../../form-data-distribution.service';
import { ApiUrls } from '../../../constants/api-urls';
import { FormsService } from '../../../forms/forms.service';
import { CommonService } from 'src/app/sharedServices/commonServices/common.service';

@Component({
  selector: 'form-drop-down',
  templateUrl: './form-drop-down.component.html',
  styleUrls: ['./form-drop-down.component.scss'],
})
export class FormDropDownComponent implements Field, OnInit {
  config: FieldConfig;
  group: FormGroup;
  widgetKey: any;
  expendedHeaderId: any;
  historyView: boolean;
  selectedValues: any;
  derivedFields: any;
  derivedFieldsCopy: any;
  data: any;
  isDerivedField: boolean = false;
  bOSubscribe: any;
  tableWidgetId: any;
  tableWidgetIndex: any;
  isTable: boolean;
  isDynamicDropDownCallFail = true;
  optionsDerived = [];
  selectedDropdownValue: string;
  constructor(private formDataDistributionService: FormDataDistributionService, 
    private formsService: FormsService,
    private commonService: CommonService) {
    this.widgetKey = widgetKeys.keys;
  }

  tableWidgetArray(tableWidgetId) {
    return this.group.get(tableWidgetId) as FormArray;
  }
  ngOnInit() {
    // console.log("dropdownConfig",this.config.options);
    if (this.historyView) {
      if (typeof this.group.get(this.config[this.widgetKey._id]).value === 'string') {
        this.selectedValues = this.group.get(this.config[this.widgetKey._id]).value.replace('[', '').replace(']', '').split(',');
      } else {
        this.selectedValues = this.group.get(this.config[this.widgetKey._id]).value;
      }
    }
    this.bOSubscribe = this.formDataDistributionService.hederOpen.subscribe(expendedHeaderId => {
      this.expendedHeaderId = expendedHeaderId;
    });

    this.optionsDerived = this.config[this.widgetKey.options];



    // this.dynamicDropDownOptionSetter();
    this.dropwDownDerviedSetter();

    if(this.group.get(this.config[this.widgetKey._id]).value){
      let selectedOption = this.group.get(this.config[this.widgetKey._id]).value
      if (typeof selectedOption == widgetKeys.dataTypes.object) {
        this.hideWidgets(selectedOption);
        selectedOption.forEach(option => {
          this.showOrHideWidgets(this.config,option)
        });
      }    
      else
        this.showOrHideWidgets(this.config,selectedOption)  
    }
    // if (this.config[this.widgetKey.dropdownType] === 'static') {
    //   this.dropwDownDerviedSetter();
    // } else {
    //   this.dynamicDropDownOptionSetter();
    // }

  }

  dynamicDropDownOptionSetter() {
      const checkUrl =  ApiUrls.dynamicDropDwon + '/'
                       + this.config[this.widgetKey.dynamicDropdownTable] + '/' +
                       this.config[this.widgetKey.columnName];
      this.formsService.getDropDwonvalues(checkUrl)
        .subscribe(res => {
          this.isDynamicDropDownCallFail = false;
          const obj = res['data'].map ((item) => {
            const emptyObj = {};
            emptyObj['displayValue'] = item ;
            emptyObj['value'] = item ;
            const deptFields = this.optionsDerived.filter(value => value.displayValue.toLowerCase() === item.toLowerCase())
            .map(val => val.dependFields);

            // const deptFields = this.optionsDerived.filter(value => value.displayValue === item).map(val => val.dependFields);
            emptyObj['dependFields'] = deptFields[0];
            return emptyObj;
          });
          this.config[this.widgetKey.options] = obj;
          this.dropwDownDerviedSetter();
        }, error => {
          this.isDynamicDropDownCallFail = true;
        });
  }

  dropwDownDerviedSetter() {
    if (this.data[this.config[widgetKeys.keys._id]]) {
      if (this.data[this.config[widgetKeys.keys._id]].indexOf('[') !== -1) {
        const selectedOption = this.data[this.config[widgetKeys.keys._id]].replace('[', '').replace(']', '').split(',');
        this.hideWidgets(selectedOption);
        selectedOption.forEach(option => {
          this.showOrHideWidgets(this.config, option.trim());
        });
      } else if (typeof this.data[this.config[widgetKeys.keys._id]] === widgetKeys.dataTypes.object){
        this.hideWidgets(this.data[this.config[widgetKeys.keys._id]]);
        this.data[this.config[widgetKeys.keys._id]].forEach(option => {
          this.showOrHideWidgets(this.config, option);
        });
      } else {
        if (this.data[this.config[widgetKeys.keys._id]].indexOf(',') !== -1) {
          this.group.get(this.config[widgetKeys.keys._id]).setValue(this.data[this.config[widgetKeys.keys._id]].split(','));
          this.group.get(this.config[widgetKeys.keys._id]).value.forEach(option => {
            this.showOrHideWidgets(this.config, option);
          });
        } else {
          this.showOrHideWidgets(this.config, this.data[this.config[widgetKeys.keys._id]]);
        }
      }
    }
  }

  selectValueChanged(event, config) {
    let selectedOption = event.detail.value;
    console.log(this.group.get(this.config[widgetKeys.keys._id]).value);
    if (typeof selectedOption == widgetKeys.dataTypes.object) {
      this.hideWidgets(selectedOption);
      selectedOption.forEach(option => {
        this.showOrHideWidgets(config,option)
      });
    }    
    else
      this.showOrHideWidgets(config,event.detail.value)  
  }

  onCancelClick (event) {
    this.selectValueChanged(event,this.config)
  }

  hideWidgets(selectedOption){
    let getTypeList = this.formDataDistributionService.getTypeList();
    this.config.options.forEach(value => {
      for (var index in value['dependFields']) {
        if (index == widgetKeys.dependFields.Hide || index == widgetKeys.dependFields.Show) {
          value['dependFields'][index].forEach(element => {
            const derivedFieldIndex = this.derivedFields.indexOf(element[widgetKeys.keys._id]);
            if(derivedFieldIndex == -1){
              this.derivedFields.push(element[widgetKeys.keys._id]);
              if (element[widgetKeys.keys._id] == this.expendedHeaderId ){
                this.formDataDistributionService.headerOpend("");
              }
              console.log(getTypeList[element[widgetKeys.keys._id]]);
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

  showOrHideWidgets(config, selectedValue) {
    let selectedOptionIndex = config.options.findIndex(record => record.value === selectedValue);
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
              // else {
              //   this.group.get(element[widgetKeys.keys._id]).enable();
              // }
            }
          });
        }
        else if (index == widgetKeys.dependFields.Hide) {
          dependFields[index].forEach(element => {
            const derivedFieldIndex = this.derivedFields.indexOf(element[widgetKeys.keys._id]);
            if (derivedFieldIndex == -1) {
              this.derivedFields.push(element[widgetKeys.keys._id]);
              if (element[widgetKeys.keys._id] == this.expendedHeaderId ){
                this.formDataDistributionService.headerOpend("");
              }
              console.log(getTypeList[element[widgetKeys.keys._id]]);
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

  ngOnDestroy() {
    if (this.bOSubscribe) {
      this.bOSubscribe.unsubscribe();
    }
  }
}
