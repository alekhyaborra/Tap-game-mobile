import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import {apiUrls} from '../../constants/api-urls';
import { StorageService } from '../../sharedServices/storage.service';
import { Router } from '@angular/router';




@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {
  rewardEmail = "";
  userInfo: any;
  email:string = '';

  constructor(private modalCtrl: ModalController,private http: HttpClient,private storage:StorageService,private router:Router) { }

  ngOnInit() {
    this.storage.get("userInfo").then(data=>{
      this.userInfo=data
    })

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
    })
    console.log(body)
  }



 
  
  

}
