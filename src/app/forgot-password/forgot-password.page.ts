import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {apiUrls} from '../../app/constants/api-urls';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';





@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  email: string = "";
  password: string="";
  constructor(private http: HttpClient,private router:Router,private toastController:ToastController) { }

  ngOnInit() {
   
  }

  submit(){

    const body = {
      email:this.email,
      password:this.password
    }
    let responseData = this.http.post(apiUrls.forgotPassword, body).pipe(map(res=>res))
    console.log(responseData)
    responseData.subscribe((res:any)=>{
      console.log(res)
      if(res.status == 200){
        this.showToast()
        this.router.navigate(["signin"])
      }

    })
  }

  async showToast(){
    const toast = await this.toastController.create({
      message: 'Password Updated Successfully',
      duration: 500,
      position: 'bottom',
    });

    await toast.present();
  }

  goback(){
    this.router.navigate(["signin"])

  }

}
