import { Injectable } from '@angular/core';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { Diagnostic } from '@awesome-cordova-plugins/diagnostic/ngx';

@Injectable({
  providedIn: 'root'
})
export class GeoLocationService {
  latLng: any;

  constructor(
    private geolocation: Geolocation,
    private diagnostic : Diagnostic,
  ) { }
   
  getLatLong() {
    return this.geolocation.getCurrentPosition({ timeout: 500000, enableHighAccuracy: true });
  }
  getLatLongChecks() {
    let successCallback = (isAvailable) => {
      if(isAvailable){

        return this.geolocation.getCurrentPosition({ timeout: 500000, enableHighAccuracy: true });
      }else{
        return null
      }
    }
    let errorCallback = (e) => console.error(e);
    return this.diagnostic.isLocationEnabled().then(successCallback).catch(errorCallback);
  }
}
