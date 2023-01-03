import { Component, OnInit, Input, Output, EventEmitter, NgZone } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CommonService } from '../../sharedServices/commonServices/common.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
@Component({
  selector: 'app-find-route',
  templateUrl: './find-route.component.html',
  styleUrls: ['./find-route.component.scss'],
})
export class FindRouteComponent implements OnInit {

  @Input() viewFindRoute: any;
  @Output()
  closeFindRoute: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output()
  srcCurrentLocation: EventEmitter<string> = new EventEmitter<string>();
  srcCoords: any;
  destCoords: any;
  srcSubscribe: any;
  destSubscribe: any;
  coordsForm: FormGroup;
  constructor( private geolocation: Geolocation,private iab: InAppBrowser, private ngZone: NgZone, private fb: FormBuilder,
    private commonService: CommonService, private modalController: ModalController ) { 
      this.coordsForm = this.fb.group({
        src: {value:'', disabled: true},
        dest: {value:'', disabled: true}
      });
    }

  ngOnInit() {
    this.getSrc();
    this.getDest();
  }

  getSrc(){
  this.srcSubscribe = this.commonService.srcCoords.subscribe((src) => {
    this.ngZone.run(() => {
      if(src){
        this.srcCoords = src;
        this.coordsForm.get('src').setValue(this.srcCoords);
      }
      else {
        this.srcCoords = '';
        this.coordsForm.get('src').setValue(this.srcCoords);
      }
    })
    })
  }
  getDest(){
   this.destSubscribe = this.commonService.destCoords.subscribe((dest) => {
    this.ngZone.run(() => {
      if(dest){
        this.destCoords = dest;
        this.coordsForm.get('dest').setValue(this.destCoords);
      }
      else{
        this.destCoords = '';
        this.coordsForm.get('dest').setValue(this.destCoords);
      }
    });
    })
  }

  closeRoute(){
    // this.closeFindRoute.emit(closeRoute);
    if(this.srcSubscribe){
      this.srcSubscribe.unsubscribe();
    }
    if(this.destSubscribe){
      this.destSubscribe.unsubscribe();
    }
    this.modalController.dismiss(false);
  }

  findRoute(){
    let source = this.coordsForm.get('src').value;
    let destination = this.coordsForm.get('dest').value;
    var url = 'http://maps.google.com/maps?saddr='+source+'&daddr='+destination;
			window.open(url, "_system", 'location=yes');
  }

  getCurrentLocation(){
    this.geolocation.getCurrentPosition().then((resp) => {
      // 
      // this.srcCurrentLocation.emit(resp.coords.latitude+ ", "+resp.coords.longitude);
      this.commonService.setSrcCoords(resp.coords.latitude+ ", "+resp.coords.longitude);
      this.commonService.setCurrentCoords(resp.coords.latitude+ ", "+resp.coords.longitude);
     }).catch((error) => {
       
     });
  }

}
