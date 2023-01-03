import { Component, OnInit } from '@angular/core';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
import { Constants, DisplayConstants } from '../constants/constants';
import { CommonService } from '../sharedServices/commonServices/common.service';
import { ToastService } from '../sharedServices/toast.service';
import { ModalsService } from '../sharedServices/modals.service';
import { MarkerInfoComponent} from './marker-info/marker-info.component';
import { Router, ActivatedRoute } from '@angular/router';
import { DataModalComponent } from './data-modal/data-modal.component';
import { ModalController } from '@ionic/angular';
import { GeoLocationService } from '../sharedServices/geo-location.service';
import { LoadingService } from '../sharedServices/loading.service';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
  providers: [ModalsService]
})
export class MapPage implements OnInit {
  
  workOrders = {};
  private mapWorkorderSub;
  constructor(private commonService: CommonService,
              private toastService: ToastService,
              private modalService: ModalsService,
              private route: ActivatedRoute,
              private router: Router,
              private modalController: ModalController,
              private loadingService: LoadingService,
              private geoLocationService: GeoLocationService
            ) { }
  Coordinates: any;
  watch: any;
  map: mapboxgl;
  showObject = false;
  icon = Constants.imageIcons;
  geocoder: any;
  toolbarButtonConf = { actionStarted: false, drawingType: '', drawStarted: false, finish: false, undo: false, cancel: false };
  isHistory = false;
  addressSearchStatus = false;
  displayProperties = DisplayConstants.properties;

  ngOnInit() {
    this.executemap();
    this.mapWorkorderSub = this.commonService.MapMarkerClikeInviteRef.subscribe(data => {
      if (data) {
        const savedRecord = data.split(',');
        const selectedWorkOrders = this.commonService.getSelectedObjectToShowOnMap();
        // tslint:disable-next-line:radix
        if (parseInt(savedRecord[1]) === Constants.status.saved) {
         this.layerUpdatingProcess(selectedWorkOrders, savedRecord, Constants.status.saved, savedRecord[2]);

        } else {

          this.layerUpdatingProcess(selectedWorkOrders, savedRecord, Constants.status.submitted, savedRecord[2]);
        }
      }
    });

  }
  ngOnDestroy() {
    this.mapWorkorderSub.unsubscribe();
  }
  layerUpdatingProcess(selectedWorkOrders, savedRecord, type, prvsObjectStatus) {
    // tslint:disable-next-line:radix
    const layerObjects = selectedWorkOrders[Constants.statusName[parseInt(prvsObjectStatus)].toLowerCase()];
    const index = layerObjects.findIndex(o => o._id === savedRecord[0]);
    let savedObjcet;
    if (index !== -1) {
      savedObjcet = layerObjects.splice(index, 1);
      try {
        // tslint:disable-next-line:radix
        this.removeObjectFromNewLayer(layerObjects, Constants.statusName[parseInt(prvsObjectStatus)]);
        if (Constants.status.saved === type) {
           savedObjcet[0].properties.markerInfo.status = 4;
           savedObjcet[0].properties.markerInfo.displayValue = savedRecord[3];
           savedObjcet[0].properties.markerInfo.offlineId = savedRecord[4];

           this.addNewLayerInSavedLayer(savedObjcet);
        }
       } catch (error) {
       }
    }
  }

  removeObjectFromNewLayer(newLayerObjects, prvsLayer) {
    const layer = prvsLayer.toLowerCase();
    this.map.removeLayer(layer);
    this.map.removeSource(layer);
    this.addLayerProcess(newLayerObjects, layer, 'marker-15');
  }

  addNewLayerInSavedLayer(layerObjects) {
    const selectedWorkOrders = this.commonService.getSelectedObjectToShowOnMap();
    const savedLayerObjcetList = selectedWorkOrders[Constants.statusName[Constants.status.saved].toLowerCase()];
    savedLayerObjcetList.push(layerObjects[0]);
    this.map.removeLayer('saved');
    this.map.removeSource('saved');
    this.addLayerProcess(savedLayerObjcetList, 'saved', 'marker-15');
  }


  executemap() {
    // Set bounds to New York, New York
    const bounds = [
      [68.1097, 6.4626999], // Southwest coordinates
      [97.39535869999999, 35.513327]  // Northeast coordinates
    ];
    /*Initializing Map*/
    mapboxgl.accessToken = Constants.mapboxAccessToken;
    this.map = new mapboxgl.Map({
      container: 'map', // container id
      style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
      center: this.Coordinates || Constants.mapCenterPoint, // starting position [lng, lat]
      zoom: Constants.mapStartZoom// starting zoom,
  });
    const that = this;

    this.map.on('load', function () {
      that.addworkOrdersOnMap();
      let bountCount = 0;
      // tslint:disable-next-line:no-shadowed-variable
      const bounds = new mapboxgl.LngLatBounds();
      for (const workOrderType in that.workOrders) {
        if (that.workOrders[workOrderType].length > 0) {
          for (let i = 0; i < that.workOrders[workOrderType].length; i++) {
            bountCount++;
            bounds.extend(that.workOrders[workOrderType][i].geometry.coordinates);
          }
        }
      }

      if (bountCount > 0) {
        that.map.fitBounds(bounds);
      }
      that.map.on('click', 'new', function (e) {
        that.markerClickProcess(e);

      });

      that.map.on('click', 'saved', function (e) {
        that.markerClickProcess(e);

      });
      that.map.on('click', 're-assign', function (e) {
        that.markerClickProcess(e);
      });
    });
  }

