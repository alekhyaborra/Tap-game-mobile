import { Component, OnInit, Input } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';
import { Router } from '@angular/router';
import { HeaderInputs } from '../header/headerInputs';
import { Constants } from '../../constants/constants';

@Component({
   selector: 'app-ellipse-popover',
   templateUrl: './ellipse-popover.component.html',
   styleUrls: ['./ellipse-popover.component.scss'],
})
export class EllipsePopoverComponent implements OnInit {

   headerInputs: HeaderInputs
   ellipseList = Constants.ellipseListConstants;
   popoverList;

   constructor(private navParams: NavParams,
      private router: Router,
      public popoverController: PopoverController,

   ) {
      this.headerInputs = this.navParams.get("headerInputs");
      this.popoverList = this.navParams.get("popoverList");
   }
   ngOnInit() {
   }

   popoverFunction(item) {
      switch (item) {
         case this.ellipseList.history : {
            this.headerInputs = this.navParams.get("headerInputs");
            this.popoverController.dismiss();
            this.router.navigate(['dashboard/history', this.headerInputs.formId, this.headerInputs.taskId,this.headerInputs.assignmentId])
            break;
         }
         case this.ellipseList.camera : {
            this.popoverController.dismiss(this.ellipseList.camera);
            break;
         }
         case this.ellipseList.gallery : {
            this.popoverController.dismiss(this.ellipseList.gallery);
            break;
         }
         case this.ellipseList.sketching : {
            this.popoverController.dismiss(this.ellipseList.sketching);
            break;
         }
         case this.ellipseList.attachmnet : {
            this.popoverController.dismiss(this.ellipseList.attachmnet);
            break;
         }
         case this.ellipseList.selectAll : {
            break;
         }
         default: {
            break;
         }
      }


   }

}
