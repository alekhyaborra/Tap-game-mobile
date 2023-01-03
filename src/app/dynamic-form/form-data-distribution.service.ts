import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormDataDistributionService {
  hederOpen = new BehaviorSubject('');
  hederOpenRef = this.hederOpen.asObservable();
  derivedFieldBO = new BehaviorSubject('');
  derivedFieldRef = this.derivedFieldBO.asObservable();
  headersList = [];
  derivedFields = [];
  tableWidgetFields = {};
  tableWidgetFieldsControllers = {};
  subTableOpened: boolean;
  fieldTypeList = {};
  constructor() { }

  headerOpend(headerId: string) {
    this.hederOpen.next(headerId);
  }
  setOpendHeaders(headerId){
    this.headersList.push(headerId)
  }
  removeOpendHeader(index){
    this.headersList.splice(index,1);
  }
  clearOpendHeaders(){
    this.headersList = [];
  }
  getOpendHeaders(){
    return this.headersList;
  }
  derivedField(derivedFields){
    this.derivedFieldBO.next(derivedFields);
  }

  setTableWidgets(widget){
    this.tableWidgetFields = widget ;
  }
  getTableWidgets(){
    return this.tableWidgetFields;
  }

  setTableWidgetsControllers(controllers){
    this.tableWidgetFieldsControllers = controllers;
  }
  getTableWidgetsControllers(){
    return this.tableWidgetFieldsControllers;
  }
  
  setSubTableOpenedStatus(controllers){
    this.subTableOpened = controllers;
  }
  getSubTableOpenedStatus(){
    return this.subTableOpened;
  }
  
  setTypeList(controllers){
    this.fieldTypeList = controllers;
  }
  getTypeList(){
    return this.fieldTypeList;
  }
}
