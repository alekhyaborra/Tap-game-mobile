import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
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
import { DisplayConstants } from '../../constants/constants';

@Component({
  selector: 'app-geometry-object-form',
  templateUrl: './geometry-object-form.page.html',
  styleUrls: ['./geometry-object-form.page.scss'],
})
export class GeometryObjectFormPage implements OnInit, OnDestroy {
  formHeader = '';
  isHistoryView = false;
  ellipsePopoverList: Array<string> = [];
  @ViewChild(DynamicFormComponent) dynamciForm: DynamicFormComponent;
  @ViewChild(FormHeaderComponent) formHeadercomp: FormHeaderComponent;
  backButton: any;
  config = [];
  recordData = {};
  derivedFields = [];
  recordStatus: number;
  showSaveButton = false;
  isHistory = false;
  displayProperties = DisplayConstants.properties;
  constructor(
    private loadingController: LoadingController,
    private platform: Platform,
    private alertController: AlertController,
    private commonService: CommonService,
    private toastService: ToastService,
    private geometryServicesService: GeometryServicesService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.backButton = this.platform.backButton.subscribeWithPriority(2, () => {
      this.presentAlertPrompt();
    });
  }

  ngOnInit() {
    this.isHistory = this.route.snapshot.params.isHistory === 'true' ? true : false;
    if (this.commonService.getGeometryFormSkelton().length === 0) {
      this.geometryServicesService.getGeometryObjectForm(ApiUrls.geometryForm).subscribe(res => {
        this.config = res.data.data;
        this.commonService.setGeometryFormSkelton(res.data.data);
      }, error => {

      });
    } else {
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
      // tslint:disable-next-line:forin
      for (const control in this.dynamciForm.form.controls) {
        this.dynamciForm.form.controls[control].markAsDirty();
      }
      this.formHeadercomp.saveButtonStatus = true;
      this.toastService.showToast(this.displayProperties.invalidFormEntry);
    } else {
      this.commonService.setGeometryFormData(this.dynamciForm.form.getRawValue());
      this.commonService.goBack();
    }
  }

  async presentAlertPrompt() {
    if (this.dynamciForm.form.dirty) {
      const alert = await this.alertController.create({
        message: 'Sure you want to exit',
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
              this.commonService.goBack();
            }
          }
        ]
      });

      await alert.present();
    } else {
      this.commonService.goBack();
    }
  }
}
