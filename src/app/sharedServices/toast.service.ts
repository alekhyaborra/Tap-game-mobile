import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Constants } from '../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  offlineToastEnabled;


  constructor(
    private toastController:ToastController
  ) { }


  


  async showToast(message,duration?) {
    let durtion = duration ? duration : 1000;
    const toast = await this.toastController.create({
      message: message,
      duration: durtion,
      // showCloseButton:true,
      // closeButtonText:" "
      buttons: [
        {
          text: '',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });
    toast.present();
  }

  async showOfflineToast(message,callback){
    if(!this.offlineToastEnabled){
      this.offlineToastEnabled = true;
      const offlinetoast = await this.toastController.create({
        message: message,
        // showCloseButton:true,
        // closeButtonText:Constants.toastCloseText
        buttons: [
          {
            text: Constants.toastCloseText,
            role: 'cancel',
            handler: () => {
            }
          }
        ]
      });
      await offlinetoast.present();
      const { data } = await offlinetoast.onDidDismiss();
      this.offlineToastEnabled = false;
      callback(data);
    }
  }

  async dismissToast(){
    if(this.offlineToastEnabled)
      await this.toastController.dismiss(true);
  }

}
