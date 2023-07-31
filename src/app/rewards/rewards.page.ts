import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import {ModalComponent} from './modal/modal.component'
import { HttpClient } from '@angular/common/http';
import {apiUrls} from '../constants/api-urls';
import { StorageService } from '../sharedServices/storage.service';


@Component({
  selector: 'app-rewards',
  templateUrl: './rewards.page.html',
  styleUrls: ['./rewards.page.scss'],
})
export class RewardsPage implements OnInit {
  @Input() showReward:boolean;
  amazon:string="Amazon gift coupon";
  mynthra:string = "Mynthra gift coupon";
  bigBasket="Bigbasket gift coupon";
  flipkart="Flipkart gift coupon";
  solana="Solana gift coupon";
  icons=[
        "../../assets/rewards_icons/amazon_updated.jpeg",
        "../../assets/rewards_icons/bigbasket_updated.jpeg",
        "../../assets/rewards_icons/flipkart_updated.jpeg",
        "../../assets/rewards_icons/mynthra_updated.jpeg",
        "../../assets/rewards_icons/solana_updated.jpeg"
      ]

  rewards:any
  dateTime: string;
  time: string;
  date: string;
  userInfo: any;
  

  constructor(private router:Router,private modalController: ModalController,private http: HttpClient,private storage:StorageService) { }

  ngOnInit() {
    this.rewards=[this.amazon,this.bigBasket,this.flipkart,this.mynthra,this.solana]
    this.storage.get("userInfo").then(data=>{
      this.userInfo=data
    })
  }

  goback(){
    this.router.navigate(["home"])
  }

  async presentModal(i) {
    if(this.showReward){
      const modal = await this.modalController.create({
        component: ModalComponent, 
        componentProps: {},
        cssClass:'modalComponent',
        showBackdrop: true,
        backdropDismiss: true
      });
      this.rewardsHistory(i)

      return await modal.present();

    }
   
  }

  rewardsHistory(i){
    const currentDate = new Date();
    this.dateTime = currentDate.toString();
    console.log(currentDate)
    console.log(this.dateTime)
    this.time = currentDate.toLocaleTimeString();
    this.date = currentDate.toLocaleDateString();
    console.log(i)
    console.log(this.time)
    console.log(this.date)
    const body={
      date:this.date,
      time:this.time,
      reward:this.rewards[i],
      email:this.userInfo.email
    }
    this.http.post(apiUrls.rewardDetails,body).subscribe((res:any)=>{
      console.log(res)
    })

  }

}
