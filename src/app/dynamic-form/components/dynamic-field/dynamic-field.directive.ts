import { ComponentFactoryResolver, ComponentRef, Directive, Input, OnChanges, OnInit, Type, ViewContainerRef, SimpleChanges } from '@angular/core';
import { FormGroup, FormArray, FormBuilder} from '@angular/forms';

import { FormInputComponent } from '../form-input/form-input.component';
import {FormCheckBoxComponent} from '../form-check-box/form-check-box.component';
import {FormTextAreaComponent} from '../form-text-area/form-text-area.component'
import {FormDropDownComponent} from '../form-drop-down/form-drop-down.component'
import { Field } from '../../models/field.interface';
import { FieldConfig } from '../../models/field-config.interface';
import { FormCameraComponent } from '../form-camera/form-camera.component';
import { FormBarcodeComponent } from '../form-barcode/form-barcode.component';
import { FormSignatureComponent } from '../form-signature/form-signature.component';
import { FormRadioButtonComponent} from '../form-radio-button/form-radio-button.component'
import { FormRatingComponent } from '../form-rating/form-rating.component';
import { FormHeaderComponent} from '../form-heading/form-heading.component';
import { FormHeadingBreakComponent} from '../form-heading-break/form-heading-break.component'
import { FormNumberComponent } from '../form-number/form-number.component';
import { FormMapComponent } from '../form-map/form-map.component';
import { FormDatepickerComponent } from '../form-datepicker/form-datepicker.component';
import { FormCalculationComponent } from '../form-calculation/form-calculation.component';
import { FormVideoComponent } from '../form-video/form-video.component';
import { widgetKeys } from '../../object-keys-constants';
import { FormDataDistributionService } from '../../form-data-distribution.service';
import { FormTableComponent } from '../form-table/form-table.component';
import { FormTimeWidgetComponent } from '../form-time-widget/form-time-widget.component';
import { FormUserPropertiesComponent } from '../form-user-properties/form-user-properties.component';
import { FormReferenceListComponent } from '../form-reference-list/form-reference-list.component';

const components: {[type: string]: Type<Field>} = {
  textBox: FormInputComponent,
  checkBox:FormCheckBoxComponent,
  textArea: FormTextAreaComponent,
  select: FormDropDownComponent,
  camera: FormCameraComponent,
  barcode: FormBarcodeComponent,
  signature: FormSignatureComponent,
  radio: FormRadioButtonComponent,
  rating: FormRatingComponent,
  heading: FormHeaderComponent,
  break: FormHeadingBreakComponent,
  number: FormNumberComponent,
  map: FormMapComponent,
  calendar:FormDatepickerComponent,
  calculation: FormCalculationComponent,
  video: FormVideoComponent,
  time : FormTimeWidgetComponent,
  properties : FormUserPropertiesComponent,
  referenceList: FormReferenceListComponent
};

@Directive({
  selector: '[dynamicField]'
})
export class DynamicFieldDirective implements Field, OnChanges, OnInit {
  @Input()
  config: FieldConfig;

  @Input()
  group: FormGroup;

  @Input()
  data:any;

  @Input()
  isHistoryView:boolean;

  @Input()
  derivedFields:any;
  @Input()
  Fieldsearch:any;
  
  derivedFieldsCopy: any;
  component: ComponentRef<Field>;
  @Input()
  isTable:any;
  @Input()
  tableWidgetId:any;
  @Input()
  tableWidgetIndex:any;
  @Input()
  formFields:any;
  @Input()
  index:any;
  @Input()
  dependencyConditions:any;


  constructor(
    private resolver: ComponentFactoryResolver,
    private container: ViewContainerRef,
    private formDataDistributionService: FormDataDistributionService,
    private fb: FormBuilder,
  ) {
    
  }

  ngOnChanges(changes:SimpleChanges) {
    if (this.component) {
      this.component.instance.config = this.config;
      this.component.instance.group = this.group;
      this.component.instance.data = this.data;
      if(this.config[widgetKeys.keys.isTable]){
        if(this.data[this.config[widgetKeys.keys._id]].length > this.tableWidgetArray.length){
          this.prepareArrayItem(this.data[this.config[widgetKeys.keys._id]].length-1);
        }
      }
      if(changes.Fieldsearch){
        this.component.instance.Fieldsearch = this.Fieldsearch;
      }
      else {
        // this.group.get(this.config[widgetKeys.keys._id]).setValue(this.data[this.config[widgetKeys.keys._id]]);
      }
    }
  }

  get tableWidgetArray() {
    return this.group.get(this.config[widgetKeys.keys._id]) as FormArray;
  }

  prepareArrayItem(length){
    for(let i=1; i<=length;i++){
      this.tableWidgetArray.push(this.fb.group(this.formDataDistributionService.getTableWidgetsControllers()[this.config[widgetKeys.keys._id]]));
    }    
  }

  ngOnInit() {
    
    if(this.isHistoryView ==true ){
      this.group.disable()
    }
    if (!components[this.config.type]) {
      const supportedTypes = Object.keys(components).join(', ');
      throw new Error(
        `Trying to use an unsupported type (${this.config.type}).
        Supported types: ${supportedTypes}`
      );
    }
    //assign the data/field values to form 
    try{
     
        if(this.data[this.config["id"]]){
        this.group.get(this.config[widgetKeys.keys._id]).setValue(this.data[this.config[widgetKeys.keys._id]] ? this.data[this.config[widgetKeys.keys._id]] : '');
      }
    }catch(err){
       
    }
    let component;
    if(this.config[widgetKeys.keys.type] == widgetKeys.fieldTypes.heading && this.config[widgetKeys.keys.isTable] == true){
      component = this.resolver.resolveComponentFactory<Field>(FormTableComponent);
    }
    else{
      component = this.resolver.resolveComponentFactory<Field>(components[this.config.type]);
    }   
    
    this.component = this.container.createComponent(component);
    this.component.instance.config = this.config;
    this.component.instance.group = this.group;
    this.component.instance.data = this.data;
    this.component.instance.derivedFields = this.derivedFields ? this.derivedFields : [];
    this.component.instance.derivedFieldsCopy = JSON.parse(JSON.stringify(this.derivedFields));
    this.component.instance.historyView=this.isHistoryView
    this.component.instance.isTable=this.isTable;
    this.component.instance.tableWidgetId=this.tableWidgetId; 
    this.component.instance.tableWidgetIndex=this.tableWidgetIndex;
    this.component.instance.Fieldsearch=this.Fieldsearch;
    this.component.instance.index = this.index;
    if(this.config[widgetKeys.keys.type] == widgetKeys.fieldTypes.referenceList){
      this.component.instance.formFields = this.formFields;
      if(this.dependencyConditions){
        this.component.instance.dependencyCondition = this.dependencyConditions.find(x=>x.mainWidgetId==this.config[widgetKeys.keys._id]);
      }
    }
  }
}
