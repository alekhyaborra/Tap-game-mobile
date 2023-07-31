import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import {StorageService} from "../app/sharedServices/storage.service";



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(  private network: Network, private router:Router,private storage:StorageService
    ) {this.initializeApp();}

    initializeApp(){
      if (this.network.type == "none") {
        this.networkOff();
      } else {
        this.networkOn();
      }
      this.network.onDisconnect().subscribe(() => {
        // if (this.commonService.getApplicationNetworkStatus())
          this.networkOff();
      });
      this.network.onConnect().subscribe(() => {
        this.networkOn();
      });
    }

    networkOn() {
      console.log('network connected')
      this.storage.get("userInfo").then(data=>{
        if(data){
          this.router.navigate(['home'])
        } else{
          this.router.navigate(['signin'])
        }
      })
      // this.storage.get("isNetworkToggleOn").then((status) => {
      //   if (status == true || status == Constants.nullValue) {
      //     this.commonService.setApplicationNetworkStatus(true);
      //     this.commonService.changeNetworkStatus(true);
      //     this.enableBackdrop = false;
      //     this.toastService.dismissToast();
      //   }
      // });
    }

    networkOff() {
      console.log('network disconnected')
      this.router.navigate(['blank-page'])

      // this.storage.get("isNetworkToggleOn").then((status) => {
      //   this.commonService.setApplicationNetworkStatus(false);
      //   if ((status == true || status == Constants.nullValue) && this.commonService.getUserInfo()) {
      //     this.commonService.setApplicationNetworkStatus(false);
      //     this.commonService.changeNetworkStatus(false);
      //     this.enableBackdrop = true;
      //     const that = this;
      //     let messag = Constants.offlineAlert;
      //     if (this.commonService.getFormFillerLoadStatus())
      //       messag = Constants.offlineSaveAlert;
      //     this.toastService.showOfflineToast(messag, function (noNavigation) {
      //       that.enableBackdrop = false;
      //       if (!noNavigation)
      //         that.router.navigate(['dashboard']);
      //     });
      //   }
      // });
    }

}
