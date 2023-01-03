import { Component, OnInit, NgZone } from '@angular/core';
import { Field } from '../../models/field.interface';
import { FieldConfig } from '../../models/field-config.interface';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { widgetKeys } from '../../object-keys-constants'
import { FormDataDistributionService } from '../../form-data-distribution.service'
import { Constants } from '../../../constants/constants';
import { ModalController } from '@ionic/angular';
import { TableModalComponent } from '../form-table/table-modal/table-modal.component';
import { CommonService } from '../../../sharedServices/commonServices/common.service';
import { FormModuleconstants } from '../../form-module-constants';

@Component({
  selector: 'app-form-table',
  templateUrl: './form-table.component.html',
  styleUrls: ['./form-table.component.scss'],
})
export class FormTableComponent implements OnInit, Field {

  config: FieldConfig;
  group: FormGroup;
  widgetKey: any;
  openGroupId: any;
  expendedHeaderId: any;
  derivedFields: any;
  derivedFieldsCopy: any;
  tableWidgetData: Array<any> = [];
  tableWidgetDataCopy: Array<any> = [];
  isTableStatus: boolean = true;
  showSubTable: any = 0;
  thisTableWidgetId: any;
  tableWidgetIndex: any;
  historyView:boolean;
  firstRowFilled: boolean = false;
  showTableRows: boolean = false;
  systemGeneratedEntry: string;
  isDerivedField: boolean = false;
  bOSubscribe: any;
  data: any;
  requiredFieldsFillded: boolean = false;
  requiredSubscribe: any;

  constructor(
    private formDataDistributionService: FormDataDistributionService,
    private fb: FormBuilder,
    private modalController: ModalController,
    private commonService: CommonService,
    private ngZone: NgZone
  ) {
    this.widgetKey = widgetKeys.keys;
  }

  ngOnInit() {
    this.systemGeneratedEntry = FormModuleconstants.systemGeneratedEntry;
    this.firstRowFilled = this.commonService.getWOData().recordStatus == Constants.status.saved || this.commonService.getWOData().recordStatus == Constants.status.reassigned || this.historyView ? false : true;
    this.bOSubscribe = this.formDataDistributionService.hederOpen.subscribe(expendedHeaderId => {
      this.expendedHeaderId = expendedHeaderId;
    });
    this.requiredSubscribe = this.commonService.requireTWIds.subscribe(thisTableWidgetId => {
      if(thisTableWidgetId.length &&  this.commonService.getMandatoryTWIds().indexOf(this.thisTableWidgetId) > -1)
        this.requiredFieldsFillded = true;
      else
      this.requiredFieldsFillded = false;
    });
    let getTableWidgeet = this.formDataDistributionService.getTableWidgets()[this.config[widgetKeys.keys._id]]
    this.tableWidgetDataCopy.push(getTableWidgeet);
    this.formDataDistributionService.hederOpen.subscribe(expendedHeaderId => {
      this.expendedHeaderId = expendedHeaderId;
    });
    this.thisTableWidgetId = this.config[widgetKeys.keys._id];
    let getTypeList = this.formDataDistributionService.getTypeList();
    getTypeList[this.config[widgetKeys.keys._id]] = widgetKeys.fieldTypes.table;
    this.formDataDistributionService.setTypeList(getTypeList);
  }

  ngOnDestroy() {
    if (this.bOSubscribe) {
      this.bOSubscribe.unsubscribe();
    }
    if (this.requiredSubscribe) {
      this.requiredSubscribe.unsubscribe();
    }
  }

  get tableWidgetArray() {
    return this.group.get(this.config[widgetKeys.keys._id]) as FormArray;
  }

  expendingWidgets(widget) {
    if (this.expendedHeaderId == widget[this.widgetKey._id])
      this.formDataDistributionService.headerOpend("");
    else
      this.formDataDistributionService.headerOpend(widget[this.widgetKey._id]);
  }

  async addTableWidget() {    
    const data = await this.openTableWidget(this.tableWidgetDataCopy[0]);  
    if(this.firstRowFilled){
      this.tableWidgetArray.at(0).patchValue(data);
      this.firstRowFilled = false;
    }      
    else{
      this.tableWidgetArray.push(this.fb.group(data))
    }
  }

  async openTableWidget(config, recordData?) {
    let derivedFieldsCopy = JSON.parse(JSON.stringify(this.derivedFields));
    const modal = await this.modalController.create({
      component: TableModalComponent,
      componentProps:{
        config: config,
        recordData: recordData,
        isHistoryView: this.historyView,
        derivedFields: derivedFieldsCopy,
        tableWidgetId: this.thisTableWidgetId
      },
      cssClass:"table-widget"
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if(data){
      this.requiredFieldsFillded= false;
    }
    return data['data'];
  }

  async showRowData(index) {
    const data = await this.openTableWidget(this.tableWidgetDataCopy[0], this.tableWidgetArray.value[index]);
    if (index == 0)
      this.firstRowFilled = false;
    this.tableWidgetArray.at(index).patchValue(data);
  }

  addTableSubSet(){
    return this.formDataDistributionService.getTableWidgetsControllers()[this.thisTableWidgetId];
  }



  removeTableWidget(index) {
    this.tableWidgetArray.removeAt(index);
    let tableFields = this.formDataDistributionService.getTableWidgets()[this.config[widgetKeys.keys._id]];
    tableFields.forEach(element => {
      if(element[widgetKeys.keys.referenceListOptions] && element[widgetKeys.keys.referenceListOptions].length && element[widgetKeys.keys.referenceListOptions][index]) {
        element[widgetKeys.keys.referenceListOptions].splice(index,1);
      }
    });
  }

  showOrHideTable(){
    this.showTableRows = !this.showTableRows;
  }

  createControl(config: FieldConfig) {
    let validationList:any  =[];
    if(config[this.widgetKey.isRequired] && config[this.widgetKey.isRequired] == true){
      validationList.push(Validators.required)
    }
    
    if(config[this.widgetKey.minLength]){
      validationList.push(Validators.minLength(config[this.widgetKey.minLength]));
    }
    
    if(config[this.widgetKey.maxLength]){
      validationList.push(Validators.maxLength(config[this.widgetKey.maxLength]));
    }
    return this.fb.control({value:config[this.widgetKey.defaultValue],disabled:config[this.widgetKey.disabled]},Validators.compose(validationList));
  }
}
