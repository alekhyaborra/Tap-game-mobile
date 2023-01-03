import { Component, OnInit, AfterContentInit, ViewChild } from '@angular/core';
import { Constants } from '../constants/constants';
import { CommonService } from '../sharedServices/commonServices/common.service';
import { ToastService } from '../sharedServices/toast.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalsService } from '../sharedServices/modals.service';
import { MarkerInfoComponent } from '../sharedComponents/marker-info/marker-info.component';
import { LoadingService } from '../sharedServices/loading.service';
import { GeoLocationService } from '../sharedServices/geo-location.service';

declare var google;
@Component({
  selector: 'app-google-maps',
  templateUrl: './google-maps.page.html',
  styleUrls: ['./google-maps.page.scss'],
})
export class GoogleMapsPage implements OnInit {
  map;
  @ViewChild('mapElement') mapElement;
  @ViewChild('seaechElement') seaechElement;
  Coordinates: any;
  workOrders: any;
  layers = {}
  private mapWorkorderSub;
  toolbarButtonConf = { actionStarted: false, drawingType: "", drawStarted: false, finish: false, undo: false, cancel: false }
  public isHistory: boolean = false;
  addressSearchStatus: boolean = false;
  public placeText: string;
  private addressMarker: any;
  
  constructor(
    private commonService: CommonService,
    private toastService: ToastService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: ModalsService,
    private loadingService: LoadingService,
    private geoLocationService: GeoLocationService
  ) { }

  ngOnInit() {
    this.mapWorkorderSub = this.commonService.MapMarkerClikeInviteRef.subscribe(data => {
      if (data) {
        this.commonService.setMapMarkerClikeInvite('', '', '', '', '')
        const savedRecord = data.split(',');
        let selectedWorkOrders = this.commonService.getSelectedObjectToShowOnMap();
        let WO = JSON.parse(JSON.stringify(selectedWorkOrders[Constants.statusNameMap[parseInt(savedRecord[2])].toLowerCase()]));
        let index = WO.findIndex(o => o._id === savedRecord[0]);
        if (parseInt(savedRecord[1]) === Constants.status.saved) {
          //Record is already saved
          if (parseInt(savedRecord[2]) == Constants.status.saved) {
            selectedWorkOrders["saved"][index].properties.markerInfo.displayValue = savedRecord[3];
            WO[index].properties.markerInfo.displayValue = savedRecord[3];
            this.addFeature(4, WO[index])
          } else {
            // Saving new or reassign record.
            WO[index].properties.markerInfo.status = 4
            WO[index].properties.markerInfo.displayValue = savedRecord[3];
            WO[index].properties.markerInfo.offlineId = savedRecord[4];
            selectedWorkOrders["saved"].push(WO[index]);
            selectedWorkOrders[Constants.statusNameMap[parseInt(savedRecord[2])]].splice(index, 1);
            this.removeFeature(savedRecord[2], savedRecord[0])
            this.addFeature(4, WO[index])
          }
        } else {
          if (this.commonService.getSelectedWorkordersCount()) {
            this.commonService.setSelectedWorkordersCount(this.commonService.getSelectedWorkordersCount() - 1)
          }
          selectedWorkOrders[Constants.statusNameMap[parseInt(savedRecord[2])]].splice(index, 1);
          this.removeFeature(savedRecord[2], savedRecord[0])
        }
        this.commonService.setSelectedObjectToShowFromMap(selectedWorkOrders)
      }

    })
  }

  removeFeature(layerType, recordId) {
    var that = this;
    this.layers[Constants.statusNameMap[parseInt(layerType)]].forEach(function (feature) {
      if (recordId == feature.getProperty('markerInfo').recordId)
        that.layers[Constants.statusNameMap[parseInt(layerType)]].remove(feature);
    });
  }

  addFeature(layerType, futureData) {
    var future = new google.maps.Data.Feature({
      geometry: new google.maps.Data.Point({ lat: futureData.geometry.coordinates[1], lng: futureData.geometry.coordinates[0] }),
      id: futureData._id,
      properties: futureData.properties
    })
    this.layers[Constants.statusNameMap[parseInt(layerType)]].add(future);

    this.layers[Constants.statusNameMap[parseInt(layerType)]].toGeoJson(function (o) {
    })
  }

  ngOnDestroy() {
    this.mapWorkorderSub.unsubscribe();
  }

