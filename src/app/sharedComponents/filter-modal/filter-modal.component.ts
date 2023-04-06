import { Component, OnInit,Input, ViewChild } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Constants } from '../../constants/constants';

@Component({
  selector: 'app-filter-modal',
  templateUrl: './filter-modal.component.html',
  styleUrls: ['./filter-modal.component.scss'],
})
export class FilterModalComponent implements OnInit {

  
  filterElements = Constants.filter
  filterObject;
  dateObject;
  selectedFilter;
  headerConstants = Constants.modalHeader;
  fromDate;
  toDate;
  fromRecord;
  
  
  

  constructor(
    public modalController: ModalController,
    private navParams : NavParams
  ) { }

  ngOnInit() {
    this.filterObject = this.navParams.get("filterObject");
    this.selectedFilter = this.navParams.get("selectedFilter");
    this.fromRecord = this.navParams.get('fromRecord')
    
    
    console.log(this.filterObject)
  }

  close(){
    this.modalController.dismiss();
  }

  applyFilter(){
    if(this.fromDate || this.toDate){
      this.modifyDate()
    } 
  
    this.modalController.dismiss(this.selectedFilter);
    console.log(this.selectedFilter)
    console.log(this.fromDate)
    console.log(this.toDate)
  }

  modifyDate(){
    if(this.fromDate && this.toDate ==  Constants.nullValue){
      this.toDate = new Date()
    } else if(this.fromDate ==  Constants.nullValue && this.toDate){
      this.fromDate = this.toDate
    }
    let fdate = new Date(this.fromDate)
    let tdate = new Date(this.toDate)
    fdate.setDate(fdate.getDate()-1)
    tdate.setDate(tdate.getDate()+1)
    let nfdate = fdate.toISOString()
    let ntdate = tdate.toISOString()
    this.selectedFilter["fromDate"] = nfdate
    this.selectedFilter["toDate"] = ntdate

  }

  clear(){
    this.selectedFilter = {
      recordsby : Constants.nullValue,
      sortby : Constants.nullValue
    };
    if(this.fromDate && this.toDate){
      this.fromDate = null
      this.toDate = null
    }

      this.modalController.dismiss(this.selectedFilter);
  }

  selectFilterRecords(value){
    if(this.selectedFilter.recordsby == value)
      this.selectedFilter.recordsby = Constants.nullValue;
    else
      this.selectedFilter.recordsby = value;
  }

  selectFilterSort(value){
    if(this.selectedFilter.sortby == value)
      this.selectedFilter.sortby = Constants.nullString;
    else
      this.selectedFilter.sortby = value;
  }

  

}
