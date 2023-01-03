import { CommonService } from './../sharedServices/commonServices/common.service';
import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { BluetoothSerial } from '@awesome-cordova-plugins/bluetooth-serial/ngx';
import { ChangeDetectorRef } from '@angular/core';
import { Constants, DisplayConstants } from '../constants/constants';
import { ToastController } from '@ionic/angular';
import { GpsDevicesService } from '../sharedServices/gps-devices.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-blue-tooth-devices',
  templateUrl: './blue-tooth-devices.page.html',
  styleUrls: ['./blue-tooth-devices.page.scss'],
  providers: [BluetoothSerial]
})
export class BlueToothDevicesPage {
  pairedList: pairedlist;
  listToggle = false;
  pairedDeviceIndex: number = null;
  hrmsAccuracy: any;
  vrmsAccuracy: any;
  refresh = Constants.refresh;
  selectedDeviceRef: any;
  dataSend = '';
  gpsObject = {};
  GPGGA;
  GPVTG;
  GPZDA;
  GPRMC;
  GPGSA;
  GLGSV;
  GPGST;
  displayProperties = DisplayConstants.properties;
  gpsDeviceHeader = this.displayProperties.gpsDeviceHeading;
  constructor(private bluetoothSerial: BluetoothSerial,
    private Controller: ToastController,
    private gpsDevicesService: GpsDevicesService,
    private commonService: CommonService,
    private route: Router,
    private toastController: ToastController
  ) {
    const gpsDataInfo = this.gpsDevicesService.getGpsData();
    if(gpsDataInfo.isGPSActive){
     this.gpsObject = gpsDataInfo;
     this.pairedDeviceIndex = gpsDataInfo['deviceId'];
     this.listToggle = true;
    }
    this.checkBluetoothEnabled();
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    console.log(this.route.url.includes('devices'));
    // console.log('gpssssssss paramsss');
  }
  doRefresh(event) {
    this.checkBluetoothEnabled();
    event.target.complete();
  }
  checkBluetoothEnabled() {
    this.bluetoothSerial.isEnabled().then(success => {
      this.listPairedDevices();
    }, error => {
      this.presentToast('Please enable bluetooth');
    });
  }

  listPairedDevices() {
    this.bluetoothSerial.list().then(success => {
      this.pairedList = success;
      this.listToggle = true;
    }, error => {
      this.presentToast('Please enable bluetooth');
      this.listToggle = false;
    });
  }

  selectDevice(connectedDevice) {
    this.selectedDeviceRef =  connectedDevice;
    this.pairedDeviceIndex = connectedDevice.id;
    if (!connectedDevice.address) {
      this.presentToast('Select paired device to connect');
      return;
    }
    const address = connectedDevice.address;
    const name = connectedDevice.name;

    this.connect(address);
  }

  connect(address) {
    this.presentToast('Connection intiated...');
    // Attempt to connect device with specified address, call app.deviceConnected if success
    this.bluetoothSerial.connect(address).subscribe(success => {
      this.gpsObjectDefaults();
      this.deviceConnected();
     // this.showToast('Successfully Connected');
      this.presentToast('Successfully connected');
    }, error => {
      this.presentToast('Unable to connect device');
      this.pairedDeviceIndex = null;
      this.gpsObjectDefaults();
      this.gpsDeviceStauschangeInObjcet();
    });
  }

  deviceConnected() {
    // Subscribe to data receiving as soon as the delimiter is read
    this.bluetoothSerial.subscribe('\n').subscribe(success => {
      this.handleData(success);
      // this.showToast('Connected Successfullly');
    }, error => {
      this.gpsObjectDefaults();
      this.gpsDeviceStauschangeInObjcet();
      this.pairedDeviceIndex = null;
      this.presentToast('Unable to connect device');
    });
  }

  deviceDisconnected() {
    // Unsubscribe from data receiving
    this.bluetoothSerial.disconnect();
    this.presentToast('Device disconnected');
    this.gpsObjectDefaults();
    this.gpsDevicesService.restGPSData();
    this.pairedDeviceIndex = null;
    // this.showToast('Device Disconnected');
  }

