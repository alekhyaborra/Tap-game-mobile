import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit {

  @Input()
  showNotification;
  @Input()
  notificationData:any;
  notificationDetails;

  @Output()
  sendData : EventEmitter<any> = new EventEmitter<any>();
  @Output()
  closeNotification : EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
    this.notificationDetails = JSON.parse(this.notificationData.notificationObject);
  }

  sendNotificationData(){
    this.sendData.emit(this.notificationData);
  }

  swipeRightEvent(event){
    // this.showNotification = false;
    this.closeNotification.emit();
  }

}
