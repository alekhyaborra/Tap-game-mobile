import { Component, OnInit, OnDestroy } from '@angular/core';
import { Field } from '../../models/field.interface';
import { FieldConfig } from '../../models/field-config.interface';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { widgetKeys } from '../../object-keys-constants';
import { FormDataDistributionService } from '../../form-data-distribution.service';
import { ApiUrls } from '../../../constants/api-urls';
import { FormsService } from '../../../forms/forms.service';
import {  DownloadService } from '../../../sharedServices/download.service';
import { CommonService } from '../../../sharedServices/commonServices/common.service';
import { Constants } from '../../../constants/constants';
import { QueryService } from '../../../offline/query/query.service';

@Component({
  selector: 'app-form-reference-list',
  templateUrl: './form-reference-list.component.html',
  styleUrls: ['./form-reference-list.component.scss'],
})
export class FormReferenceListComponent implements OnInit, OnDestroy {

  config: FieldConfig;
  group: FormGroup;
  widgetKey: any;
  expendedHeaderId: any;
  formFields: any;
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
  lookUpTableData: Array<any> = [];
  lookUpTableColumn: Array<string> = [];
  // allDerivedCondition: Array<any> = [];
  mainColumnName: any;
  dependentColumnName: Array<any> = [];
  dependencyCondition: any;
  offset: number = 1;
  limit: number = Constants.referenceListOptionsLimit;
  searchText: any;
  backupValues:any;
  isLookupReady: boolean = false;
  lookUpData: any = null;
  constructor(
    private formDataDistributionService: FormDataDistributionService,
    private formsService: FormsService,
    private downloadService: DownloadService,
    private commonService: CommonService,
    private queryService: QueryService,
    private fb: FormBuilder
  ) {
    this.widgetKey = widgetKeys.keys;
  }

  tableWidgetArray(tableWidgetId) {
    return this.group.get(tableWidgetId) as FormArray;
  }
  ngOnInit() {
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
    if(this.group.get(this.config[this.widgetKey._id]).value && this.config[widgetKeys.keys.isAllowMultiselection] && typeof this.group.get(this.config[this.widgetKey._id]).value === 'string')
      this.group.get(this.config[this.widgetKey._id]).setValue(this.group.get(this.config[this.widgetKey._id]).value.split(','))
    if(this.config[widgetKeys.keys.isAllowMultiselection])
      this.backupValues = [];
    else
      this.backupValues = "";
    this.optionsDerived = this.config[this.widgetKey.options];
    this.lookupTableSetUp();
    // this.dependencyConditions();
    this.dynamicDropDownOptionSetter();
  }

  dynamicDropDownOptionSetter() {
    this.downloadService.getRefList(this.config[this.widgetKey.dynamicDropdownTable], this.config[this.widgetKey.columnName], this.limit, this.offset)
      .then((data) => {
        console.log(data.data);
        if (data.status == 1) {
          this.setRefListOpt(data.data);
        }
        else {
          let refData = this.commonService.getRefList();
          if (refData.length) {
            let that = this;
            let index = refData.find( ref => ref[that.config[that.widgetKey.dynamicDropdownTable]])             
            this.setRefListOpt(index[this.config[this.widgetKey.dynamicDropdownTable]][this.config[this.widgetKey.columnName]]);
          }
          else
            this.isDynamicDropDownCallFail = true;
        }
      })
      .catch(e => {
        this.isDynamicDropDownCallFail = true;
      });      
      //   });        
  }

  setRefListOpt(refData) {
    this.isDynamicDropDownCallFail = false;
    const obj = refData.map((item) => {
      const emptyObj = {};
      emptyObj['displayValue'] = item;
      emptyObj['value'] = item;
      const deptFields = this.optionsDerived.filter((value: any) => value.displayValue.toLowerCase() === item.toLowerCase())
        .map((val: any) => val.dependFields);
      emptyObj['dependFields'] = deptFields[0];
      return emptyObj;
    });
    this.config[this.widgetKey.options] = obj;
    this.dropwDownDerviedSetter();
  }

  lookupTableSetUp() {
   this.lookUpData = this.queryService.lookupDataReady.subscribe((res) => {
    console.log("Lookupdata",res)
      this.isLookupReady = res;
      if(res){
      this.downloadService.getLookUpTable(this.config[this.widgetKey.dynamicDropdownTable], this.config[this.widgetKey.columnName])
        .then((data) => {
          // console.log("LookUpData", )
          if (data.data) {
            console.log("Lookup table data from local DB : ", data.data);
            this.lookUpTableData = data.data;
            for (let key in this.lookUpTableData[0]) {
              this.lookUpTableColumn.push(key);
            }
            this.dependencyConditions();
          }
        })
        .catch(e => {
        });
      }
      else {
    
      }
    }) 
  }

