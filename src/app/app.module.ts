import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';


import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';


import { FormsModule } from '@angular/forms';

// import { ApiUrls } from './constants/api-urls';
import { Constants } from './constants/constants';

import { IonicStorageModule} from '@ionic/storage-angular';
import { ToastController } from '@ionic/angular';


import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';

import { HttpClientModule } from '@angular/common/http';
import { AdMobFree } from '@ionic-native/admob-free/ngx';
import { AdmobService } from './sharedServices/admob.service';

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
    
    ],
  providers: [
    // ApiUrls, 
    AndroidPermissions,
   
    Constants,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    ToastController,
    Geolocation,
    AdMobFree,
    AdmobService
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
