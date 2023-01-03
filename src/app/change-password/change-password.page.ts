
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormControl } from '@angular/forms';
import { ChangePasswordServiceService } from './change-password-service.service';
import { CommonService } from '../sharedServices/commonServices/common.service';
import { Constants, DisplayConstants } from '../constants/constants';
import * as CryptoJS from 'crypto-js';

export class PasswordValidator {
  displayProperties = DisplayConstants.properties;
  static isMatching(group: FormGroup) {
    const firstPassword = group.controls['password'].value;
    const secondPassword = group.controls['confirmPassword'].value;
    if (firstPassword !== secondPassword) {
      group.controls['confirmPassword'].setErrors({ 'pw_mismatch': true });
      return { 'pw_mismatch': true };
    } else {
      group.controls['confirmPassword'].setErrors(null);
      return Constants.nullValue;
    }
  }
}


@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {
  public asFormControl = (formControl: AbstractControl): FormControl =>
  formControl as FormControl;
  displayProperties = DisplayConstants.properties;
  hideHeaderButtons = true;
  changePasswordHeader = 'Change Password';
  ellipsePopoverList: Array<string> = [];
  user: any = [];
  newpassword: string;
  registerForm: FormGroup;
  email: any;
  password: any;
  oldpassword: any;
  confirmPassword: any;
  type: any;

  constructor(
    private formBuilder: FormBuilder,
    private changePwdService: ChangePasswordServiceService,
    private commonService: CommonService
    
    
    ) {
      const pwdPattern = '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$#!%*?&])[A-Za-z\d$@$!%*?&].{8,15}';

     this.registerForm = formBuilder.group({
      'oldpassword': ['', [Validators.required]],
      'password': ['', [Validators.required, Validators.pattern(pwdPattern)]],
      'confirmPassword': ['', [Validators.required]]
    }, { 'validator': PasswordValidator.isMatching, 'verify': this.verifyPassword }
    );

    this.oldpassword = this.registerForm.controls['oldpassword'];
    this.password = this.registerForm.controls['password'];
    this.confirmPassword = this.registerForm.controls['confirmPassword'];
  }
  
  verifyPassword(event) {
    const tempPassword = this.registerForm.controls['oldpassword'].value;
    if (tempPassword && tempPassword.length > 0) {
      this.changePwdService.pwdCheckforChangePassword(tempPassword).subscribe(
        response => {
          const checkdata = response.data;
          if (event.returnValue === true && checkdata.status === false) {
            const firstPassword = this.registerForm.controls['oldpassword'].value;
            this.registerForm.controls['oldpassword'].setErrors({ 'wrongPassword': true });
            return { 'wrongPassword': true };
          }
        });
    }
  }
  checkOldNew() {

    if (this.oldpassword.value === this.password.value) {
      this.registerForm.controls['password'].setErrors({ 'oldNewPasswordErr': true });
          return { 'oldNewPasswordErr': true };
    }
  }
  changePassword() {
    const data = {};
    data['userId'] = this.commonService.getUserInfo()._id;
    data['type'] = this.commonService.getUserInfo().type;
    data['oldpassword'] = CryptoJS.AES.encrypt(this.oldpassword.value, 'F!3LD0N:M@G!KM!ND$').toString();
    data['newpassword'] = CryptoJS.AES.encrypt(this.password.value, 'F!3LD0N:M@G!KM!ND$').toString();
    this.changePwdService.changePassword(data);
  }

  ngOnInit() {

  }

}

