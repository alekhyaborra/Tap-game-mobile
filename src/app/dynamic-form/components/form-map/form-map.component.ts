import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { Field } from '../../models/field.interface';
import { FieldConfig } from '../../models/field-config.interface';
import { widgetKeys } from '../../object-keys-constants';
import { FormDataDistributionService } from '../../form-data-distribution.service';
import { GeoLocationService } from '../../../sharedServices/geo-location.service';
import { ToastService } from "../../../sharedServices/toast.service";
import { Constants, DisplayConstants } from 'src/app/constants/constants';
import { Router } from '@angular/router';
import { CommonService } from '../../../sharedServices/commonServices/common.service'
import { OsmPage } from 'src/app/osm/osm.page';
import { LocationAccuracy } from '@awesome-cordova-plugins/location-accuracy/ngx';

@Component({
  selector: 'app-form-map',
  templateUrl: './form-map.component.html',
  styleUrls: ['./form-map.component.scss'],
})
export class FormMapComponent implements Field {
  @ViewChild(OsmPage) osmNavigation;
  config: FieldConfig;
  group: FormGroup;
  widgetKey: any;
  groupName: any;
  expendedHeaderId: any;
  derivedFields: any;
  derivedFieldsCopy: any;
  isDerivedField: boolean = false;
  bOSubscribe: any;
  data: any;
  tableWidgetId: any;
  tableWidgetIndex: any;
  isTable:boolean;
  historyView:boolean;
  gpsSubscriber:any;
  geoLoactionWidgetId: any;
  capturedLatlongs: any;


  constructor(
    private formDataDistributionService: FormDataDistributionService,
    private geoLocationService: GeoLocationService,
    private toastService: ToastService,
    private router: Router,
    private commonService: CommonService,
    private locationAccuracy : LocationAccuracy
  ) {
    this.widgetKey = widgetKeys.keys;
  }

  get tableWidgetArray() {
    return this.group.get(this.tableWidgetId) as FormArray;
  }

  ngOnInit() {



    this.locationAccuracy.canRequest().then((canRequest: boolean) => {

      if(canRequest) {
        // the accuracy option will be ignored by iOS
        this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
          () => console.log('Request successful'),
          error => console.log('Error requesting location permissions', error)
        );
      }
    
    });


    this.gpsSubscriber = this.commonService.gpsToggle.subscribe((status)=>{
      try{
        if(status && status['latlong'] && status['widgetId']==this.geoLoactionWidgetId){
          let latLong = status['latlong']
          this.group.get(this.geoLoactionWidgetId).setValue(latLong.split(',')[0]+','+latLong.split(',')[1]);
          this.capturedLatlongs = latLong.split(',')[0]+','+latLong.split(',')[1];
         
        }
        
      } catch(error){

      }
    })
    let locationValue = this.group.get(this.config[widgetKeys.keys._id]).value ? this.group.get(this.config[widgetKeys.keys._id]).value : '';
    this.group.get(this.config[widgetKeys.keys._id]).setValue(locationValue);
    this.bOSubscribe = this.formDataDistributionService.hederOpen.subscribe(expendedHeaderId => {
      this.expendedHeaderId = expendedHeaderId;
    });
  }

  getLocation(id) {
    this.commonService.showGpsEnableAlert(DisplayConstants.properties.turnOngpsMessage)
    console.log(this.config['isEnableMap']);
    this.geoLoactionWidgetId = id;
    if (!this.historyView && !this.config[widgetKeys.keys.disabled]) {
    this.geoLocationService.getLatLong().then((resp) => {
      this.geoLocationService.latLng = resp.coords.latitude + ',' + resp.coords.longitude;
      let latLong = this.geoLocationService.latLng;
      if(this.group.get(id).value)
        latLong = this.group.get(id).value
      this.commonService.setGeoTagNumbers(latLong)
      if(this.config['isEnableMap'] == true){
        this.naviagteToMap('mapNavigation', id)
      } else {
        this.group.get(id).setValue(this.geoLocationService.latLng);
      }
    }).catch((error) => {
      this.toastService.showToast(Constants.unableToGetLocation);
    });
  }
  }
 naviagteToMap(data,id){
  this.commonService.setMapWidgetId(this.config[widgetKeys.keys._id]);
  this.router.navigate(['dashboard/tasksList/osm',data,id]);
 }
  ngOnDestroy() {
    if (this.bOSubscribe) {
      this.bOSubscribe.unsubscribe();
    }
    this.gpsSubscriber.unsubscribe();
  }
}
