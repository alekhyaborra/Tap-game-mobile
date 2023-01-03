import { Component, OnInit, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators  } from '@angular/forms';
import { FieldConfig } from '../../../models/field-config.interface';
import {widgetKeys} from '../../../object-keys-constants';
import { FormDataDistributionService } from '../../../form-data-distribution.service';
import { ToastService } from '../../../../sharedServices/toast.service';
import { Constants } from '../../../../constants/constants';
import { ModalController } from '@ionic/angular';
import { CommonService } from '../../../../sharedServices/commonServices/common.service';

@Component({
  selector: 'app-table-modal',
  templateUrl: './table-modal.component.html',
  styleUrls: ['./table-modal.component.scss'],
})
export class TableModalComponent implements OnInit {

  @Input()
  config: FieldConfig[] = [];

  @Input()
  recordData: any;

  @Input()
  recordStatus: number;

  @Input()
  isHistoryView:boolean;

  @Input()
  derivedFields:any;

  @Input()
  tableWidgetId: any;
  
  form: FormGroup;
  widgetKey: any;

  get controls() { return this.config.filter(({type}) => type !== 'button'); }

  get changes() { return this.form.valueChanges; }
  get valid() { return this.form.valid; }
  get value() { return this.form.value; }

 
  constructor(
    private fb: FormBuilder,
    private formDataDistributionService: FormDataDistributionService,
    private toastService: ToastService,
    private modalController: ModalController,
    private commonService: CommonService
  ) {
    this.widgetKey = widgetKeys.keys;
   
  }

  ngOnInit() {
    this.form = this.createGroup();
  }

  ngOnDestroy(){
    this.formDataDistributionService.derivedField("");
  }

  ngOnChanges() {
    if (this.form) {
      const controls = Object.keys(this.form.controls);
      const configControls = this.controls.map((item) => item[widgetKeys.keys._id]);

      controls
        .filter((control) => !configControls.includes(control))
        .forEach((control) => this.form.removeControl(control));

      configControls
        .filter((control) => !controls.includes(control))
        .forEach((name) => {
          const config = this.config.find((control) => control[widgetKeys.keys._id] === name);
          this.form.addControl(name, this.createControl(config));
        });

    }
  }

  createGroup() {
    const group = this.fb.group({});
    this.controls.forEach(control => group.addControl(control[widgetKeys.keys._id], this.createControl(control)));
    return group;
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


  setValue(name: string, value: any) {
    this.form.controls[name].setValue(value, {emitEvent: true});
  }

  public getFormFilledData(){
    this.removeDerivedHidenFields()
    if (this.form.invalid) {
      this.addRemovedValideations();
      this.form.markAsDirty();
      this.toastService.showToast(Constants.invalidFormEntry);
      for (let control in this.form.controls) {
        this.form.controls[control].markAsDirty();
      };
    }
    else{
      let requiredTBIds = this.commonService.getMandatoryTWIds();
      const index = requiredTBIds.indexOf(this.tableWidgetId);
      if(index > -1){
        requiredTBIds.splice(index, 1);
        this.commonService.setMandatoryTWIds(requiredTBIds);
      }  
      this.modalController.dismiss({
        'data': this.form.getRawValue()
      });
    }
  }

  removeDerivedHidenFields() {
    this.derivedFields.forEach((field) => {
     
        if (this.form.get(field) && this.form.get(field).errors && this.form.get(field).errors['required']) {
         this.form.get(field).setValidators(null);
         this.form.get(field).updateValueAndValidity();
        }
      });
    }
 
    addRemovedValideations() {
     for ( let index = 0; index < this.config.length; index++) {
       if (this.derivedFields.indexOf(this.config[index]['id']) > -1) {
        this.addValideation(this.config[index]);
       }
     }
   }
 
   addValideation(fieldRef) {
     const validationList: any  = [];
     if (fieldRef['isRequired'] && fieldRef['isRequired'] === true) {
       validationList.push(Validators.required);
     }
 
     if (fieldRef['minLength']) {
       validationList.push(Validators.minLength(fieldRef['minLength']));
     }
 
     if (fieldRef['maxLength']) {
       validationList.push(Validators.maxLength(fieldRef['maxLength']));
     }
     this.derivedFields.forEach((field) => {
       if (this.form.get(field)) {
         this.form.get(field).setValidators([Validators.required, Validators.maxLength(50)]);
         this.form.get(field).updateValueAndValidity();
       }
     });
   }
}
