import { Injectable } from '@angular/core';
import { PopoverController, ModalController } from '@ionic/angular';
import { Constants } from '../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class ModalsService {

  constructor(
    private modalController : ModalController,
    private popoverController: PopoverController
  ) { }

  async openModal(component,cssClass,propertiesObject,callback) {
    const modal = await this.modalController.create({
      component: component,
      componentProps:propertiesObject,
      cssClass:cssClass
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    callback(data);
  }

  async openPopover(component,cssClass,propertiesObject,event,callback){
    const popover = await this.popoverController.create({
      component : component,
      cssClass : cssClass,
      event : (event || Constants.nullValue),
      componentProps : propertiesObject
    })
    await popover.present();
    const { data } = await popover.onDidDismiss();
    callback(data);
  }
  
}
