import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GpsDevicesService {

  constructor() { }
   gpsData = {isGPSActive: false};
   setGpsData(gpsDataObj) {
    this.gpsData = gpsDataObj;
   }

   getGpsData() {
    return this.gpsData;
   }
   restGPSData() {
     this.gpsData = {isGPSActive: false};
   }
}