  markerClickProcess(e) {
    const coordinates = e.features[0].geometry.coordinates.slice();
    const markerInfo = JSON.parse(e.features[0].properties.markerInfo);
    markerInfo['taskId'] = this.route.snapshot.params.taskId;
    markerInfo['assignmentId'] = this.route.snapshot.params.assignmentId;
    this.modalService.openModal(MarkerInfoComponent, 'map-modal', {'markerInfo': markerInfo}, function (data) {

    });
  }
  addworkOrdersOnMap() {
    let totalMarkesCount = 0;
    this.workOrders = this.commonService.getSelectedObjectToShowOnMap();
    // tslint:disable-next-line:forin
    for (const workOrderType in this.workOrders) {
      const value = this.workOrders[workOrderType];
      totalMarkesCount = totalMarkesCount + value.length;
      switch (workOrderType) {
        case 'new': {
          this.addLayerProcess(value, 'new', 'marker-15');
          break;
        }
        case 're-assign': {
          this.addLayerProcess(value, 're-assign', 'marker-15');
          break;
        }
        case 'saved': {
          this.addLayerProcess(value, 'saved', 'marker-15');
          break;
        }
        default: {
          // statements;
          break;
        }
      }
    }
    if (totalMarkesCount !== this.commonService.getSelectedWorkordersCount()) {
      this.toastService.showToast(this.displayProperties.noLocationForWorkorders);
    }
  }

  addLayerProcess(value, layerName, icon) {
    const layers = {};
    layers[layerName] = {};
    layers[layerName]['type'] = 'FeatureCollection';
    layers[layerName]['features'] = value;

    this.map.addSource(layerName, {
      'type': 'geojson',
      'data': layers[layerName]
    });

    this.map.addLayer({
      'id': layerName,
      'type': 'symbol',
      'source': layerName,
      'layout': {
        'icon-image': icon,
        'icon-size': 4.25
      },
      'paint': {
        /*"text-size": 10,*/
      }
    });
  }

  goBack() {
    // let that = this;
    // this.map.removeControl(that.geocoder);
    this.commonService.goBack();
  }
  showObjects() {
    if (this.showObject) {
      this.showObject = false;
    } else {
      this.showObject = true;
    }
  }
  showObjectsClose() {
    this.showObject = false;
  }
  drawOnMap() {
    this.showObject = false;
    this.openModal();
  }
  async openModalbkp() {
   const modal = await this.modalController.create({
      component: DataModalComponent,

    });
    modal.present();
  }


  async openModal() {
    const componentProps = {
      Header: this.displayProperties.dataModelHeading,
    };

    this.modalService.openModal(DataModalComponent, '', componentProps, function(data) {
    });
  }


  selectedMapAction(actionSelected) {
    switch (actionSelected) {
      case Constants.geometryActionTypes.gotoLocation: {
        this.gotoCurrentLocation();
        break;
      }
      case Constants.geometryActionTypes.addressSearch: {
        this.findAddress();
        break;
      }
      default: {
        // statements; deleteSelectedGeomtry
        break;
      }
    }
  }

  gotoCurrentLocation() {
    const that = this;
    this.closeAddressSearch();
    this.loadingService.present();
    this.geoLocationService.getLatLong().then((data) => {
      this.loadingService.dismiss();
      // var bounds = new mapboxgl.LngLatBounds();
      // bounds.extend([data.coords.longitude,data.coords.latitude]);
      // this.map.fitBounds(bounds)
      // this.map.setZoom(15)
      this.map.flyTo({
        center: [data.coords.longitude, data.coords.latitude],
        zoom: 18,
      });
    }, (error) => {
      this.loadingService.dismiss();
      this.toastService.showToast(Constants.unableToGetLocation);
    });

  }

  findAddress() {
    this.addressSearchStatus = true;
    const that = this;
    try {
      this.map.removeControl(that.geocoder);
    } catch (e) {
    }

    this.geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      placeholder : this.displayProperties.addressSearchText
    });
    this.map.addControl(this.geocoder);
  }

  closeAddressSearch() {
    const that = this;
    this.addressSearchStatus = false;
    try {
      this.map.removeControl(that.geocoder);
    } catch (e) {
    }
  }
}


