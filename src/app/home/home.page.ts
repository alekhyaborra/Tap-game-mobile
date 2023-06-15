import { HttpClient } from '@angular/common/http';
import { Component ,OnInit,ElementRef, ViewChild, OnChanges, SimpleChanges, OnDestroy} from '@angular/core';
import {StorageService} from "../sharedServices/storage.service";
// import { AdMob } from '@admob-plus/ionic/ngx';
import { AdmobService } from '../sharedServices/admob.service';
import { Platform } from '@ionic/angular';
import {apiUrls} from '../../app/constants/api-urls';



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit,OnChanges,OnDestroy{

  taps:number;
  tapCount:number = 100000;
  userInfo:any;
  tapDiff:number;
  // isDisabled = false
  date = new Date()
  
  constructor(private storage:StorageService, private http: HttpClient,
    private admob:AdmobService,public platform: Platform
    ) {
      this.platform.pause.subscribe(()=>{
        // if(this.taps%20 !=0){

        // }
        this.http.get(apiUrls.tap+this.taps+"/"+this.userInfo.email).subscribe((res:any)=>{
          console.log(res)
        })
      })
    }
  ngOnDestroy(): void {
    this.http.get(apiUrls.tap+this.taps+"/"+this.userInfo.email).subscribe((res:any)=>{
      console.log(res)
    })
  }
  ngOnChanges(changes: SimpleChanges) {
    
  }
  ngOnInit(){
  
    console.log(this.tapCount)
    this.storage.get("userInfo").then(data=>{
      this.userInfo=data
      console.log(this.userInfo)
      this.http.get(apiUrls.tapCount+ this.userInfo.email).subscribe((res:any)=>{
        this.taps = res?.data?.tapCount
        console.log(res)
        
        this.tapDiff = 1000000 - this.taps;
      })

      if(!this.tapCount){
        this.tapCount = 100000
      } else {

      }
      

    })
   
  }

 

  tap(event:any){

    const time = new Date()


    if(this.tapCount>0){
      this.taps = this.taps+1
      this.tapCount = this.tapCount-1
      this.tapDiff = this.tapDiff-1

      if(this.taps%20==0){
        this.admob.showInterstitialAd();
      }
      if(this.taps%25==0){
        // this.admob.showVideoAd();
      }
      if(this.taps%5==0){
        this.admob.showBannerAd();
      }

      if(this.tapDiff == 0){
        this.tapDiff = this.tapDiff-1
      }
    }


    
    
   
    if(this.tapCount == 0  ){
     

    }
    // console.log(this.tapCount)
  }


}
