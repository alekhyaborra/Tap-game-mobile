import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
//import { text } from '@angular/core/src/render3';
@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private storage: Storage) { }
  
  

  storeUserInfo(userInfo) {
    this.storage.set("userInfo", userInfo);
  }

  mapInfo(mapInfo) {
    this.storage.set("mapInfo", mapInfo);
  }
  appVersion:any;

  storeVersionApp(version) {
    this.appVersion = version
    // this.storage.set('appVersion', version);
   }

   getStoreAppVersion() {
     return this.appVersion
    //  return  this.storage.get('appVersion');
   }
}
