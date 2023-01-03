import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { observable, Observable } from 'rxjs';
import { BehaviorSubject, Subject } from 'rxjs';
import { BookmarkData } from '../bookmarks/bookmark-info';
import { RestApiService } from '../../sharedServices/rest-api.service';
import { ApiUrls } from '../../constants/api-urls';
import { CommonService } from '../../sharedServices/commonServices/common.service';
import { Constants } from '../../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class BookmarksService {
  // bookmarks: Array<string> = [];
  bookmarks: Array<BookmarkData> = [];
  copiedValue = new Subject();
  mapInteractionSearch = new Subject();
  mapInteractionSearchValue: string = '';
  constructor( private storage: Storage, private restApiService: RestApiService, private commonService: CommonService ) { 
    this.loadBookmarks();
  }

  mapInteraction(value){
    return this.copiedValue.next(value);
  }
  setMapInteraction(value){
    return this.mapInteractionSearchValue = value;
  }
  getMapInteraction(){
    return this.mapInteractionSearchValue;
  }
  addToBookmarks(bookmarks_id): Observable<any>{
    return new Observable((observer) => {
      if(bookmarks_id.bookmarkName){
        let index = this.bookmarks.findIndex((res) => {
          return res.bookmarkName === bookmarks_id.bookmarkName;
        });
        if(index >= 0){
          observer.error("we already have "+ bookmarks_id.bookmarkName+ " as bookmark")
        }
        else{
          const url = ApiUrls.addBookmark
          this.restApiService.postServiceProcess(url, bookmarks_id).subscribe((res: any) => {
            if(res && res.status === 200){
              observer.next(res.message);
            }
            else if(res && res.status === 500){
              observer.error(res.message);
            }
            else {
              observer.error(Constants.internalServerProblem);
            }
          })
          // this.bookmarks.push(bookmarks_id);
          // this.setStorage('bookmarks', this.bookmarks).subscribe((res) => {
          //   // this.bookmarks = res;
          //   observer.next(this.bookmarks);
          //   }, err => {
          //      observer.error(err);
          //     });
        }
      }
      else {
        observer.error("Empty values are not Accepted");
      }
    });
  }

  updateToBookmarks(preValue, currentValue): Observable<any>{
    return new Observable((observer) => {
      if(currentValue.bookmarkName){
        // let index = this.bookmarks.indexOf(preValue);
        let index = this.bookmarks.findIndex((res) => {
          return res.bookmarkName === preValue.bookmarkName;
        });
      // let indexOfExisting = this.bookmarks.indexOf(currentValue);
      let indexOfExisting = this.bookmarks.findIndex((res) => {
        return res.bookmarkName === currentValue.bookmarkName;
      });
      if(indexOfExisting >= 0){
        observer.error("we already have "+ currentValue.bookmarkName + " as bookmark")
      }
      else {
        const url = ApiUrls.editBookmark + "/" + preValue.bookmarkName + "/" + currentValue.bookmarkName + "/" + this.commonService.getUserInfo()._id;
          this.restApiService.getServiceProcess(url).subscribe((res: any) => {
            if(res && res.status === 200){
              observer.next(res.message);
            }
            else if(res && res.status === 500){
              observer.error(res.message);
            }
            else {
              observer.error(Constants.internalServerProblem);
            }
          }, (err) => { observer.error(Constants.internalServerProblem);})
        // this.bookmarks[index] = currentValue;
      //   this.setStorage('bookmarks', this.bookmarks).subscribe((res) => {
      //         // this.bookmarks = res;
      //         observer.next(this.bookmarks);
      //   }, err => {
      //     observer.error(err);
      // });
      }
      }
      else {
        observer.error("Empty values are not Accepted");
      }      
    });
  }

  // setStorage(key: any, value: any): Observable<any>{
  //   return new Observable((observer) => {
  //     this.storage.set(key, value).then((res) => {
  //       observer.next(res);
  //     }).catch((err) => {
        
  //       observer.error(err);
  //     });
  //   })
  // }

  loadBookmarks(): Observable<any>{
    return new Observable((observer) => {
      const url = ApiUrls.getBookmark + "/" + this.commonService.getUserInfo()._id;
      this.restApiService.getServiceProcess(url).subscribe((res: any) => {
        if(res && res.status === 200){
          this.bookmarks = res.data;
          observer.next(this.bookmarks);
        }
        else if(res && res.status === 500){
          observer.error(res.message);
        }
        else if(res && res.status === 208){
          this.bookmarks = [];
          observer.next(this.bookmarks);
        }
        else {
          observer.error(Constants.internalServerProblem)
        }
      }, (err) =>{ observer.error(Constants.internalServerProblem);});
      // this.storage.get('bookmarks').then((res) => {
      //   if(res){
      //     this.bookmarks = res;
      //   }
      //   else {
      //     this.bookmarks = [];
      //   }
      //   observer.next(this.bookmarks);
      // }).catch((err) => {
      //   observer.error(err);
      // });
    });
  }

  deleteBookmark(bookmark_id): Observable<any>{
    // let index = this.bookmarks.indexOf(bookmark_id);
    let that = this;
    let index = this.bookmarks.findIndex((res) => {
      return res.bookmarkName === bookmark_id.bookmarkName;
    });
    if(index >= 0){
      return new Observable((observer) => {
        this.bookmarks.splice(index, 1);
        const url = ApiUrls.deleteBookmark + "/" + bookmark_id.bookmarkName + "/" + this.commonService.getUserInfo()._id;
      this.restApiService.getServiceProcess(url).subscribe((res: any) => {
        if(res.status === 200){
          // this.bookmarks = res.data;
          observer.next(res.message);
        }
        else if(res.status === 500){
          observer.error(res.message);
        }
        else {
          observer.error(Constants.internalServerProblem);
        }
      }, (err) =>{ observer.error(Constants.internalServerProblem);});
        // this.setStorage('bookmarks', this.bookmarks).subscribe((res) => {
        //   this.bookmarks = res;
        //   observer.next(this.bookmarks);
        //   }, err => {
        //      observer.error(err);
        //     });
      }) 
    }
    else{
    }
  }

  selectedFeature(feature){
    return this.mapInteractionSearch.next(feature);
  }

}
