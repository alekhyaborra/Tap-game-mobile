import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Field } from '../../models/field.interface';
import { FieldConfig } from '../../models/field-config.interface';
import { widgetKeys } from '../../object-keys-constants';
import { FormDataDistributionService } from '../../form-data-distribution.service';
import { ToastService } from "../../../sharedServices/toast.service";
import { Constants } from '../../../constants/constants';
import { CalculationService } from '../../calculation.service';

@Component({
  selector: 'app-form-calculation',
  templateUrl: './form-calculation.component.html',
  styleUrls: ['./form-calculation.component.scss'],
})
export class FormCalculationComponent implements OnInit, Field {
  config: FieldConfig;
  group: FormGroup;
  widgetKey: any;
  groupName: any;
  expendedHeaderId: any;
  equalSymbol:any;
  derivedFields: any;
  derivedFieldsCopy: any;
  isDerivedField: boolean = false;
  bOSubscribe: any;
  data: any;
  isTable:boolean;
  historyView:any;
  constructor(
    private formDataDistributionService: FormDataDistributionService,
    private toastService: ToastService,
    private calculationService: CalculationService
  ) {
    this.widgetKey = widgetKeys.keys;
  }

  ngOnInit() {
    let calValue = this.group.get(this.config[widgetKeys.keys._id]).value ? this.group.get(this.config[widgetKeys.keys._id]).value : '';
    this.group.get(this.config[widgetKeys.keys._id]).setValue(calValue);
    this.equalSymbol = Constants.imageIcons.eqal;
    this.bOSubscribe = this.formDataDistributionService.hederOpen.subscribe(expendedHeaderId => {
      this.expendedHeaderId = expendedHeaderId;
    });
  }

  executeFormula(calData){
    let solvedFormula = '';
    let emptyFieldsCount = 0;
    calData[widgetKeys.calculationKeys.formula].forEach(formulaObjcet => {
      let result = this.calculationService.formulaValidatore(formulaObjcet,this.group);
      if(result== undefined || result['emptyFields']){
        this.toastService.showToast(Constants.calculationError);
        emptyFieldsCount++
        return
      }else{
        solvedFormula += result['formula'];
      }
    });
    if(emptyFieldsCount == 0){
      const calculationValue = parseFloat(eval(solvedFormula).toFixed(5));
      this.group.get(calData[this.widgetKey._id]).setValue(calculationValue);
    }
  }

  ngOnDestroy() {
    if (this.bOSubscribe) {
      this.bOSubscribe.unsubscribe();
    }
  }
}
