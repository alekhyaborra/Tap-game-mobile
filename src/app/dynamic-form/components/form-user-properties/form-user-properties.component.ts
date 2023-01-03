import { Component, OnInit } from '@angular/core';
import { FieldConfig } from '../../../dynamic-form/models/field-config.interface';
import { FormGroup } from '@angular/forms';
import { widgetKeys } from '../../object-keys-constants';
import { FormDataDistributionService } from '../../../dynamic-form/form-data-distribution.service';
import { CommonService } from '../../../sharedServices/commonServices/common.service';

@Component({
  selector: 'app-form-user-properties',
  templateUrl: './form-user-properties.component.html',
  styleUrls: ['./form-user-properties.component.scss'],
})
export class FormUserPropertiesComponent implements OnInit {

  config: FieldConfig;
  group: FormGroup;
  derivedFields: any;
  derivedFieldsCopy: any;
  widgetKey: any;
  userproperties:any;
  expendedHeaderId: any;
  bOSubscribe: any;  
  historyView: boolean;
  isTable:boolean;
  constructor(
    private formDataDistributionService: FormDataDistributionService,
    private commonService : CommonService 
  ) {
    this.widgetKey = widgetKeys.keys;
    this.userproperties = widgetKeys.userproperties;
  }

  ngOnInit() {  
    if(!this.derivedFields)
      this.derivedFields = [];
    this.formDataDistributionService.hederOpen.subscribe(expendedHeaderId => {
      this.expendedHeaderId = expendedHeaderId;
    });
    let getTypeList = this.formDataDistributionService.getTypeList();
    getTypeList[this.config[widgetKeys.keys._id]] = this.config[widgetKeys.keys.type];
    this.formDataDistributionService.setTypeList(getTypeList);
    if(!this.historyView){
      var userInfo = this.commonService.getUserInfo();
      switch (this.config[this.widgetKey.label]) {
        case this.userproperties.divisionCode : {
          this.group.get(this.config[this.widgetKey._id]).setValue(userInfo.divisioncode);
          break;
        }
        case this.userproperties.number : {
          this.group.get(this.config[this.widgetKey._id]).setValue(userInfo.phone);
          break;
        }
        case this.userproperties.email : {
          this.group.get(this.config[this.widgetKey._id]).setValue(userInfo.email);
          break;
        }
        case this.userproperties.name : {
          this.group.get(this.config[this.widgetKey._id]).setValue(userInfo.username);
          break;
        }
        default : {
          break;
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
