import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import {apiUrls} from '../../constants/api-urls';
import { StorageService } from '../../sharedServices/storage.service';
import { Router } from '@angular/router';
import { AlertServiceService } from 'src/app/sharedServices/alert-service.service';




@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {
  rewardEmail = "";
  userInfo: any;
  email:string = '';
  reward:string;
  address:string= "";
  constructor(private modalCtrl: ModalController,private http: HttpClient,private storage:StorageService,private router:Router,private alertService:AlertServiceService) { }

  ngOnInit() {
    this.storage.get("userInfo").then(data=>{
      this.userInfo=data
    })
    this.reward = this.storage.reward
  }

  cancel(){
    this.modalCtrl.dismiss()
  }
  submit(){
    console.log('rewardEmail ::: ', this.rewardEmail);
    // this.http.post(apiUrls.rewardEmail+this.rewardEmail).subscribe((res:any)=>{

    // })
    const body = {
      rewardEmail:this.rewardEmail,
      email:this.userInfo.email
    }
    // this.http.post(apiUrls.rewardEmail, body).subscribe(((res: any) => {
    //   console.log(res);
    
    // }))
    this.http.post(apiUrls.sendEmail,body).subscribe((res:any)=>{
      console.log(res)
      if(res.status = 200){
        this.alertService.presentAlert(`You just placed a Withdrawl for ${this.reward}.You will receive your giftcard in 15 days`)
      }
    })
    console.log(body)
  }



 
  
  

}
