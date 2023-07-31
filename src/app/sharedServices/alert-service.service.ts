import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';



@Injectable({
  providedIn: 'root'
})
export class AlertServiceService {

  constructor(public alertController: AlertController,private toastController: ToastController) { }
  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: 'bottom',
    });

    await toast.present();
  }
}