  handleData(data) {
    this.showToast(data);
  }
  showToast(msj) {
    const msgData = msj.split(',');
    if (msgData[0] === '$GPRMC') {
      this.GPRMC = msj;
    } else if (msgData[0] === '$GPGGA') {
      if(this.route.url.includes('devices')) {
        this.presentToast('Capturing data from device....');
      }
      this.GPGGA = msj;
      const ggaLatObj = this.getDegreesMinsSecs(msgData[2]);
      this.gpsObject['lat'] = this.ConvertDMSToDD( ggaLatObj['degress'], ggaLatObj['mins'] + '.' + ggaLatObj['secs'], 'N' );
      const ggaLongObj = this.getDegreesMinsSecs( msgData[4]);
      this.gpsObject['long'] =  this.ConvertDMSToDD( ggaLongObj['degress'], ggaLongObj['mins'] + '.' + ggaLongObj['secs'], 'E' );
      this.GPGGA  =  this.gpsObject['lat'] + '-' +   this.gpsObject['long'];
      this.gpsObject['time']  = msgData[1];
    } else if (msgData[0] === '$GPVTG') {
      this.GPVTG = msj;
    } else if (msgData[0] === '$GPZDA') {
      this.GPZDA = msj;
    }  else if (msgData[0] === '$GPGSA') {
      this.GPGSA = msj;
    } else if (msgData[0] === '$GLGSV') {
      this.GLGSV = msj;
    } else if (msgData[0] === '$GPGST') {
      // this.GPGST = msj;
      this.gpsObject['hrmsAccuracy'] = this.getHrmAccuracy(msj);
      this.gpsObject['vrmsAccuracy'] = this.getVrmAccuracy(msj);
    }
    this.gpsObject['isGPSActive'] = true;
    this.gpsObject['deviceId'] = this.selectedDeviceRef.id;
    this.gpsDevicesService.setGpsData(this.gpsObject);
  }
  getVrmAccuracy(msg) {
    const msgArr = msg.split(',');
    const vrms = msgArr[8].split('*');
    return vrms[0];

  }
  getHrmAccuracy(msg) {
    const msgArr = msg.split(',');
    return Math.sqrt( Math.pow(parseFloat(msgArr[6]),2) +  Math.pow(parseFloat(msgArr[7]),2));

  }
  getDegreesMinsSecs(cordinate) {
    const latArr = cordinate.split('.');
    const obj = {};
    const fractor = latArr[0].toString();
    const decimal = latArr[1];
    obj['degress'] = fractor.slice(0, fractor.length - 2 );
    obj['mins'] = fractor.slice(fractor.length - 2, fractor.length );
    obj['secs'] = decimal;
    return obj;
  }
  ConvertDMSToDD(degrees, minutes, direction) {
    // tslint:disable-next-line:radix
    // let  dd = parseInt(degrees) + parseInt(minutes) / 60 + parseInt(seconds) / (60 * 60);
    // tslint:disable-next-line:radix
    let dd = parseInt(degrees) + (parseFloat(minutes) / 60);
    if (direction === 'S' || direction === 'W') {
        dd = dd * -1;
    } // Don't do anything for N or E

    return dd;
}
async presentToast(msg) {
  const toast = await this.toastController.create({
    message: msg,
    duration: 2000
  });
  toast.present();
}

gpsObjectDefaults() {
  this.gpsObject['lat'] = '00.0000';
  this.gpsObject['long'] = '00.0000';
  this.gpsObject['hrmsAccuracy'] = '0.00';
  this.gpsObject['vrmsAccuracy'] = '0.00';
  this.gpsObject['isGPSActive'] = false;

}

gpsDeviceStauschangeInObjcet() {
  this.gpsObject['isGPSActive'] = false;
  this.gpsDevicesService.setGpsData(this.gpsObject);
}

goBack(){
  this.commonService.goBack();
}


}

// tslint:disable-next-line:class-name
interface pairedlist {
  'class': number;
  'id': string;
  'address': string;
  'name': string;
  'deviceId': string;
}
