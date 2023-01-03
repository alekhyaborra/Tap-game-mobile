import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FieldConfig } from '../../models/field-config.interface';
import { widgetKeys } from '../../object-keys-constants'
import { FormDataDistributionService } from '../../form-data-distribution.service'

@Component({
  selector: 'app-form-rating',
  templateUrl: './form-rating.component.html',
  styleUrls: ['./form-rating.component.scss'],
})
export class FormRatingComponent implements OnInit {
  config: FieldConfig;
  group: FormGroup;
  rating: number
  widgetKey: any;
  historyView:boolean;
  expendedHeaderId: any;
  derivedFields: any;
  derivedFieldsCopy: any;
  isDerivedField: boolean = false;
  bOSubscribe: any;
  data: any;
  isTable:boolean;
  constructor(private formDataDistributionService:FormDataDistributionService) {   this.widgetKey = widgetKeys.keys;
  }

 
  ngOnInit() {
    this.getRatingValue(this.config[this.widgetKey._id]? this.config[this.widgetKey._id] : 1)
    this.formDataDistributionService.hederOpen.subscribe(expendedHeaderId => {
      this.expendedHeaderId = expendedHeaderId;
    });
    let getTypeList = this.formDataDistributionService.getTypeList();
    getTypeList[this.config[widgetKeys.keys._id]] = this.config[widgetKeys.keys.type];
    this.formDataDistributionService.setTypeList(getTypeList);
  }
  getRatingValue(formcontrolNameRef:any) {
    this.group.get(formcontrolNameRef).setValue(this.group.get(formcontrolNameRef).value);
    this.rating = 100 * this.group.get(formcontrolNameRef).value / this.config[this.widgetKey.maximum]  //this.rating gives the value user selected 
  }

  ngOnDestroy() {
    if (this.bOSubscribe) {
      this.bOSubscribe.unsubscribe();
    }
  }
}
