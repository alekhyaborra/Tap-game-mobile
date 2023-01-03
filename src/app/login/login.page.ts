import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Constants, DisplayConstants } from '../constants/constants';
import { ApiUrls} from '../constants/api-urls';
import { Device } from '@awesome-cordova-plugins/device/ngx';
import * as CryptoJS from 'crypto-js';
import { LoginService } from './login.service';
import {CommonService} from '../sharedServices/commonServices/common.service' 
import {AlertService} from '../sharedServices/alert.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  user:any = {};
  userName: string;
  password: string;
  logoIcon: string;
  profileIcon: string;
  lockIcon: string;
  usernameRequired: string;
  passwordRequired: string;
  loginPage = true;
  forgotPasswordPage = false;
  cardRotate = false;

  location: any;
  displayProperties = DisplayConstants.properties;
  constructor(private device: Device,private router: Router,
    private loginService: LoginService,
    private commonService: CommonService, private alertService: AlertService,
    ) { }

  ngOnInit() {
    this.logoIcon = Constants.imageIcons.logo;
    this.profileIcon = Constants.imageIcons.profile;
    this.lockIcon = Constants.imageIcons.lock;
    this.usernameRequired = this.displayProperties.usernameRequired;
    this.passwordRequired = this.displayProperties.passwordRequired;
  }
 

  login(formData) {

      this.commonService.showGpsEnableAlert(DisplayConstants.properties.turnOngpsMessage)
    if (formData.invalid) {
      
      return;
    }
   
    this.user.username = this.userName.trim();
    this.user.username = CryptoJS.AES.encrypt(this.user.username, 'F!3LD0N:M@G!KM!ND$').toString();
    
    
    this.user.password = CryptoJS.AES.encrypt(this.password, 'F!3LD0N:M@G!KM!ND$').toString();
    this.user.manufacturer = this.device.manufacturer;
    this.user.model = this.device.model;
    this.user.platform = this.device.platform;
    this.user.UUID = this.device.uuid;
    this.user.version = Constants.appVersion;
    this.user.appVersion = Constants.appVersion;
    this.user.type = 2;
    this.loginService.login(this.user, ApiUrls.login);
    setTimeout(() => {
      this.user.username = ""
      this.user.password = ""
    }, 5000);
  }



  getPassword(formData) {
    if (formData.invalid) {
      return;
    }
    this.loginService.forgotPassword({ username: CryptoJS.AES.encrypt(this.userName, 'F!3LD0N:M@G!KM!ND$').toString(), type: 2 }).subscribe(
      response => {
        if (response.status === 200) {
          this.alertService.presentAlert(response.message);
          this.loginPage = !this.loginPage;
          this.forgotPasswordPage = !this.forgotPasswordPage;
        } else {
          this.alertService.presentAlert(response.message);
        }
      });
  }

  changePage() {
    this.loginPage = !this.loginPage;
    this.forgotPasswordPage = !this.forgotPasswordPage;
    this.cardRotate = true;
  }
  getDDevicesScreen() {
    this.router.navigate(['dashboard/devices']);
  }

  
}
