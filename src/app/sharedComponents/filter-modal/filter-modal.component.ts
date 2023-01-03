import { Component, OnInit } from '@angular/core';
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
  selectedFilter;
  headerConstants = Constants.modalHeader;

  constructor(
    public modalController: ModalController,
    private navParams : NavParams
  ) { }

  ngOnInit() {
    this.filterObject = this.navParams.get("filterObject");
    this.selectedFilter = this.navParams.get("selectedFilter");
  }

  close(){
    this.modalController.dismiss();
  }

  applyFilter(){
    this.modalController.dismiss(this.selectedFilter);
  }

  clear(){
    this.selectedFilter = {
      recordsby : Constants.nullValue,
      sortby : Constants.nullValue
    };
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
