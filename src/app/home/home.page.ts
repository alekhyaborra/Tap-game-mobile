import { HttpClient } from '@angular/common/http';
import { Component ,OnInit,ElementRef, ViewChild, OnChanges, SimpleChanges, OnDestroy} from '@angular/core';
import {StorageService} from "../sharedServices/storage.service";
// import { AdMob } from '@admob-plus/ionic/ngx';
import { AdmobService } from '../sharedServices/admob.service';
import {AlertServiceService} from '../sharedServices/alert-service.service';
import { Platform } from '@ionic/angular';
import {apiUrls} from '../../app/constants/api-urls';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit,OnDestroy{

  taps:number;
  dailyCount:number;
  userInfo:any;
  tapDiff:number;
  // todayTap:number;
  // isDisabled = false
  // date = new Date()
  previousClickTime: any = new Date();
  lastTappedOn: any;
  currentClickTime: any;
  showReward: boolean =false;
  lastClickTime;
  
  constructor(private storage:StorageService, private http: HttpClient,
    private admob:AdmobService,public platform: Platform,private router:Router,private alertService:AlertServiceService,
    private datePipe: DatePipe
    ) {
      this.platform.pause.subscribe(()=>{
        // if(this.taps%20 !=0){

        // }
        this.http.get(apiUrls.tap+this.taps+"/"+this.userInfo.email+'/'+this.dailyCount).subscribe((res:any)=>{
          console.log(res)
        })
      })
      // this.checkAndUpdateClickCount()
      // const checkTime = this.datePipe.transform(new Date(), 'HH:mm:ss')
      // if(checkTime == '00:00'){
      //   this.dailyCount = 100000
      // }
    }
  ngOnDestroy(): void {
    // this.http.get(apiUrls.tap+this.taps+"/"+this.userInfo.email).subscribe((res:any)=>{
    //   console.log(res)
    // })
  }
  
  ngOnInit(){
    
    this.storage.get("userInfo").then(data=>{
      this.userInfo=data
      console.log(this.userInfo)
      this.http.get(apiUrls.tapCount+ this.userInfo.email).subscribe((res:any)=>{
        this.taps = res?.data?.tapCount;
        this.dailyCount = res?.data?.dailyCount;
        this.lastTappedOn = new Date(res?.data?.lastTappedOn);
        console.log(this.lastTappedOn.toLocaleDateString())
        console.log(new Date().toLocaleDateString())
        
        if(this.lastTappedOn.toLocaleDateString() != new Date().toLocaleDateString()){
          this.dailyCount = 1e5;
        }
        console.log(res)
        this.tapsDiff()
        this.storage.dailyCount = this.dailyCount;
        this.storage.tapCount = this.taps;
   
        // if(!this.tapCount){
        //   this.tapCount = 100000
        // } else {
  
        // }
      })
    
      

    })
    console.log('welcome')
   
  }

  

  // resetClickCount() {
  //   this.tapCount = 0;
  // }

  // private checkAndUpdateClickCount() {
  //   const midnight = new Date();
  //   midnight.setHours(24, 0, 0, 0);

  //   const timeToMidnight = midnight.getTime() - Date.now();

  //   setTimeout(() => {
  //     this.resetClickCount();
  //     this.checkAndUpdateClickCount(); // Start the next interval
  //   }, timeToMidnight);
  // }

 

  // tap(event:any){
  //   console.log('tap working')
  //   this.lastClickTime = new Date()


  //   if(this.tapCount>0){
  //     this.taps = this.taps+1
  //     this.tapCount = this.tapCount-1
  //     this.tapDiff = this.tapDiff-1

  //     if(this.taps%20==0){
  //       this.admob.showInterstitialAd();
  //     }
  //     if(this.taps%25==0){
  //       // this.admob.showVideoAd();
  //     }
  //     if(this.taps%5==0){
  //       this.admob.showBannerAd();
  //     }

  //     // if(this.tapDiff == 0){
  //     //   this.tapDiff = this.tapDiff-1
  //     // }
  //   }


    
    
   
  //   if(this.tapCount == 0  ){
     

  //   }
  //   // console.log(this.tapCount)
  // }

  tap(event:any){
    this.currentClickTime = new Date();
    if(this.dailyCount !==0){
      this.taps = this.taps+1;
      if(this.taps%20==0){
        // this.admob.showInterstitialAd();
      }
      if(this.taps%10==0){
          // this.admob.showBannerAd();
       }
      this.tapsDiff()
      if((this.tapDiff%1000000) == 0){
        this.showReward = true
        this.alertService.presentAlert('Congrats! Now you are eligible for reward.')
      }

      this.dailyCount = this.dailyCount-1
      // this.previousClickTime = this.currentClickTime;
      // this.currentClickTime = new Date();
      // this.currentClickTime = this.datePipe.transform(new Date(), 'HH:mm:ss')
      // if(this.previousClickTime){
      //   if(this.currentClickTime.split(':',2)[0] == '00:00' && (this.currentClickTime.split(':',2)[0]!==this.currentClickTime.split(':',2)[0])){
      //     this.dailyCount = 100000
  
      //   }
      // }
      if(this.previousClickTime.toLocaleDateString() != this.currentClickTime.toLocaleDateString()){
          this.dailyCount = 1e5;
      }

      
      // if(checkTime == '00:00'){
      //   this.dailyCount = 100000
      // }
      
    } else{
      this.alertService.presentAlert('You have reached todays limit')
    }
    this.storage.dailyCount = this.dailyCount;
    this.storage.tapCount = this.taps;
  }

  tapsDiff(){
    const quotient = Math.floor(this.taps/1000000)
        
    this.tapDiff = ((quotient + 1) *1000000) - this.taps ;

  }

 
 


}
