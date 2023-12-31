import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { Network } from '@awesome-cordova-plugins/network/ngx';

 
import { CommonModule } from '@angular/common'; 
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
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx'
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
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
    AdmobService, 
    Network,
    SocialSharing

    
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
