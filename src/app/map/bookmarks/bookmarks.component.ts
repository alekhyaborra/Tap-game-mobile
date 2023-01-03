import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { BookmarkModelComponent } from '../bookmark-model/bookmark-model.component';
import { Constants } from '../../constants/constants';
import { BookmarksService } from './bookmarks.service';
import { CommonService } from '../../sharedServices/commonServices/common.service';
import { BookmarkData } from './bookmark-info';
import { LoadingService } from '../../sharedServices/loading.service';
@Component({
  selector: 'app-bookmarks',
  templateUrl: './bookmarks.component.html',
  styleUrls: ['./bookmarks.component.scss'],
})
export class BookmarksComponent implements OnInit {

  icon: any=Constants.imageIcons;
  bookmarks: Array<any> = [];
  data: BookmarkData = {
    bookmarkName: '',
    northEast: null,
    southWest: null,
    zoomLevel: null,
    userId: ''
  };
  @Input() viewBookmark: any;
  @Input() northEast: any;
  @Input() southWest: any;
  @Input() zoomLevel: any;
  @Output()
  closeBookmarks: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output()
  searchBookmark: EventEmitter<any> = new EventEmitter<any>();

  constructor( private modalController: ModalController,
                private alertController: AlertController,
                private commonService: CommonService,
                private loadingService: LoadingService,
                private bookmarkService: BookmarksService ) { 
                  this.bookmarks = [];
                }

  ngOnInit() {
    this.data.northEast = this.northEast;
    this.data.southWest = this.southWest;
    this.data.zoomLevel = this.zoomLevel;
    this.data.userId = this.commonService.getUserInfo()._id;
    this.getBookmarks();
  }

  getBookmarks(){
    if(!this.loadingService.isLoading){
      this.loadingService.present();
    }
    this.bookmarkService.loadBookmarks().subscribe((res) => {
      this.bookmarks = res;
      if(this.loadingService.isLoading){
        this.loadingService.dismiss();
      }
    }, err => { this.showAlert('Bookmark', err); 
        if(this.loadingService.isLoading){
          this.loadingService.dismiss();
        }
   });
  }

  async openModal(properties, button_name, value){
    const modal = await this.modalController.create({
      component: BookmarkModelComponent,
      cssClass: 'addBookmark',
      // cssClass: 'map-modal',
      componentProps: {
        name: properties,
        button_name: button_name,
        value: value
      }
    });
    modal.onWillDismiss().then( (data) => {
      if(data.data && data.data.action=='Add'){
        this.data.bookmarkName = data.data.currentValue;
        this.addBookmark(this.data);
      } 
      else if(data.data && data.data.action=='Update'){
        let preValue = {};
        let currentValue = {};
        this.data.bookmarkName = data.data.preValue;
         preValue = {bookmarkName: data.data.preValue, 
                        northEast: this.data.northEast, 
                        southWest: this.data.southWest,
                        zoomLevel: this.data.zoomLevel,
                        userId: this.data.userId};
        this.data.bookmarkName = data.data.currentValue;
        currentValue = this.data;
        currentValue = {bookmarkName: data.data.currentValue, 
          northEast: this.data.northEast, 
          southWest: this.data.southWest,
          zoomLevel: this.data.zoomLevel,
          userId: this.data.userId};
        this.updateBookmark(preValue, currentValue);
      }
      else {
        
      }
    }).catch((err) => {
      
    });
    return await modal.present();
  }

  closeBookmark(closeBookmark){
    // this.closeBookmarks.emit(closeBookmark);
    this.modalController.dismiss();
  }

  addBookmark(value){
    this.loadingService.present();
    this.bookmarkService.addToBookmarks(value).subscribe((res) => {
      this.showAlert('Add Bookmark', res);
      this.getBookmarks();
    }, err => {
      this.showAlert('Add Bookmark', err);
      if(this.loadingService.isLoading){
        this.loadingService.dismiss();
      }
    });
  }

  updateBookmark(preValue, currentValue){
    this.loadingService.present();
    this.bookmarkService.updateToBookmarks(preValue, currentValue).subscribe((res) => {
      this.showAlert('Update Bookmark', res);
      this.getBookmarks();
    }, err => {
      this.showAlert('Update Bookmark', err); 
      if(this.loadingService.isLoading){
        this.loadingService.dismiss();
      }
   });
  }
  
  deleteBookmark(value){
    this.loadingService.present();
    this.bookmarkService.deleteBookmark(value).subscribe((res) => {
        this.showAlert('Delete Bookmark', res);
        this.getBookmarks();
    }, (err) => {
      this.showAlert('Delete Bookmark', err);
      if(this.loadingService.isLoading){
        this.loadingService.dismiss();
      }
    })
  }

  assetSearch(search){
    this.modalController.dismiss(search);
  }

 async showAlert(header, message){
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
    return alert.present();
  }

}
