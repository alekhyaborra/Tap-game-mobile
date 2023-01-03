import { Component, OnInit } from '@angular/core';
import { FieldConfig } from '../../../dynamic-form/models/field-config.interface';
import { FormGroup } from '@angular/forms';
import { FormDataDistributionService } from '../../../dynamic-form/form-data-distribution.service';
import { widgetKeys } from '../../object-keys-constants';
import { Keyboard } from '@awesome-cordova-plugins/keyboard/ngx';
@Component({
  selector: 'app-form-time-widget',
  templateUrl: './form-time-widget.component.html',
  styleUrls: ['./form-time-widget.component.scss'],
})
export class FormTimeWidgetComponent implements OnInit {

  config: FieldConfig;
  group: FormGroup;
  derivedFields: any;
  derivedFieldsCopy: any;
  widgetKey: any;
  expendedHeaderId: any;
  bOSubscribe: any;  
  historyView: boolean;
  isTable:boolean;
  constructor(private formDataDistributionService: FormDataDistributionService,private keyBoard:Keyboard) {
    this.widgetKey = widgetKeys.keys;
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
  }

  ngOnDestroy() {
    if (this.bOSubscribe) {
      this.bOSubscribe.unsubscribe();
    }
  }

  decreaseTime(){
    if(this.keyBoard.isVisible) {
      this.keyBoard.hide();
    }
    var hours = parseInt(this.group.get(this.config[this.widgetKey._id]).value.slice(0,this.group.get(this.config[this.widgetKey._id]).value.indexOf(":")));
    var minutes = parseInt(this.group.get(this.config[this.widgetKey._id]).value.slice(this.group.get(this.config[this.widgetKey._id]).value.indexOf(":")+1));
    var timePeriod = parseInt(this.config[this.widgetKey.timePeriod]);
    hours = minutes-timePeriod>=0?hours:hours-1;
    minutes = minutes-timePeriod>=0?minutes-timePeriod:60+(minutes-timePeriod);
    var time = hours+":"+minutes;
    this.group.get(this.config[this.widgetKey._id]).setValue(time);
    this.group.controls[this.config[this.widgetKey._id]].markAsDirty();
  }

  increaseTime(){
    if(this.keyBoard.isVisible) {
      this.keyBoard.hide();
    }
    var hours = parseInt(this.group.get(this.config[this.widgetKey._id]).value.slice(0,this.group.get(this.config[this.widgetKey._id]).value.indexOf(":")));
    var minutes = parseInt(this.group.get(this.config[this.widgetKey._id]).value.slice(this.group.get(this.config[this.widgetKey._id]).value.indexOf(":")+1));
    var timePeriod = parseInt(this.config[this.widgetKey.timePeriod]);
    hours = minutes+timePeriod>=60?hours+1:hours;
    minutes = minutes+timePeriod>=60?(minutes+timePeriod)-60:minutes+timePeriod;
    var time = hours+":"+minutes;
    this.group.get(this.config[this.widgetKey._id]).setValue(time);
    this.group.controls[this.config[this.widgetKey._id]].markAsDirty();
  }

  hourChange(event) {
    console.log("event",event);
    console.log("value",event.detail.value);
      var minutes = parseInt(this.group.get(this.config[this.widgetKey._id]).value.slice(this.group.get(this.config[this.widgetKey._id]).value.indexOf(":")+1));
      var time = event.detail.value+":"+minutes;
      this.group.get(this.config[this.widgetKey._id]).setValue(time);
      this.group.controls[this.config[this.widgetKey._id]].markAsDirty();
  }

  closeKeyboard(event){
    if(this.keyBoard.isVisible) {
      this.keyBoard.hide();
  }
  }

  validateError(){
    var hours = parseInt(this.group.get(this.config[this.widgetKey._id]).value.slice(0,this.group.get(this.config[this.widgetKey._id]).value.indexOf(":")));
    var minutes = parseInt(this.group.get(this.config[this.widgetKey._id]).value.slice(this.group.get(this.config[this.widgetKey._id]).value.indexOf(":")+1));
    if(hours<parseInt(this.config[this.widgetKey.minTime])) {
      this.minimumHoursError();
    } else if(hours>parseInt(this.config[this.widgetKey.maxTime]) || (hours==parseInt(this.config[this.widgetKey.maxTime]) && minutes!=0)) {
      this.maximumHoursError();
    } else {
      this.noError();
    }
  }

  minimumHoursError() {
    const timeControl = this.group.controls[this.config[this.widgetKey._id]];
    timeControl.setErrors({minHour:true});
  }

  maximumHoursError() {
    const timeControl = this.group.controls[this.config[this.widgetKey._id]];
    timeControl.setErrors({maxHour:true});
  }

  noError() {
    const timeControl = this.group.controls[this.config[this.widgetKey._id]];
    timeControl.setErrors(null);
  }

}
