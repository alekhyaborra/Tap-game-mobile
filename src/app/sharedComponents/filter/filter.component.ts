import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FilterModalComponent } from '../filter-modal/filter-modal.component';
import { ModalController } from '@ionic/angular';
import { CommonService } from '../../sharedServices/commonServices/common.service';
import { Constants } from '../../constants/constants';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent implements OnInit {

  @Input()
  filterObject;
  @Input()
  selectedFilter;
  @Output()
  filterByInHeader : EventEmitter<any> = new EventEmitter<any>();
  imageIcons = Constants.imageIcons;

  constructor(
    private modalController : ModalController,
    private commonService : CommonService
  ) { 
  }

  ngOnInit() {
  }

  openFilter(){
    this.commonService.setFilterData(JSON.parse(JSON.stringify(this.selectedFilter)));
    this.presentModal();
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: FilterModalComponent,
      componentProps:{
        filterObject : this.filterObject,
        selectedFilter : this.selectedFilter
      },
      cssClass:'common-filter-modal'
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if(data)
      this.filterByInHeader.emit(data);
    else if(data == undefined)
      this.selectedFilter = this.commonService.getFilterData();
  }

}
