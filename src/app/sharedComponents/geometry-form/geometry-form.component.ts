import { Component, OnInit, ViewChild } from '@angular/core';
import { DynamicFormComponent } from '../../dynamic-form/containers/dynamic-form/dynamic-form.component';
import { AlertController, LoadingController, Platform } from '@ionic/angular';
import { CommonService } from '../../sharedServices/commonServices/common.service';
import { FieldConfig } from '../../dynamic-form/models/field-config.interface';
import { ToastService } from '../../sharedServices/toast.service';
import { Constants } from '../../constants/constants';
import { ApiUrls } from '../../constants/api-urls';
import { GeometryServicesService } from './geometry-services.service';
import { FormHeaderComponent } from '../../sharedComponents/form-header/form-header.component';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-geometry-form',
  templateUrl: './geometry-form.component.html',
  styleUrls: ['./geometry-form.component.scss'],
})
export class GeometryFormComponent implements OnInit {
  formHeader: string = "";
  isHistoryView: boolean = false;
  ellipsePopoverList: Array<string> = [];
  @ViewChild(DynamicFormComponent) dynamciForm: DynamicFormComponent;
  @ViewChild(FormHeaderComponent) formHeadercomp: FormHeaderComponent;
  backButton: any;
  config = [];
  recordData = {};
  derivedFields = [];
  recordStatus: number;
  showSaveButton: boolean = false;
 

  constructor(
    private loadingController: LoadingController,
    private platform: Platform,
    private alertController: AlertController,
    private commonService: CommonService,
    private toastService: ToastService,
    private geometryServicesService: GeometryServicesService,
    private route: ActivatedRoute,
    private router: Router,
    private modalController: ModalController
  ) {
    this.backButton = this.platform.backButton.subscribeWithPriority(2, () => {
      this.presentAlertPrompt();
    });
  }

  ngOnInit() {
    if (this.commonService.getGeometryFormSkelton().length == 0) {
      let deptId=this.commonService.getUserInfo().groupid
      this.geometryServicesService.getGeometryObjectForm(ApiUrls.geometryForm+"/"+deptId+"/point").subscribe(res => {
        this.config = res.data.data;
        this.commonService.setGeometryFormSkelton(res.data.data);
      }, error => {

      })
    }
    else{
      this.config = this.commonService.getGeometryFormSkelton();
    }
    this.recordData = this.commonService.getGeometryProperties(); 
  }
  ngOnDestroy() {
    this.backButton.unsubscribe();
  }

  getFilledFormData(event) {
    if (!this.dynamciForm.valid) {
      this.dynamciForm.form.markAsDirty();
      for (let control in this.dynamciForm.form.controls) {
        this.dynamciForm.form.controls[control].markAsDirty();
      };
      this.formHeadercomp.saveButtonStatus = true;
      this.toastService.showToast(Constants.invalidFormEntry);
    } else {
      //this.commonService.setGeometryFormData(this.dynamciForm.form.getRawValue());
      this.modalController.dismiss({    
        'data': this.dynamciForm.form.getRawValue()    
      });
    }
  }

  async presentAlertPrompt() {
    if (this.dynamciForm.form.dirty) {
      const alert = await this.alertController.create({
        message: 'Sure you want to exit?',
        buttons: [
          {
            text: 'No',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
            }
          }, {
            text: 'Yes',
            handler: (data) => {
              this.modalController.dismiss({               
              });
            }
          }
        ]
      });

      await alert.present();
    } else {
      this.modalController.dismiss({        
      });
    }
  }

  popUpClose() {
    this.AlertForFormFill();
  }

  async AlertForFormFill() {
    if (this.dynamciForm.form.dirty) {
      const alert = await this.alertController.create({
        message: 'Sure you want to exit?',
        buttons: [
          {
            text: 'No',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
            }
          }, {
            text: 'Yes',
            handler: (data) => {
              this.modalController.dismiss({ });
            }
          }
        ]
      });

      await alert.present();
    } else {
      this.modalController.dismiss({ });
    }
  }
}
