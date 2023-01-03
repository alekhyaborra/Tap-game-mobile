import { Component, OnInit, ContentChild } from '@angular/core';
import { IonInput } from '@ionic/angular';
import { Constants } from 'src/app/constants/constants';

@Component({
  selector: 'app-show-hide-password',
  templateUrl: './show-hide-password.component.html',
  styleUrls: ['./show-hide-password.component.scss'],
})
export class ShowHidePasswordComponent implements OnInit {

  showPassword = false;
  eyeOnIcon: string;
  eyeOffIcon: string;
@ContentChild(IonInput) input: IonInput;

  constructor() { }

  toggleShow() {
    this.showPassword = !this.showPassword;
    this.input.type = this.showPassword ? 'text' : 'password';
  }

  ngOnInit() {
    this.eyeOnIcon = Constants.imageIcons.eyeOn;
    this.eyeOffIcon = Constants.imageIcons.eyeOff;
  }

}
