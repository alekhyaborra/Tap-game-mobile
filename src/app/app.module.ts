import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@awesome-cordova-plugins/splash-screen/ngx';
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
//import { NgChartsModule } from 'ng2-charts'; //Narendra
import { ChartsModule } from 'ng2-charts';
import { FormsModule } from '@angular/forms';
import { LoadingService} from './sharedServices/loading.service'
import { AlertService } from './sharedServices/alert.service'
import { ApiUrls } from './constants/api-urls';
import { Constants } from './constants/constants';
//import { IonicStorageModule } from '@ionic/storage';
import { IonicStorageModule} from '@ionic/storage';
import { ToastController } from '@ionic/angular';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { GeoLocationService } from './sharedServices/geo-location.service';
import { FCM } from 'cordova-plugin-fcm-with-dependecy-updated/ionic/ngx';
//import { FCM } from '@awesome-cordova-plugins/fcm/ngx';
import { SharedComponentModule } from './sharedComponents/shared-component.module';
import { ModalsService } from './sharedServices/modals.service';
import { WebView } from '@awesome-cordova-plugins/ionic-webview/ngx';
import { DataSync } from '@awesome-cordova-plugins/data-sync/ngx';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { LocalNotifications } from '@awesome-cordova-plugins/local-notifications/ngx';
import { BackgroundGeolocation } from '@awesome-cordova-plugins/background-geolocation/ngx';
import { LocationAccuracy } from '@awesome-cordova-plugins/location-accuracy/ngx';
import { Chooser } from '@awesome-cordova-plugins/chooser/ngx';
import { FilePath } from '@awesome-cordova-plugins/file-path/ngx';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
import { Base64 } from '@ionic-native/base64/ngx';
import { Diagnostic } from '@awesome-cordova-plugins/diagnostic/ngx';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { Device } from '@awesome-cordova-plugins/device/ngx';
import { HttpClientModule } from '@angular/common/http';
import { BluetoothSerial } from '@awesome-cordova-plugins/bluetooth-serial/ngx';
//import {CanvasWhiteboardModule} from '../lib/ng2-canvas-whiteboard';
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    IonicStorageModule.forRoot(),
    SharedComponentModule,
    ChartsModule,  //Narendra
   // CanvasWhiteboardModule
    ],
  providers: [
    StatusBar,
    SplashScreen,
    HTTP,
    LoadingService,
    AlertService,
    ApiUrls, AndroidPermissions,
    LocationAccuracy,
    Constants,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    ToastController,
    SQLite,
    Geolocation,
    GeoLocationService,
    Network,
    FCM,
    ModalsService,
    WebView,
    DataSync,
    BackgroundGeolocation,
    Chooser,
    FilePath,
    InAppBrowser,
    FileOpener,
    Base64,
    Diagnostic,
    Device,
    LocalNotifications,
    BluetoothSerial
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