  dependencyConditions() {
    if (this.dependencyCondition) {
      this.mainColumnName = this.config[widgetKeys.keys.columnName];
      this.dependentColumnName = this.dependencyCondition.dependants;
      if (this.group.get(this.config[widgetKeys.keys._id]).value)
        this.lookupFunction(this.group.get(this.config[widgetKeys.keys._id]).value, true, null, null);
    }
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
    let selectedOption = event;
    if(event.detail && event.detail.value) {
      selectedOption = event.detail.value;
    }
    // console.log("selectedOption",selectedOption);
    // console.log("group",this.group.get(config[this.widgetKey._id]));
    // this.lookupFunction(selectedOption, false);
    if (typeof selectedOption == widgetKeys.dataTypes.object) {
      this.hideWidgets(selectedOption);
      selectedOption.forEach(option => {
        this.showOrHideWidgets(config,option)
      });
    }    
    else
      this.showOrHideWidgets(config, selectedOption)
  }

  optionChange(changeType, event) {
    this.lookupFunction(this.group.get(this.config[widgetKeys.keys._id]).value,false,changeType, event);
  }

  hideWidgets(selectedOption){
    let getTypeList = this.formDataDistributionService.getTypeList();
    this.config.options.forEach(value => {
      for (var index in value['dependFields']) {
        if (index == widgetKeys.dependFields.Hide || index == widgetKeys.dependFields.Show || index == widgetKeys.dependFields.Readonly) {
          value['dependFields'][index].forEach(element => {
            const derivedFieldIndex = this.derivedFields.indexOf(element[widgetKeys.keys._id]);
            if(derivedFieldIndex == -1){
              this.derivedFields.push(element[widgetKeys.keys._id]);
              if (getTypeList[element[widgetKeys.keys._id]] == widgetKeys.fieldTypes.table) {
                for (let i = 1; i < this.group.get(this.config[widgetKeys.keys._id]).value.length; i++) {
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
              if (getTypeList[element[widgetKeys.keys._id]] == widgetKeys.fieldTypes.table) {
                for (let i = 1; i < this.group.get(this.config[widgetKeys.keys._id]).value.length; i++) {
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
    if(this.lookUpData) {
      // console.log("testing lookup subscription");
      this.lookUpData.unsubscribe();
    }
  }

  lookupFunction(selectedOption, isInitialValue, changeType, event) {
    if(isInitialValue) {
      this.backupValues = selectedOption;
      let filteredLookupData;
      if (typeof selectedOption == "string")
        filteredLookupData = this.lookUpTableData.filter(x => x[this.mainColumnName] == selectedOption);
      else
        filteredLookupData = this.lookUpTableData.filter(x => selectedOption.includes(x[this.mainColumnName]));
      this.dependentColumnName.forEach(column => {
        const dependentWidget = this.formFields.find(x => x.id == column);
        if (dependentWidget) {
          this.getDependentWidgetForLookup(filteredLookupData, dependentWidget, selectedOption, isInitialValue, changeType, event, null);
        }
      })
    } else {
      console.log("changeType",changeType);
      console.log("event",event);
      console.log("this.group.get(this.config[widgetKeys.keys._id]).value",this.group.get(this.config[widgetKeys.keys._id]).value);
      let filteredLookupData;
      let removedIndex;
      switch(changeType) {
        case 'add': {
          if(this.config[widgetKeys.keys.isAllowMultiselection])
            this.backupValues.push(event);
          else 
            this.backupValues = event;
          break;
        }
        case 'remove': {
          if(this.config[widgetKeys.keys.isAllowMultiselection]){
            removedIndex = this.backupValues.findIndex(x=>x==event.value);
            this.backupValues = this.group.get(this.config[widgetKeys.keys._id]).value;
          } else 
            removedIndex = 0;
            this.backupValues = "";
          break;
        }
        case 'clear': {
          if(this.config[widgetKeys.keys.isAllowMultiselection])
            this.backupValues = [];
          else 
            this.backupValues = "";
          break;
        }
      }
      console.log("backupValues",this.backupValues);
      console.log("removedIndex",removedIndex);
      if (typeof this.backupValues == "string")
        filteredLookupData = this.lookUpTableData.filter(x => x[this.mainColumnName] == this.backupValues);
      else
        filteredLookupData = this.lookUpTableData.filter(x => this.backupValues.includes(x[this.mainColumnName]));
      this.dependentColumnName.forEach(column => {
        const dependentWidget = this.formFields.find(x => x.id == column);
        if (dependentWidget) {
          this.getDependentWidgetForLookup(filteredLookupData, dependentWidget, this.backupValues, isInitialValue, changeType, event, removedIndex);
        }
      })
    }
  }

  getDependentWidgetForLookup(filteredLookupData, dependentWidget, selectedOption, isInitialValue, changeType, event, removedIndex) {
    const values = filteredLookupData.map(x => x[dependentWidget[widgetKeys.keys.columnName]]);
    switch (dependentWidget[widgetKeys.keys.type]) {
      case widgetKeys.fieldTypes.textbox: {
        if (!isInitialValue)
          this.setLookupTextValues(dependentWidget, values);
        break;
      }
      case widgetKeys.fieldTypes.number: {
        if (!isInitialValue)
          this.setLookupTextValues(dependentWidget, values);
        break;
      }
      case widgetKeys.fieldTypes.textarea: {
        if (!isInitialValue)
          this.setLookupTextValues(dependentWidget, values);
        break;
      }
      case widgetKeys.fieldTypes.radio: {
        this.setLookupOptions(dependentWidget, values);
        break;
      }
      case widgetKeys.fieldTypes.select: {
        this.setLookupOptions(dependentWidget, values);
        break;
      }
      case widgetKeys.fieldTypes.checkbox: {
        this.setLookupOptions(dependentWidget, values);
        break;
      }
      case widgetKeys.fieldTypes.heading: {
        if (dependentWidget[widgetKeys.keys.isTable]) {
          if(!isInitialValue && selectedOption.length==1)
            while (this.tableWidgetArray(dependentWidget[widgetKeys.keys._id]).length) {
              this.tableWidgetArray(dependentWidget[widgetKeys.keys._id]).removeAt(this.tableWidgetArray(dependentWidget[widgetKeys.keys._id]).length - 1)
            }
          this.setLookupTableValues(filteredLookupData, dependentWidget, isInitialValue, changeType, event, removedIndex);
        } else {
          const tableWidgetFields = this.formFields.filter(x => x[widgetKeys.keys.isUnderHeading] == dependentWidget[widgetKeys.keys._id]);
          tableWidgetFields.forEach(widget => {
            this.getDependentWidgetForLookup(filteredLookupData, widget, selectedOption, isInitialValue, changeType, event, removedIndex);
          });
        }
        break;
      }
    }
    // }
  }

  setLookupTextValues(widget, values) {
    this.group.get(widget[widgetKeys.keys._id]).setValue(this.getSplittedValues(values).join());
  }

  setLookupOptions(widget, values) {
    const splittedValues = this.getSplittedValues(values);
    widget[widgetKeys.keys.referenceListOptions] = [];
    if (splittedValues.length) {
      widget[widgetKeys.keys.referenceListOptions].push(splittedValues.map(x => {
        let option = {};
        option[widgetKeys.keys.optionDisplayName] = x;
        option[widgetKeys.keys.optionValue] = x;
        return option;
      }));
    }
  }

  getSplittedValues(values) {
    return values.reduce((previous, current) => {
      if (current)
        previous.push(...current.split(","));
      return previous;
    }, [])
  }

  setLookupTableValues(filteredLookupData, widget, isInitialValue, changeType, event, removedIndex) {
    const tableFields = this.formDataDistributionService.getTableWidgets()[widget[widgetKeys.keys._id]];
    const tableLookupFields = tableFields.filter(x => x[widgetKeys.keys.isUnderHeading] == widget[widgetKeys.keys._id] && x[widgetKeys.keys.columnName])
    // if (!isInitialValue) {
    //   while (this.tableWidgetArray(widget[widgetKeys.keys._id]).length) {
    //     this.tableWidgetArray(widget[widgetKeys.keys._id]).removeAt(this.tableWidgetArray(widget[widgetKeys.keys._id]).length - 1)
    //   }
    // }
    let initialTableObj = tableFields.reduce((previous, current) => {
      previous[current[widgetKeys.keys._id]] = "";
      return previous;
    }, {});
    if(isInitialValue) {
      tableLookupFields.forEach(tableField => {
        let tableFieldValues = filteredLookupData.map(x => x[tableField[widgetKeys.keys.columnName]]);
        if (tableFieldValues.length) {
          switch (tableField[widgetKeys.keys.type]) {
            case widgetKeys.fieldTypes.radio: {
              this.setTableLookupOptions(widget, tableField, tableFieldValues, initialTableObj);
              break;
            }
            case widgetKeys.fieldTypes.select: {
              this.setTableLookupOptions(widget, tableField, tableFieldValues, initialTableObj);
              break;
            }
            case widgetKeys.fieldTypes.checkbox: {
              this.setTableLookupOptions(widget, tableField, tableFieldValues, initialTableObj);
              break;
            }
            default : {
              break;
            }
          }
        }
      });
    } else {
      switch(changeType) {
        case 'add': {
          filteredLookupData = this.lookUpTableData.filter(x => x[this.mainColumnName] == event);
          console.log("filteredLookupData",filteredLookupData);
          let tableWidgetArray = this.tableWidgetArray(widget[widgetKeys.keys._id]);
          for(let i=0;i<filteredLookupData.length;i++) {
            tableWidgetArray.push(this.fb.group(initialTableObj));
          }
          tableLookupFields.forEach(tableField => {
            let tableFieldValues = filteredLookupData.map(x => x[tableField[widgetKeys.keys.columnName]]);
            if(tableFieldValues.length) {
              switch (tableField[widgetKeys.keys.type]) {
                case widgetKeys.fieldTypes.textbox: {
                  this.addTableLookupTextValues(widget, tableField, tableFieldValues);
                  break;
                }
                case widgetKeys.fieldTypes.number: {
                  this.addTableLookupTextValues(widget, tableField, tableFieldValues);
                  break;
                }
                case widgetKeys.fieldTypes.textarea: {
                  this.addTableLookupTextValues(widget, tableField, tableFieldValues);
                  break;
                }
                case widgetKeys.fieldTypes.radio: {
                  this.addTableLookupOptions(widget, tableField, tableFieldValues);
                  break;
                }
                case widgetKeys.fieldTypes.select: {
                  this.addTableLookupOptions(widget, tableField, tableFieldValues);
                  break;
                }
                case widgetKeys.fieldTypes.checkbox: {
                  this.addTableLookupOptions(widget, tableField, tableFieldValues);
                  break;
                }
              }
            }
          })
          // tableLookupFields.forEach(tableField => {
          //   let tableFieldValues = filteredLookupData.map(x => x[tableField[widgetKeys.keys.columnName]]);
          //   if (tableFieldValues.length) {
          //     switch (tableField[widgetKeys.keys.type]) {
          //       case widgetKeys.fieldTypes.textbox: {
          //         this.setTableLookupTextValues(widget, tableField, tableFieldValues, initialTableObj);
          //         break;
          //       }
          //       case widgetKeys.fieldTypes.number: {
          //         this.setTableLookupTextValues(widget, tableField, tableFieldValues, initialTableObj);
          //         break;
          //       }
          //       case widgetKeys.fieldTypes.textarea: {
          //         this.setTableLookupTextValues(widget, tableField, tableFieldValues, initialTableObj);
          //         break;
          //       }
          //       case widgetKeys.fieldTypes.radio: {
          //         this.setTableLookupOptions(widget, tableField, tableFieldValues, initialTableObj);
          //         break;
          //       }
          //       case widgetKeys.fieldTypes.select: {
          //         this.setTableLookupOptions(widget, tableField, tableFieldValues, initialTableObj);
          //         break;
          //       }
          //       case widgetKeys.fieldTypes.checkbox: {
          //         this.setTableLookupOptions(widget, tableField, tableFieldValues, initialTableObj);
          //         break;
          //       }
          //     }
          //   }
          // });
          break;
        }
        case 'remove': {
          this.tableWidgetArray(widget[widgetKeys.keys._id]).removeAt(removedIndex);
          tableLookupFields.forEach(tableField => {
            switch (tableField[widgetKeys.keys.type]) {
              case widgetKeys.fieldTypes.radio: {
                tableField[widgetKeys.keys.referenceListOptions].splice(removedIndex,1);
                break;
              }
              case widgetKeys.fieldTypes.select: {
                tableField[widgetKeys.keys.referenceListOptions].splice(removedIndex,1);
                break;
              }
              case widgetKeys.fieldTypes.checkbox: {
                tableField[widgetKeys.keys.referenceListOptions].splice(removedIndex,1);
                break;
              }
              default : {
                break;
              }
            }
          });
          break;
        }
        case 'clear': {
          while (this.tableWidgetArray(widget[widgetKeys.keys._id]).length) {
            this.tableWidgetArray(widget[widgetKeys.keys._id]).removeAt(this.tableWidgetArray(widget[widgetKeys.keys._id]).length - 1);
          }
          break;
        }
      }
      // tableLookupFields.forEach(tableField => {
      //   let tableFieldValues = filteredLookupData.map(x => x[tableField[widgetKeys.keys.columnName]]);
      //   if (tableFieldValues.length) {
      //     switch (tableField[widgetKeys.keys.type]) {
      //       case widgetKeys.fieldTypes.textbox: {
      //         this.setTableLookupTextValues(widget, tableField, tableFieldValues, initialTableObj);
      //         break;
      //       }
      //       case widgetKeys.fieldTypes.number: {
      //         this.setTableLookupTextValues(widget, tableField, tableFieldValues, initialTableObj);
      //         break;
      //       }
      //       case widgetKeys.fieldTypes.textarea: {
      //         this.setTableLookupTextValues(widget, tableField, tableFieldValues, initialTableObj);
      //         break;
      //       }
      //       case widgetKeys.fieldTypes.radio: {
      //         this.setTableLookupOptions(widget, tableField, tableFieldValues, initialTableObj);
      //         break;
      //       }
      //       case widgetKeys.fieldTypes.select: {
      //         this.setTableLookupOptions(widget, tableField, tableFieldValues, initialTableObj);
      //         break;
      //       }
      //       case widgetKeys.fieldTypes.checkbox: {
      //         this.setTableLookupOptions(widget, tableField, tableFieldValues, initialTableObj);
      //         break;
      //       }
      //     }
      //   }
      // });
    }
  }

  setTableLookupTextValues(tableWidget, widget, values, initialTableObj) {
    let tableWidgetArray = this.tableWidgetArray(tableWidget[widgetKeys.keys._id]);
    values.forEach((value, index) => {
      if (index + 1 > tableWidgetArray.length) {
        tableWidgetArray.push(this.fb.group(initialTableObj));
      }
      tableWidgetArray.at(index).get(widget[widgetKeys.keys._id]).setValue(this.getSplittedValues([value]).join());
    });
  }

  addTableLookupTextValues(tableWidget,widget, values) {
    let tableWidgetArray = this.tableWidgetArray(tableWidget[widgetKeys.keys._id]);
    let tableLength = tableWidgetArray.length;
    values.forEach((value, index) => {
      // console.log("tableLength",tableLength);
      // console.log("tableLength-1",tableLength-1);
      // console.log("values.length",values.length);
      // console.log("index",index);
      // console.log("values.length-index",values.length-index);
      // console.log("at",(tableLength-1)-((values.length-1)-index));
      tableWidgetArray.at((tableLength-1)-((values.length-1)-index)).get(widget[widgetKeys.keys._id]).setValue(this.getSplittedValues([value]).join());
    })

  }

  setTableLookupOptions(tableWidget, widget, values, initialTableObj) {
    let tableWidgetArray = this.tableWidgetArray(tableWidget[widgetKeys.keys._id]);
    widget[widgetKeys.keys.referenceListOptions] = [];
    values.forEach((value, index) => {
      if (index + 1 > tableWidgetArray.length) {
        tableWidgetArray.push(this.fb.group(initialTableObj));
      }
      widget[widgetKeys.keys.referenceListOptions].push(this.getSplittedValues([value]).map(x => {
        let option = {};
        option[widgetKeys.keys.optionDisplayName] = x;
        option[widgetKeys.keys.optionValue] = x;
        return option;
      }));
    });
  }

  addTableLookupOptions(tableWidget, widget, values) {
    if(!widget[widgetKeys.keys.referenceListOptions])
    widget[widgetKeys.keys.referenceListOptions] = [];
    console.log("widget[widgetKeys.keys.referenceListOptions]",widget[widgetKeys.keys.referenceListOptions]);
    values.forEach((value, index) => {
      widget[widgetKeys.keys.referenceListOptions].push(this.getSplittedValues([value]).map(x => {
        let option = {};
        option[widgetKeys.keys.optionDisplayName] = x;
        option[widgetKeys.keys.optionValue] = x;
        return option;
      }));
    })
  }

}
