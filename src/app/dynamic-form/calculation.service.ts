import { Injectable } from '@angular/core';
import { widgetKeys } from './object-keys-constants';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CalculationService {
  group: FormGroup;
  constructor() { }

  formulaValidatore(formulaObject, FormValues) {
    let preparedFormula;
    this.group = FormValues;
    for (let key in formulaObject) {
      const fieldList = formulaObject[key];
      switch (key) {
        case widgetKeys.calculationKeys.actions.add: {
          preparedFormula = this.prepareAddFormula(fieldList);
          break;
        }
        case widgetKeys.calculationKeys.actions.numeric: {
          preparedFormula = this.prepareNumericFormula(fieldList);
          break;
        }
        case widgetKeys.calculationKeys.actions.sub: {
          preparedFormula = this.prepareFormula(fieldList, '-');
          break;
        }
        case widgetKeys.calculationKeys.actions.mul: {
          preparedFormula = this.prepareFormula(fieldList, '*');
          break;
        }
        case widgetKeys.calculationKeys.actions.div: {
          preparedFormula = this.prepareFormula(fieldList, '/');
          break;
        }
        case widgetKeys.calculationKeys.actions.inv: {
          preparedFormula = this.prepareInvFormula(fieldList);
          break;
        }
        case widgetKeys.calculationKeys.actions.singleOperator: {
          preparedFormula = this.prepareSingleFormula(fieldList);
          break;
        }
        case widgetKeys.calculationKeys.actions.sqrt: {
          preparedFormula = this.prepareSquarerootFormula(fieldList);
          break;
        }
        case widgetKeys.calculationKeys.actions.parentheses: {
          preparedFormula = this.prepareParaFormula(fieldList, FormValues);
          break;
        }
        case widgetKeys.calculationKeys.actions.avg: {
          preparedFormula = this.prepareAverageFormula(fieldList);
          break;
        }
        default: {
          return { emptyFields: true, formula: "" }
          break;
        }
      }
    }
    return preparedFormula;
  }

  prepareAddFormula(fieldList) {
    let totalValue = 0;
    let preparedFormula;
    let emptyFieldsCount = 0;
    fieldList[widgetKeys.calculationKeys.fieldList].forEach(fieldObject => {
      const widgetValue = this.group.get(fieldObject[widgetKeys.calculationKeys.formulaKeys.id]).value;
      if (widgetValue == undefined || widgetValue == "") {
        emptyFieldsCount++;
      }
      else {
        totalValue = totalValue + parseInt(widgetValue);
      }
    });
    if (emptyFieldsCount > 0)
      return { emptyFields: true, formula: "" }
    else {
      preparedFormula = totalValue + "" + fieldList[widgetKeys.calculationKeys.operator];
      return { emptyFields: false, formula: preparedFormula };
    }
  }

  prepareFormula(fieldList, action) {
    let subFormula = "";
    let preparedFormula;
    let emptyFieldsCount = 0;
    let count = 0;
    fieldList[widgetKeys.calculationKeys.fieldList].forEach(fieldObject => {
      const widgetValue = this.group.get(fieldObject[widgetKeys.calculationKeys.formulaKeys.id]).value;
      if (widgetValue == undefined || widgetValue == "") {
        emptyFieldsCount++;
      }
      else {
        if (fieldList[widgetKeys.calculationKeys.fieldList].length - 1 > count) {
          subFormula = subFormula + widgetValue + action;
        }
        else {
          subFormula = subFormula + widgetValue;
        }
      }
      count++;
    })
    if (emptyFieldsCount > 0)
      return { emptyFields: true, formula: "" }
    else {
      preparedFormula = eval(subFormula) + "" + fieldList[widgetKeys.calculationKeys.operator];
      return { emptyFields: false, formula: preparedFormula };
    }
  }

  prepareInvFormula(fieldList) {
    var subFormula = "";
    let preparedFormula;
    var emptyFieldsCount = 0;
    if (fieldList[widgetKeys.calculationKeys.fieldList].length == 1) {
      const widgetValue = this.group.get(fieldList[widgetKeys.calculationKeys.fieldList][0][widgetKeys.calculationKeys.formulaKeys.id]).value;
      if (widgetValue == undefined || widgetValue == "") {
        emptyFieldsCount++;
      }
      else {
        subFormula = 1 + "/" + parseInt(widgetValue);
      }
    }
    else if (fieldList[widgetKeys.calculationKeys.fieldList].length == 2) {
      const widgetValueOne = this.group.get(fieldList[widgetKeys.calculationKeys.fieldList][0][widgetKeys.calculationKeys.formulaKeys.id]).value;
      const widgetValueTow = this.group.get(fieldList[widgetKeys.calculationKeys.fieldList][1][widgetKeys.calculationKeys.formulaKeys.id]).value;
      if (widgetValueOne == undefined || widgetValueOne == "" || widgetValueTow == undefined || widgetValueTow == "") {
        emptyFieldsCount++;
      }
      else {
        subFormula = parseInt(widgetValueTow) + "/" + parseInt(widgetValueOne);
      }
    }
    else {
      emptyFieldsCount++;
    }
    preparedFormula = eval(subFormula) + "" + fieldList[widgetKeys.calculationKeys.operator];
    if (emptyFieldsCount > 0)
      return { emptyFields: true, formula: "" }
    else
      return { emptyFields: false, formula: preparedFormula };
  }

  prepareSingleFormula(fieldList) {
    let preparedFormula;
    let emptyFieldsCount = 0;
    const widgetValue = this.group.get(fieldList[widgetKeys.calculationKeys.fieldList][0][widgetKeys.calculationKeys.formulaKeys.id]).value;
    if (widgetValue == undefined || widgetValue == "") {
      emptyFieldsCount++;
    }
    else
      preparedFormula = widgetValue + fieldList[widgetKeys.calculationKeys.operator];
    if (emptyFieldsCount > 0)
      return { emptyFields: true, formula: "" }
    else
      return { emptyFields: false, formula: preparedFormula };
  }

  prepareSquarerootFormula(fieldList) {
    let preparedFormula;
    let emptyFieldsCount = 0;
    const widgetValue = this.group.get(fieldList[widgetKeys.calculationKeys.fieldList][0][widgetKeys.calculationKeys.formulaKeys.id]).value;
    if (widgetValue == undefined || widgetValue == "") {
      emptyFieldsCount++;
    }
    else
      preparedFormula = Math.sqrt(widgetValue) + fieldList[widgetKeys.calculationKeys.operator];
    if (emptyFieldsCount > 0)
      return { emptyFields: true, formula: "" }
    else
      return { emptyFields: false, formula: preparedFormula };
  }

  prepareParaFormula(fieldList, FormValues) {
    let preparedFormula = "";
    let emptyFieldsCount = 0;
    fieldList[widgetKeys.calculationKeys.fieldList].forEach(fieldObject => {
      let result = this.formulaValidatore(fieldObject, FormValues)
      if (result.emptyFields > 0)
        emptyFieldsCount++;
      else {
        preparedFormula += result.formula;
      }
    });
    if (emptyFieldsCount > 0)
      return { emptyFields: true, formula: "" }
    else
      return { emptyFields: false, formula: eval(preparedFormula) + fieldList[widgetKeys.calculationKeys.operator] };
  }

  prepareAverageFormula(fieldList) {
    let totalValue = 0;
    let preparedFormula;
    let emptyFieldsCount = 0;
    fieldList[widgetKeys.calculationKeys.fieldList].forEach(fieldObject => {
      const widgetValue = this.group.get(fieldObject[widgetKeys.calculationKeys.formulaKeys.id]).value;
      if (widgetValue == undefined || widgetValue == "") {
        emptyFieldsCount++;
      }
      else {
        totalValue = totalValue + parseInt(widgetValue);
      }
    });
    if (emptyFieldsCount > 0)
      return { emptyFields: true, formula: "" }
    else {
      preparedFormula = totalValue / fieldList[widgetKeys.calculationKeys.fieldList].length + "" + fieldList[widgetKeys.calculationKeys.operator];
      return { emptyFields: false, formula: preparedFormula };
    }
  }

  prepareNumericFormula(fieldList) {
    return { emptyFields: false, formula: fieldList[widgetKeys.calculationKeys.fieldList] + "" + fieldList[widgetKeys.calculationKeys.operator] };
  }
}