  ngAfterContentInit(): void {
    var that = this;
    this.map = new google.maps.Map(
      this.mapElement.nativeElement,
      {
        center: that.Coordinates || Constants.googleMapCenterPoint,
        zoom: 8,
        zoomControl: false,
        fullscreenControl: false,
        mapTypeControl: false,
      });
    this.addworkOrdersOnMap();
    var bounds = new google.maps.LatLngBounds();
    this.workOrders = this.commonService.getSelectedObjectToShowOnMap();
    let bountCount = 0;
    for (let workOrderType in this.workOrders) {
      if (this.workOrders[workOrderType].length > 0) {
        for (var i = 0; i < this.workOrders[workOrderType].length; i++) {
          bountCount++;
          let a = this.workOrders[workOrderType][i].geometry.coordinates[1];
          let b = this.workOrders[workOrderType][i].geometry.coordinates[0];
          let point = new google.maps.LatLng(a, b);
          bounds.extend(point);
          }
        }
      }
    if(bountCount > 0)
      this.map.fitBounds(bounds)
    
    
    // Create the search box and link it to the UI element.
    var searchBox = new google.maps.places.SearchBox(this.seaechElement.nativeElement);
    that.map.controls[google.maps.ControlPosition.TOP_LEFT].push(this.seaechElement.nativeElement);

    // Bias the SearchBox results towards current map's viewport.
    that.map.addListener('bounds_changed', function() {
      searchBox.setBounds(that.map.getBounds());
    });

    that.addressMarker = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function() {
      var places = searchBox.getPlaces();

      if (places.length == 0) {
        return;
      }

      that.clearOldMarkers();

      // For each place, get the icon, name and location.
      var bounds = new google.maps.LatLngBounds();
      places.forEach(function(place) {
        if (!place.geometry) {
          return;
        }
        var icon = {
          url: place.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25)
        };

        // Create a marker for each place.
        that.addressMarker.push(new google.maps.Marker({
          map: that.map,
          icon: icon,
          title: place.name,
          position: place.geometry.location
        }));

        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      that.map.fitBounds(bounds);
    });


  }
  addworkOrdersOnMap() {
    let totalMarkesCount: number = 0;
    this.workOrders = this.commonService.getSelectedObjectToShowOnMap();
    for (let workOrderType in this.workOrders) {
      let value = this.workOrders[workOrderType];
      totalMarkesCount = totalMarkesCount + value.length;
      switch (workOrderType) {
        case "new": {
          this.addLayerProcess(value, "new");
          break;
        }
        case "re-assign": {
          this.addLayerProcess(value, "re-assign");
          break;
        }
        case "saved": {
          this.addLayerProcess(value, "saved");
          break;
        }
        default: {
          //statements; 
          break;
        }
      }
    }
    if (totalMarkesCount != this.commonService.getSelectedWorkordersCount())
      this.toastService.showToast(Constants.noLocationForWorkorders);
  }

  addLayerProcess(value, type) {
    let mapData = {}
    mapData['type'] = "FeatureCollection";
    mapData['features'] = value;

    var that = this;
    this.layers[type] = new google.maps.Data({ map: that.map });
    this.layers[type].addGeoJson(mapData);
    this.layers[type].addListener('click', function (event) {
      that.markerClickProcess(event)
    });
    this.layers[type].toGeoJson(function (o) {
    })
  }

  markerClickProcess(e) {
    var markerInfo = e.feature.h['markerInfo'];
    markerInfo['taskId'] = this.route.snapshot.params.taskId;
    markerInfo['assignmentId'] = this.route.snapshot.params.assignmentId;
    this.modalService.openModal(MarkerInfoComponent, "map-modal", { "markerInfo": markerInfo }, function (data) {

    })

  }

  selectedMapAction(actionSelected) {
    switch (actionSelected) {
      case Constants.geometryActionTypes.gotoLocation: {
        this.gotoCurrentLocation()
        break;
      }
      case Constants.geometryActionTypes.addressSearch: {
        this.findAddress();
        break;
      }
      default: {
        //statements; deleteSelectedGeomtry
        break;
      }
    }
  }

  gotoCurrentLocation(){   
    try {
      this.clearOldMarkers();
    } catch (error) {      
    } 
    this.loadingService.present()
    this.geoLocationService.getLatLong().then((data) => {
      this.loadingService.dismiss()
      let bounds = new google.maps.LatLngBounds();
      let pos = {
        lat: data.coords.latitude,
        lng: data.coords.longitude
      };
      this.map.setCenter(pos);
      let point = new google.maps.LatLng(pos.lat, pos.lng);
      bounds.extend(point);
      this.map.fitBounds(bounds);
      let that = this;
      var listener = google.maps.event.addListener(that.map, "idle", function() { 
        //if (that.map.getZoom() > 16) that.map.setZoom(16); 
        that.map.setZoom(18); 
        google.maps.event.removeListener(listener); 
      });
      
    }, (error) => {
      this.loadingService.dismiss()
      this.toastService.showToast(Constants.unableToGetLocation);
    })
    
  }

  findAddress(){
    this.addressSearchStatus = true;
  }

  closeAddressSearch(){
    this.placeText = '';
    this.addressSearchStatus = false;
    try {
      this.clearOldMarkers();
    } catch (error) {      
    }
  }

  clearAddressText(){
    this.placeText = '';
  }

  clearOldMarkers(){
    // Clear out the old markers.
    this.addressMarker.forEach(function(marker) {
      marker.setMap(null);
    });
    this.addressMarker = [];
  }
  
  goBack() {
    this.commonService.goBack();
  }
}

