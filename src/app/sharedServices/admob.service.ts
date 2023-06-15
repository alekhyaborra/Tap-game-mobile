import { Injectable } from '@angular/core';
// import { AdMob,BannerAd,InterstitialAd } from '@admob-plus/ionic/ngx';
import {
  AdMobFree,
  AdMobFreeBannerConfig,
  AdMobFreeInterstitialConfig,
  AdMobFreeRewardVideoConfig
} from '@ionic-native/admob-free/ngx';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AdmobService {

  interstitialConfig: AdMobFreeInterstitialConfig = {
    // isTesting: true, // Remove in production
    autoShow: false,
    // id: "ca-app-pub-3940256099942544/1033173712"
    id: "ca-app-pub-2774171578242289/8914696281"

  };

  constructor(public platform: Platform,private admobFree: AdMobFree) {
    platform.ready().then(() => {
      this.admobFree.interstitial.config(this.interstitialConfig);
      this.admobFree.interstitial.prepare()
        .then(() => { }).catch(e => alert(e));
    });
    this.admobFree.on('admob.interstitial.events.CLOSE').subscribe(() => {
      this.admobFree.interstitial.prepare()
        .then(() => {}).catch(e => alert(e));
    });
   }

   showBannerAd(){
    let bannerConfig: AdMobFreeBannerConfig = {
      // isTesting: true, // Remove in production
      autoShow: true,
      bannerAtTop: false,
      // id: "ca-app-pub-3940256099942544/6300978111"
      id: "ca-app-pub-2774171578242289/8611443953"
  };
  this.admobFree.banner.config(bannerConfig);

  this.admobFree.banner.prepare().then(() => {
      // success
  }).catch(e => alert(e));
   }

   showInterstitialAd(){
    this.admobFree.interstitial.isReady().then(() => {
      this.admobFree.interstitial.show().then(() => {
      })
        .catch(e =>alert("show "+e));
    })
      .catch(e =>alert("isReady "+e));
   }
}
