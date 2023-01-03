import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Constants, DisplayConstants } from '../constants/constants';
import { CommonService } from '../sharedServices/commonServices/common.service';
import { ToastService } from '../sharedServices/toast.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalsService } from '../sharedServices/modals.service';
import { MarkerInfoComponent } from '../sharedComponents/marker-info/marker-info.component';
import { SketchingToolComponent } from '../sharedComponents/sketching-tool/sketching-tool.component';
import { ModalController, Platform, AlertController } from '@ionic/angular';
import { GeometryFormComponent } from '../sharedComponents/geometry-form/geometry-form.component';
import { GeoLocationService } from '../sharedServices/geo-location.service';
import { LoadingService } from '../sharedServices/loading.service';
import { FormGroup, FormArray } from '@angular/forms';
import { FieldConfig } from '../../app/dynamic-form/models/field-config.interface'
import { widgetKeys } from '../dynamic-form/object-keys-constants';
import { FormMapComponent } from '../dynamic-form/components/form-map/form-map.component';
import { ApiUrls } from '../constants/api-urls';
import { RestApiService } from '../sharedServices/rest-api.service';
import { BookmarksComponent } from '../map/bookmarks/bookmarks.component';
import { FindRouteComponent } from '../map/find-route/find-route.component';
import { LowerCasePipe } from '@angular/common';
import { FormControl } from "@angular/forms";
import { FormsService } from '../forms/forms.service';
import {MeasuringToolComponent} from '../map/measuring-tool/measuring-tool.component'

// import * as L from 'leaflet';
declare var L: any;
@Component({
  selector: 'app-osm',
  templateUrl: './osm.page.html',
  styleUrls: ['./osm.page.scss'],
})
export class OsmPage implements OnInit {
  latLngOfDrag: any;
  config: FieldConfig;
  group: FormGroup;
  widgetKey: any;
  private map: any;
  private workOrders: any;
  private layers = {};
  private mapWorkorderSub: any;
  public fromForm: any;
  private geometryGroup: any;
  private featureInfoData: any;
  private taskId: any;
  // color:'black';
  private options = {
    options: {
      create: {
        polygon: {
          // metric: true,
          //showArea: true,
          allowIntersection: false, // Restricts shapes to simple polygons
          // drawError: {
          //   color: '#e1e100',
          //   message: '<strong>Oh snap!<strong> you can\'t draw that!',
          // },
          
          shapeOptions: {
            color: null,
            fillColor:'red',
            stroke:true,
            weight: null
            // color: 'pink'
          }
        },
        polyline: {
          //metric: true,
          showArea: false,
          showLength:true,
          shapeOptions: {
            // color: null,
            color: '#0095ea',
            // weight: null,
            weight: 3,
            opacity: 0.5,
            fillColor:'red',
            fill:true
            // stroke:false
          }
        },
        marker: {
          // icon: new L.DivIcon({
          //   iconSize: new L.Point(20, 20),
          //   className: 'leaflet-div-icon'
          // }),
          // shapeOptions: {
          //   color: 'blue',
          //   fill: true
          // }
        }
      },
      edit: {
        featureGroup: null,
        selectedPathOptions: {
          color: 'blue',
          opacity: 0.6,
          weight: 4,
          fill: true,
          fillColor: 'blue',
          fillOpacity: 0.1
        }
      }
    }
  };
  theMarker: any;
  searchBy: string = Constants.nullValue
  limit: number = Constants.assetRecordsLimit;
  offset: number;
  assetFormsList:any[]
  markersArray: Array<Object> = [];
  public interactionHandler;
  @ViewChild("map")
  public mapElement: ElementRef;
  toolbarButtonConf = { actionStarted: false, drawingType: "", drawStarted: false, finish: false, undo: false, cancel: false }
  public drawingModeOn: boolean = false;
  public deleteGeometryMode: boolean = false;
  @ViewChild(SketchingToolComponent) sketchingToolComponent: SketchingToolComponent;
  public sketchingMenu: boolean = false;
  public leeafletGeometryId = '';
  public geometryReference;
  public geometryFormDataBO;
  public isHistory: boolean = false;
  public geocoder: any;
  public addressSearch: any;
  public addressSearchStatus: boolean = false;
  displayProperties = DisplayConstants.properties;
  backButton: any;
  dragLatLongString: any;
  draggedLatLngs: any;
  url: string;
  values = []
  mapType:any;
  public viewBookmark: boolean = false;
  showSearch: boolean;
  assetSearchList: Array<any> = [];
  searchValue: string = '';
  leafletLayerIds: Array<any> = [];
  actionType: string = '';
  private viewFindRoute: boolean = false;
  srcCoords = '';
  destCoords = '';
  formId: any = null;
  activeLayersArray: any;
  overlayLayers: any;
  activeLayerUrlsArray: any;
  public searchControl: FormControl;
  constructor(
    private commonService: CommonService,
    private toastService: ToastService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: ModalsService,
    private modalController: ModalController,
    private geoLocationService: GeoLocationService,
    private loadingService: LoadingService,
    private platform: Platform,
    private alertController: AlertController,
    private constants: Constants,
    private restApiService: RestApiService,
    private lowerCase: LowerCasePipe,
private formService: FormsService
  ) {
    this.widgetKey = widgetKeys.keys;
    this.assetSearchList = [];
    this.searchControl = new FormControl();
  }


  ngOnInit() {
this.mapType = this.commonService.getMapType()
    this.taskId = this.commonService.getTaskId();
    this.formId = this.commonService.getFormId();
    // this.taskId = this.route.snapshot.params['taskId']
    // let locationValue = this.group.get(this.config[widgetKeys.keys._id]).value ? this.group.get(this.config[widgetKeys.keys._id]).value : '';
    // this.group.get(this.config[widgetKeys.keys._id]).setValue(locationValue);
    // back button action hadnling 

    this.backButton = this.platform.backButton.subscribeWithPriority(2, () => {
      this.saveGeometry();
    });




    this.isHistory = this.route.snapshot.params.isHistory == 'true' ? true : false;
    this.fromForm = this.route.snapshot.params.fromForm;
    if (this.fromForm != 'true') {
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
            } else {
              // Saving new or reassign record.
              WO[index].properties.markerInfo.status = 4
              WO[index].properties.markerInfo.displayValue = savedRecord[3];
              WO[index].properties.markerInfo.offlineId = savedRecord[4];
              selectedWorkOrders["saved"].push(WO[index]);
              selectedWorkOrders[Constants.statusNameMap[parseInt(savedRecord[2])]].splice(index, 1);
            }
          } else {
            if (this.commonService.getSelectedWorkordersCount()) {
              this.commonService.setSelectedWorkordersCount(this.commonService.getSelectedWorkordersCount() - 1)
            }
            selectedWorkOrders[Constants.statusNameMap[parseInt(savedRecord[2])]].splice(index, 1);
          }
          let that = this;
          if (this.map.hasLayer(this.layers['new']))
            this.layers['new'].clearLayers();
          if (this.map.hasLayer(this.layers['re-assign']))
            this.layers['re-assign'].clearLayers();
          if (this.map.hasLayer(this.layers['saved']))
            this.layers['saved'].clearLayers();
          this.addworkOrdersOnMap()
          this.commonService.setSelectedObjectToShowFromMap(selectedWorkOrders)
        }
      })
    }
    else {
      this.geometryGroup = L.featureGroup();
    }
  }

  ngOnDestroy() {
    if (this.fromForm != 'true')
      this.mapWorkorderSub.unsubscribe();
    else {
      //this.geometryFormDataBO.unsubscribe();
      this.commonService.setGeometryFormSkelton([]);
    }
    if(this.backButton)
    this.backButton.unsubscribe();
    
    if (this.toolbarButtonConf.actionStarted) {

    }
  }
  
  getLayers(baseLayers) {
    let that = this;
    const overlays = {​​​​}​​​​;
    that.activeLayersArray = [];
    that.activeLayerUrlsArray = [];
    if((this.taskId || this.formId)){
      let url;
      if(this.taskId){
         url = ApiUrls.getLayersForTask + '/' + this.taskId;
      }
      else if(this.formId){
         url = ApiUrls.getLayersForForm + '/' + this.formId;
      }
      else{
        url = null;
      }
      if(url !== null){ 
       
        this.restApiService.getServiceProcess(url​​​​).subscribe((res: any = {}) => {​​​​
          // this.osmService.getStaticLayers(url​​​​).subscribe((res: any = {}) => {​​​​
                    if (res.status === 200) {
                      const layersDetailsObj = res.data;  
                      layersDetailsObj.forEach((layerItem, index) => {​​​
                        if (layerItem.layerType === 'wms') {
                                  // this.map.fitBounds(this.map.getBounds(), { paddingBottomRight: [150, 0] });
                                  overlays[layerItem.externalName] = L.tileLayer.wms(layerItem.layerUrl, {
                                    layers: layerItem.internalName,
                                    layerCode: layerItem.layerCode,
                                    transparent: true,
                                    zIndex: 100,
                                    format: 'image/png',
                                    uppercase: true,
                                    minZoom:5,
                                    maxZoom: 22,
                                    type: layerItem.layerType,
                                    url:layerItem.layerUrl
                                  });
                                  // overlays[layerItem.externalName].addTo(that.map);
                                  } else if (layerItem.layerType === 'wmts') {
                                    overlays[layerItem.externalName] = L.tileLayer(layerItem.layerUrl, {
                                      attribution: layerItem.internalName,
                                      type: layerItem.layerType,
                                      layerCode: layerItem.layerCode,
                                      format: 'image/png',
                                      url:layerItem.layerUrl,
                                      minZoom:5,
                                      maxZoom: 22
                                    });
                                    
                                  }

                                  if(!that.isHistory){
                                    overlays[layerItem.externalName].addTo(that.map);
                                    
                                    if(!that.activeLayersArray.includes(layerItem.layerCode)){
                                      that.activeLayersArray.push(layerItem.layerCode);
                                    }
                                  }    
                        if (index == layersDetailsObj.length-1) {​​​​
                          that.addLayer(baseLayers, overlays);
                        }​​​​
                      }​​​​);
                     }​​​​
                     else if(res.status === 204){
                      that.addLayer(baseLayers, overlays);
                     }
                     else{
                      that.addLayer(baseLayers, overlays);
                     }
                  }​​​​);
      }
    }
    else {
      that.addLayer(baseLayers, overlays);
  }

     // when a layer is added we will push the added layer into array
   // that.activeLayersArray = [];
   that.map.on('layeradd', function (e) {
    try {
      // this.activeLayersArray = e['layer']['_map']['_layers'];
      for (let i = 0; i < that.activeLayersArray.length; i++) {
        if(that.activeLayersArray[i]==undefined || that.activeLayersArray[i]===e['layer']['options']['layerCode']){
          that.activeLayersArray.splice(i, 1);
        }
      }
      if(e['layer']['options']['layerCode'] && !that.activeLayersArray.includes(e['layer']['options']['layerCode'])){
        that.activeLayersArray.push(e['layer']['options']['layerCode']);
      }
      
      for (let i = 0; i < that.activeLayerUrlsArray.length; i++) {
        if(that.activeLayerUrlsArray[i]==undefined){
          that.activeLayerUrlsArray.splice(i, 1);
        }
      }
      if(e['layer']['options'].url == undefined){

      }
      else {
        that.activeLayerUrlsArray.push(e['layer']['options']['layerCode']);
      }
      // 
    } catch{
      
    }
  });

  that.map.on('layerremove', function (e) {
    try {
   
      var index = that.activeLayersArray.indexOf(e['layer']['options']['layerCode']);
      if (index > -1) {
        that.activeLayersArray.splice(index, 1);
       
     }else{
      var index = that.activeLayersArray.indexOf(e['layer']['options']['layerCode']);
     }
     var url = that.activeLayerUrlsArray.indexOf(e['layer']['options'].url);
     if(url > -1){
       that.activeLayerUrlsArray.splice(url, 1);
       
     }
    } catch {
      // 
    }
  });
    

  that.map.on('click', function(e){
    if(that.viewFindRoute){
      that.findRoute(e.latlng);
    } else{
      that.viewFindRoute = false;
      that.viewBookmark = false;
      that.showSearch=false;
      that.sketchingMenu = false;
    }
  });
  

  }

  addLayer(baseLayers, overlays){
    let that = this;
    L.Control.Custom = L.Control.Layers.extend({
      onAdd: function () {
        this._initLayout();
        this._icon();
        this._update();
        return this._container;
      },
      _icon: function(){
        var elements = this._container.getElementsByClassName('leaflet-control-layers-list');
           var imgDismiss = L.DomUtil.create('img','', elements[0]);
           imgDismiss.src = '../../assets/images/dismiss.png';
           imgDismiss.style.width = '15px';
           imgDismiss.style.position = 'absolute';
           imgDismiss.style['bottom'] = '90%';
           imgDismiss.style['margin-left'] = '90%';
           L.DomEvent.on(imgDismiss, 'click', function(e){
            L.DomEvent.stop(e);
            this._collapse();
          }, this);
      }
    });
    this.overlayLayers = new L.Control.Custom(baseLayers, overlays, {collapse: true}).addTo(that.map);
  }


  getTileURL(lat, lon, zoom, e, layer, layerUrl) {
    const xtile = Math.floor((lon + 180) / 360 * (1 << zoom));
    const ytile = Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * (1 << zoom));
    const x = this.lonLatToPixelX(lon, lat, this.map);
    const y = this.lonLatToPixelY(lon, lat, this.map);
    const GET_MAP_TILES = layerUrl;
    for (var i = 0; i < 2; i++) {
      const size = this.map.getSize();
      // const proxyurl = urls.featureInfo
      const X = this.map.layerPointToContainerPoint(e.layerPoint).x;
      const Y = this.map.layerPointToContainerPoint(e.layerPoint).y;
      this.url = GET_MAP_TILES + layer + '&QUERY_LAYERS=' + layer + '&STYLE=&TILEMATRIXSET=EPSG-900913&TILEMATRIX=' + zoom +
        '&TILEROW=' + ytile + '&TILECOL=' + xtile +
        '&FORMAT=image%2Fpng&INFO_FORMAT=application/json&X=' + parseInt(X) + "&Y=" + parseInt(Y);
      const width = size.x;
      const height = size.y;
      const bounds = this.map.getBounds();
      const crs = this.map.options.crs; // me._crs
      const sw = crs.project(bounds.getSouthWest());
      const ne = crs.project(bounds.getNorthEast());
      const bbox = sw.x + "," + sw.y + "," + ne.x + "," + ne.y;
      this.url = this.url + "&srs=" + crs.code;
      this.url = this.url + "&bbox=" + bbox;
      this.url = this.url + "&width=" + width + "&height=" + height;
      const stoploop = false;
      let res;
      const that = this;
      this.restApiService.getFeatureInfoProcess(this.url).subscribe(
        (res: any) => {
          if (res['features'].length) {
            const layerProperties = {
              info: res['features'][0]['properties'],
              type: res['features'][0]['type']
            };
            this.featureInfoData = layerProperties;
            let tableRow;
            let contentString = `<h4 class="card-title"><span class="text-primary">${layer}</span> Information</h4>
            <div class="table-responsive">
            <table class="table table-bordered table-bordered-bd-warning mt-2 table-condensed table-hover">
            <tbody>`;
            for (let key in layerProperties.info) {
              contentString = contentString +
                `<tr>
                <td><small class="text-muted">${key}</small></td>
                <td><small class="text-muted">${layerProperties.info[key]}</small></td>
              </tr>`
            }
            contentString = contentString + `</tbody></table></div>`
            const popLocation = e.latlng;
            const popup = L.popup({ maxWidth: 800 })
              .setLatLng(popLocation)
              .setContent(contentString)
              .openOn(that.map);
          }
          else {
            this.toastService.showToast("Layer Information Not Available!");
          }
        });
    }
  }
  // feature info for WMS end

  // for wmts feature showing
  getTileURLWmts(lat, lon, zoom, e, layerName, layerUrl) {
    const activeLayername = layerName || '';
    const xtile = Math.floor((lon + 180) / 360 * (1 << zoom));
    const ytile = Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * (1 << zoom));
    const x = this.lonLatToPixelX(lon, lat, this.map);
    const y = this.lonLatToPixelY(lon, lat, this.map);
    const GET_MAP_TILES = layerUrl;
    for (var i = 0; i < 2; i++) {
      const size = this.map.getSize();
      const X = this.map.layerPointToContainerPoint(e.layerPoint).x;
      const Y = this.map.layerPointToContainerPoint(e.layerPoint).y;
      this.url = GET_MAP_TILES + activeLayername + '&TILEMATRIX=' + zoom + '&TILEROW=' + ytile + '&TILECOL=' + xtile + '&i=' + parseInt(X) + '&j=' + parseInt(Y) + '&pixel_hit_radius=5';
      const width = size.x;
      const height = size.y;
      const bounds = this.map.getBounds();
      const crs = this.map.options.crs; // me._crs
      const sw = crs.project(bounds.getSouthWest());
      const ne = crs.project(bounds.getNorthEast());
      const bbox = sw.x + ',' + sw.y + ',' + ne.x + ',' + ne.y;
      const stoploop = false;
      // const url12 = Globals.urls.featureInfo;
      this.restApiService.getServiceProcess(this.url).subscribe((res: any) => {
        if (res.status == 200) {
          const componentProperties = {
            info: res['data']['features'][0]['properties'],
            type: res['data']['features'][0]['type']
          };
          this.featureInfoData = componentProperties;
          // this.ngxSmartModalService.getModal('layerObjectInfo').open();
        } else {
          this.toastService.showToast('No data available', 3000);
        }

      });

    }
  }


  lonLatToPixelX(longitude, latitude, map) {
    // Clamp values
    const MinLatitude = -85.05112878;
    const MaxLatitude = 85.05112878;
    const MinLongitude = -180;
    const MaxLongitude = 180;
    longitude = this.clamp(longitude, MinLongitude, MaxLongitude);
    const x = this.calcRatioX(longitude);
    const mapSize = Math.pow(2, map.getZoom()) * 512;
    const pixelX = this.clamp(x * mapSize + 0.5, 0, mapSize - 1);
    return pixelX;
  }

  lonLatToPixelY(longitude, latitude, map) {
    // Clamp values
    const MinLatitude = -85.05112878;
    const MaxLatitude = 85.05112878;
    const MinLongitude = -180;
    const MaxLongitude = 180;
    latitude = this.clamp(latitude, MinLatitude, MaxLatitude);
    const y = this.calcRatioY(latitude);
    const mapSize = Math.pow(2, map.getZoom()) * 512;
    const pixelY = this.clamp(y * mapSize + 0.5, 0, mapSize - 1);
    return pixelY;
  }

  clamp(x, min, max) {
    return Math.min(Math.max(x, min), max);
  }

  calcRatioX(longitude) {
    const ratioX = ((longitude + 180.0) / 360.0);
    return ratioX;
  }

  calcRatioY(latitude) {
    const sinLatitude = Math.sin(latitude * Math.PI / 180.0);
    const ratioY = (0.5 - Math.log((1 + sinLatitude) / (1.0 - sinLatitude)) / (4.0 * Math.PI));
    return ratioY;
  }

  public ngAfterViewInit() {
    const googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });
    const googleHybrid = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
      minZoom: 5,
      maxNativeZoom: 19,
      maxZoom: 25,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });
    const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      minZoom: 5,
      maxNativeZoom: 19,
      maxZoom: 25,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
    const googleTerrain = L.tileLayer('http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', {
      minZoom: 5,
      maxNativeZoom: 19,
      maxZoom: 25,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });
    const googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
      minZoom: 5,
      maxNativeZoom: 19,
      maxZoom: 25,
      subdomains:['mt0','mt1','mt2','mt3']
    });
    let selectedMap;
    if(this.mapType == 'googleMap'){
      selectedMap = googleStreets;
    }
    else {
      selectedMap = osm;
    }
 
    this.map = L.map(this.mapElement.nativeElement, {
      center: Constants.osmPoints,
      zoom: 8,
      //layers: [L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")],
      zoomControl: false,
      layers: [selectedMap]
    }).on('click', function (e) {
      if (that.toolbarButtonConf.drawingType == 'marker') {
        setTimeout(() => {
          that.drawPointGeometry();
        }, 500);
       
      }
    });
    //this.map.zoomControl.setPosition('topright');
    const that = this;
    let baseLayers:any;
    if(this.mapType === 'googleMap'){
      baseLayers = {
        Google: googleStreets.addTo(this.map),
        Satellite: googleSat,
        Hybrid: googleHybrid,
        Terrain: googleTerrain
      }
    }else{
      baseLayers = {
        OSM: osm.addTo(this.map),
        Satellite: googleSat,
        Hybrid: googleHybrid,
        Terrain: googleTerrain
      }
    }
    // L.control.layers(baseLayers, null, { position: "topright", collapsed: true }).addTo(this.map)

    // L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    //   //attribution: attribution,
    //   maxZoom: 22,
    //   maxNativeZoom: 18
    // }).addTo(that.map);
    this.addressSearch = new L.LayerGroup().addTo(that.map);
    // Define BaseLayers [setting OSM as default tileLayer]

    if (this.taskId) {
      this.getLayers(baseLayers);
    } else if(this.formId){
      this.getLayers(baseLayers);
      // L.control.layers(baseLayers, null, { position: "topright", collapsed: true }).addTo(this.map);
    }

     setTimeout(() => {
      this.map.invalidateSize();
     }, 1000);

    if (this.route.snapshot.params.taskId === "mapNavigation") {
      this.dragLatLongString = this.commonService.getGeoTagNumbers();
      var marker = L.marker(new L.LatLng(this.commonService.getGeoTagNumbers().split(',')[0], this.commonService.getGeoTagNumbers().split(',')[1]), {
        draggable: true
      }).addTo(that.map);
      that.map.setView([this.commonService.getGeoTagNumbers().split(',')[0], this.commonService.getGeoTagNumbers().split(',')[1]], 20);
      marker.on('dragend', function (e) {
        that.dragLatLongString = marker.getLatLng().lat + ',' + marker.getLatLng().lng;
      });
    }

    if (this.fromForm != 'true') {
      this.addworkOrdersOnMap();

      let bountCount = 0;
      let boundArray = []
      for (let workOrderType in this.workOrders) {
        if (this.workOrders[workOrderType].length > 0) {
          for (var i = 0; i < this.workOrders[workOrderType].length; i++) {
            bountCount++;
            let a = this.workOrders[workOrderType][i].geometry.coordinates[1];
            let b = this.workOrders[workOrderType][i].geometry.coordinates[0];
            boundArray.push([a, b])
          }
        }
      }
      if (bountCount > 0)
        this.map.fitBounds(boundArray)
    }
    else {
      this.loadGeoJsonData();
    }

  }

  captureLocation() {
    // if(this.route.snapshot.params.id === 'geo-tag-asset') {
    //   this.toastService.showToast(Constants.locationCaptured, 3000);

    // } else if(this.route.snapshot.params.id === 'geo-tag-table'){
    //   this.toastService.showToast(Constants.locationCaptured, 3000);

    // }
    this.commonService.gpsTrack({ latlong: this.dragLatLongString, widgetId: this.route.snapshot.params.assignmentId });
    this.commonService.goBack();
  }
  
  loadGeoJsonData() {
    let that = this;
    let gojsonData = this.commonService.getGeoJsonData();
    console.log("geoJsonData",gojsonData);
    if(gojsonData['features']){
      if (gojsonData && gojsonData['features'].length > 0) {
        this.geometryGroup = L.geoJSON(gojsonData, {
          style: function () { return { color: '#6c6cf3', "weight": 10 } },
          onEachFeature: function (featureData, featureLayer) {
            // featureData contains the actual feature object
            // featureLayer contains the indivual layer instance
            featureLayer.on('click', function () {
              // Fires on click of single feature
              
              that.openGeometryFormSketching(featureData, featureLayer)
            });
          }
        }).addTo(that.map);
        // this.map.fitBounds(that.geometryGroup.getBounds()).setZoom(Constants.zoomLevels.gotoCurrentLocationZoomVal);
        this.map.fitBounds(that.geometryGroup.getBounds()).setZoom(12);

      }
    }
  }

  // loadGeoJsonData() {
  //   let that = this;
  //   let gojsonData = this.commonService.getGeoJsonData()
  //   if (gojsonData['features'].length > 0) {
  //     this.geometryGroup = L.geoJSON(gojsonData, {
  //       style: function () { return { color: '#6c6cf3', "weight": 10 } },
  //       onEachFeature: function (featureData, featureLayer) {
  //         // featureData contains the actual feature object
  //         // featureLayer contains the indivual layer instance
  //         featureLayer.on('click', function () {
  //           // Fires on click of single feature
  //           that.openGeometryFormSketching(featureData, featureLayer)
  //         });
  //       }
  //     }).addTo(that.map);
  //     this.map.fitBounds(that.geometryGroup.getBounds());
  //   }
  // }

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
    if (totalMarkesCount !== this.commonService.getSelectedWorkordersCount()) {
      this.toastService.showToast(this.displayProperties.noLocationForWorkorders);
    }
  }

  addLayerProcess(value, type) {
    const that = this;
    let mapData = {}
    mapData['type'] = "FeatureCollection";
    mapData['features'] = value;
    let ionicURL;
    if (type == "re-assign")
      ionicURL = "http://maps.google.com/mapfiles/kml/paddle/red-blank.png";
    else if (type == "saved")
      ionicURL = "http://maps.google.com/mapfiles/kml/paddle/grn-blank.png";
    else
      ionicURL = "http://maps.google.com/mapfiles/kml/paddle/blu-blank.png";


    // create an options object that specifies which function will called on each feature
    let myLayerOptions = {
      // pointToLayer: function (feature, latlng) {
      //   let myIcon = L.icon({
      //     iconUrl: ionicURL,
      //     iconSize:     [50, 50], // width and height of the image in pixels
      //   })
      //   return L.marker(latlng, { icon: myIcon })
      // },
      onEachFeature: function (featureData, featureLayer) {
        // featureData contains the actual feature object
        // featureLayer contains the indivual layer instance
        featureLayer.on('click', function () {
          // Fires on click of single feature
          that.markerClickProcess(featureData)
        });
      }
    }
    // create the GeoJSON layer
    this.layers[type] = L.geoJSON(mapData, myLayerOptions).addTo(that.map);
  }

  markerClickProcess(e) {
    var markerInfo = e.properties['markerInfo'];
    markerInfo['taskId'] = this.route.snapshot.params.taskId;
    markerInfo['assignmentId'] = this.route.snapshot.params.assignmentId;
    this.modalService.openModal(MarkerInfoComponent, "map-modal", { "markerInfo": markerInfo }, function (data) {
    })
  }

  goBack(e) {
    if (this.fromForm == 'true' && this.isHistory == false) {
      this.saveGeometry();
    } else {
      this.commonService.goBack();
    }
    // // this.presentAlertPrompt();
    // this.saveGeometry();
    // //this.commonService.goBack();
  }

  async presentAlertPrompt() {
    if (1 == 1) {
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
  selectedMapAction(actionSelected) {
    switch (actionSelected) {
      case Constants.geometryActionTypes.drawPoint: {
        this.actionType = Constants.geometryActionTypes.drawPoint;
        this.drawPointGeometry();
        break;
      }
      case Constants.geometryActionTypes.drawLine: {
        this.actionType = Constants.geometryActionTypes.drawLine;
        this.drawLineGeometry();
        break;
      }
      case Constants.geometryActionTypes.drawArea: {
        this.drawAreaGeometry();
        this.actionType = Constants.geometryActionTypes.drawArea;
        break;
      }
      case Constants.geometryActionTypes.cancel: {
        if (this.deleteGeometryMode) {
          this.deleteCancel();
          this.actionType = Constants.geometryActionTypes.cancel;
        }
        else if (this.editGeometryMode) {
          this.editCancel()
        }
        else
          this.cancelDrawGeometry()
        break;
      }
      case Constants.geometryActionTypes.finish: {
        if (this.deleteGeometryMode) {
          this.deleteFinish();
        }
        else if (this.editGeometryMode) {
          this.finishEditGeometry()
        }
        else if (this.toolbarButtonConf.drawingType == 'marker') {
          this.toolbarButtonConf.drawingType = '';
          this.toolbarButtonConf.actionStarted = false;
          this.toolbarButtonConf.drawStarted = false;
          this.disableIntractionHandleer();
        }
        else
          this.finishGeometry()
        break;
      }
      case Constants.geometryActionTypes.deleteLastPoint: {
        if (this.deleteGeometryMode) {
          this.deleterevertLayers();
        }
        else if (this.editGeometryMode) {
          this.revertEditLayers();
        }
        else
          this.deleteLastPonit()
        break;
      }
      case Constants.geometryActionTypes.deleteAllGeometry: {
        this.deleteAllGeometry()
        break;
      }
      case Constants.geometryActionTypes.deleteGeometry: {
        this.deleteGeomtry()
        break;
      }
      case Constants.geometryActionTypes.saveGeometry: {
        this.saveGeometry();
        break;
      }
      case Constants.geometryActionTypes.editGeometry: {
        this.editGeomtry();
        break;
      }
      case Constants.geometryActionTypes.drawingMenu: {
        if (this.sketchingToolComponent.showSketchingTool)
          this.sketchingMenu = true;
          this.closeAddressSearch();
          this.showSearch=false;
          if(this.viewBookmark || this.viewFindRoute){
            this.modalController.dismiss(false);
            this.viewBookmark = false;
            this.viewFindRoute = false;
          }
        else
          this.sketchingMenu = false;
        break;
      }
      case Constants.geometryActionTypes.gotoLocation: {
        this.gotoCurrentLocation();
        if(this.viewBookmark || this.viewFindRoute){
          this.modalController.dismiss(false);
          this.viewBookmark = false;
          this.viewFindRoute = false;
        }
        break;
      }
      case Constants.geometryActionTypes.addressSearch: {
        this.findAddress();
        break;
      }
      case Constants.geometryActionTypes.openBookmark: {
        this.sketchingToolComponent.showSketchingTool = false;
        this.addBookmark();
        // this.actionType = '';
        break;
      }
      case Constants.geometryActionTypes.measuringTool: {
        this.sketchingToolComponent.showSketchingTool = false;
        this.measuringTool();
        this.actionType = Constants.geometryActionTypes.measuringTool;
        break;
      }
      case Constants.geometryActionTypes.assetSearch: {
        // this.measuringTool();
        this.sketchingToolComponent.showSketchingTool = false;
        this.showAssetSearch();
        this.actionType = Constants.geometryActionTypes.assetSearch;
        break;
      }
      case Constants.geometryActionTypes.FindBTtwoPoints: {
        // this.actionType = '';
        this.sketchingToolComponent.showSketchingTool = false;
        this.findRouteBTtwoLocations();
        break;
      }
      default: {  
        //statements; deleteSelectedGeomtry
        break;
      }
    }
  }

  /*Enabling Point geometry to draw point on map for sketching  
  */
  drawPointGeometry() {
    // this.disableIntractionHandleer()
    let that = this;
    this.drawingController();
    this.interactionHandler = new L.Draw.Marker(that.map, that.options.options.create.marker);
    this.interactionHandler.enable();

    this.toastService.showToast("Please place point and it will save automatically", 2000);

  }
  /*Enabling line geometry to draw point on map for sketching  
  */
  drawLineGeometry() {
    this.disableIntractionHandleer()
    let that = this;
    this.drawingController();
    // that.options.options.create.polyline.shapeOptions.color = "black"

    that.options.options.create.polyline.shapeOptions.color = that.commonService.getAssetFormData().color
    that.options.options.create.polyline.shapeOptions.weight = that.commonService.getAssetFormData().stroke
   
    this.interactionHandler = new L.Draw.Polyline(that.map, that.options.options.create.polyline);
    this.interactionHandler.enable();
    this.toastService.showToast("Please draw line and click on done button or end point of line to save changes", 5000);
  }
  /*Enabling area geometry to draw point on map for sketching 
  */
  drawAreaGeometry() {
    this.disableIntractionHandleer()
    let that = this;
    this.drawingController();
    that.options.options.create.polygon.shapeOptions.color = that.commonService.getAssetFormData().color
    that.options.options.create.polygon.shapeOptions.weight = that.commonService.getAssetFormData().stroke
    this.interactionHandler = new L.Draw.Polygon(that.map, this.options.options.create.polygon);
    this.interactionHandler.enable();
    this.toastService.showToast("Please draw area and click on done button or start point of area to save changes", 5000);
  }

  disableIntractionHandleer() {
    if (this.interactionHandler) {
      this.interactionHandler.disable();
      this.toolbarButtonConf.actionStarted = false;
    }
  }

  drawingController() {
    debugger
    this.closeAddressSearch();
   let that = this;
    this.map.on('draw:created', function (e) {
      var layer = e.layer, feature = layer.feature = layer.feature || {}; // Initialize feature
      feature.type = feature.type || "Feature"; // Initialize feature.type

      // feature.assetFormId = that.commonService.getAssetFormData()._id;
      // feature.assetFormName = that.commonService.getAssetFormData().name;

      var props = feature.properties = feature.properties || {}; // Initialize feature.properties
      //props.myId = 'This is myId';
      var id = feature.id = feature.id || Math.floor(Date.now() / 1000);
      if (layer._leaflet_id == undefined) {
        if(that.actionType == Constants.geometryActionTypes.drawLine){ 
          if (e.layerType != 'marker') {
            let tmpCood = [];
            layer._latlngs = layer._latlngs.filter(function (v) {
              if (tmpCood.indexOf(v.toString()) < 0) {
                tmpCood.push(v.toString());
                return v;
              }
            });
          }
  
          that.geometryGroup.addLayer(layer);
          that.toastService.showToast("Drawing placed successfully and you can add properties by clicking on it", 5000);
          if (that.leeafletGeometryId != layer._leaflet_id) {
            that.leeafletGeometryId = layer._leaflet_id;
            e.layer.on('click', function () {
              that.openGeometryForm(e)
            });
          }
          that.map.addLayer(that.geometryGroup)
        }

        else if(that.actionType == Constants.geometryActionTypes.measuringTool){
          debugger
          if(that.geometryGroup == undefined){
            that.geometryGroup = L.featureGroup();
          }
            that.geometryGroup.addLayer(layer);
            that.toastService.showToast("Drawing placed successfully", 5000);
            if (that.leeafletGeometryId != layer._leaflet_id) {
              that.leeafletGeometryId = layer._leaflet_id;
              that.leafletLayerIds.push(layer._leaflet_id);
            }
            that.map.addLayer(that.geometryGroup);  
              let srcLat, srcLng, destLat, destLng, distance , total_distance = 0.00, polygon_area = 0.00;
            let src = { lat : null, lng: null };
              let finalcoords = [], distanceArray = [];
              if (e.layerType == 'polyline' && layer._latlngs && layer._latlngs.length >= 0) {
      
            for (let i = 0; i < layer._latlngs.length; i++) {
               src = { lat : null, lng: null };
              if((i-1)>=0){
                if( layer._latlngs[i-1].lat!=layer._latlngs[i].lat && 
                  layer._latlngs[i-1].lng!=layer._latlngs[i].lng){
                  src.lat = layer._latlngs[i].lat;
                  src.lng = layer._latlngs[i].lng;
                  finalcoords.push(src);
                }
                else if( layer._latlngs[i-1].lat==layer._latlngs[i].lat && 
                  layer._latlngs[i-1].lng==layer._latlngs[i].lng){
                  // src.lat = layer._latlngs[i-1].lat;
                  // finalsrc.push(src);
                }
                else {
                  // 
                }
              }
              else {
                src.lat = layer._latlngs[i].lat;
                src.lng = layer._latlngs[i].lng;
                finalcoords.push(src);
                // 
              }
            }
            for (let j = finalcoords.length; j >= 2; j--) {
              distance = null;
              srcLat = finalcoords[j-2].lat;
              srcLng = finalcoords[j-2].lng;
              destLat = finalcoords[j-1].lat;
              destLng = finalcoords[j-1].lng;
              distance = that.distanceBTGeoLocation(srcLat, srcLng, destLat, destLng, 'K');
              distanceArray.push(distance);
              
            }
            polygon_area = that.calcPolygonArea(finalcoords);
            // 
            if(!polygon_area){
              polygon_area = 0.00;
            }
            for (let k = 0; k < distanceArray.length; k++) {
              total_distance += distanceArray[k];
              // 
            }
            total_distance = total_distance*1000;
            layer.bindPopup('Area : '+polygon_area.toFixed(2) + ' sq.meters <br>'+'Length : '+total_distance.toFixed(2) + ' meters');
              layer.openPopup();
            }

        }
        else {
          if (e.layerType != 'marker') {
            let tmpCood = [];
            layer._latlngs = layer._latlngs.filter(function (v) {
              if (tmpCood.indexOf(v.toString()) < 0) {
                tmpCood.push(v.toString());
                return v;
              }
            });
          }
  
          that.geometryGroup.addLayer(layer);
          that.toastService.showToast("Drawing placed successfully and you can add properties by clicking on it", 5000);
          if (that.leeafletGeometryId != layer._leaflet_id) {
            that.leeafletGeometryId = layer._leaflet_id;
            e.layer.on('click', function () {
              // 
              // 
              that.openGeometryForm(e)
            });
          }
          that.map.addLayer(that.geometryGroup)
        }
       
      }
    
    });

    this.map.on('draw:edited', function (e) {
    });

    this.map.on('draw:drawstart', function (e) {
      that.drawingModeOn = true;
      that.toolbarButtonConf.actionStarted = true;
      that.toolbarButtonConf.drawStarted = true;
      that.toolbarButtonConf.drawingType = e.layerType;
    });

    this.map.on('draw:drawstop', function (e) {
      that.drawingModeOn = false;
      // if (that.toolbarButtonConf.drawingType != 'marker') {
      that.toolbarButtonConf.actionStarted = false;
      that.toolbarButtonConf.drawStarted = false;
     
    });
  }

  cancelDrawGeometry() {
    this.disableIntractionHandleer()
  }

  finishGeometry() {
    this.interactionHandler.completeShape();
    this.toolbarButtonConf.actionStarted = false;
  }

  deleteLastPonit() {
    this.interactionHandler.deleteLastVertex();
  }

  saveGeometry() {
    if (this.toolbarButtonConf.actionStarted || this.sketchingMenu)
      return;
    //if (this.checkGeometryDrawn()) {
    if(this.geometryGroup) {
      this.removeSpecificLayer();
      let geoJSONData = this.geometryGroup.toGeoJSON()
      this.commonService.setGeoJsonData(geoJSONData);
    }
    // this.toastService.showToast(this.displayProperties.sketchingSaved);
    this.commonService.goBack();
    //}
  }

  removeSpecificLayer(){
    let layers: Array<any> = this.geometryGroup.getLayers();     
    layers.forEach((res) => {
      for (let i = 0; i < this.leafletLayerIds.length; i++) {
        if(res._leaflet_id == this.leafletLayerIds[i]){
          let check = this.geometryGroup.removeLayer(this.leafletLayerIds[i]);
          this.leafletLayerIds.splice(i, 1);
        }
        else {
        }
      }
    })
  }

  deleteAllGeometry() {
    if (this.toolbarButtonConf.actionStarted || this.sketchingMenu)
      return;
    if (this.checkGeometryDrawn()) {
      this.clearAllConformBox();
    } else {
      this.toastService.showToast("No sketchings are available to clear", 4000);
    }

  }

  async clearAllConformBox() {

    const alert = await this.alertController.create({
      message: 'Sure you want to clear?',
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

            this.geometryGroup.clearLayers();
          }
        }
      ]
    });

    await alert.present();

  }
  // tslint:disable-next-line:member-ordering
  private deleteGeometryHandle;
  deleteGeomtry() {
    if (this.toolbarButtonConf.actionStarted || this.sketchingMenu) {
      // this.toastService.showToast("please complete active drwa");
      return;
    }
    this.deleteGeometryMode = true;
    if (this.checkGeometryDrawn()) {
      this.toolbarButtonConf.actionStarted = true;
      this.toolbarButtonConf.drawStarted = true;
      this.toolbarButtonConf.drawingType = 'deleteMarker';
      this.toastService.showToast(this.displayProperties.deleteSketchingMsg, 4000);
      const that = this;
      this.deleteGeometryHandle = new L.EditToolbar.Delete(that.map, { featureGroup: that.geometryGroup })
      this.deleteGeometryHandle.enable();

    } else {
      this.toastService.showToast("No sketchings are available to delete", 4000);
    }
  }

  deleteFinish() {
    this.deleteGeometryHandle.save();
    this.deleteGeometryHandle.disable();
    this.deleteGeometryMode = false;
    this.toolbarButtonConf.actionStarted = false;
    this.toolbarButtonConf.drawStarted = false;
  }
  deleterevertLayers() {
    this.deleteGeometryHandle.revertLayers();
  }
  deleteCancel() {
    this.deleteGeometryHandle.revertLayers();
    this.deleteGeometryHandle.disable();
    this.deleteGeometryMode = false;
    this.toolbarButtonConf.actionStarted = false;
    this.toolbarButtonConf.drawStarted = false;
  }
  private editGeometryHandle
  private editGeometryMode: boolean = false;
  editGeomtry() {
    if (this.toolbarButtonConf.actionStarted || this.sketchingMenu)
      return;
    if (this.checkGeometryDrawn()) {
      this.toastService.showToast("After editing is done, please click on done button to save");
      let that = this;
      this.editGeometryHandle = new L.EditToolbar.Edit(that.map, { featureGroup: that.geometryGroup, selectedPathOptions: that.options.options.edit.selectedPathOptions })
      this.editGeometryHandle.enable();
      this.editGeometryMode = true;
      this.toolbarButtonConf.actionStarted = true;
      this.toolbarButtonConf.drawStarted = true;
      this.toolbarButtonConf.drawingType = "editMarker";
    } else {
      this.toastService.showToast("No sketchings are available to edit", 4000);
    }
  }

  finishEditGeometry() {
    this.editGeometryHandle.save();
    this.editGeometryHandle.disable();
    this.editGeometryMode = false;
    this.toolbarButtonConf.actionStarted = false;
    this.toolbarButtonConf.drawStarted = false;
  }

  revertEditLayers() {
    this.editGeometryHandle.revertLayers();
    this.editGeometryHandle.disable();
    this.editGeometryHandle.enable();
  }

  editCancel() {
    this.editGeometryHandle.revertLayers();
    this.editGeometryHandle.disable();
    this.editGeometryMode = false;
    this.toolbarButtonConf.actionStarted = false;
    this.toolbarButtonConf.drawStarted = false;
  }

  openGeometryForm(ref) {
    if (this.toolbarButtonConf.actionStarted)
      return;
    this.geometryReference = ref.layer;
    //this.geometryGroup.addLayer(layer);
    this.commonService.setGeometryProperties(ref.layer.feature.properties)
    //this.router.navigate(['dashboard/tasksList/geometryObjectForm',this.isHistory]);
    // await this.abc();
    let that = this;
    this.modalService.openModal(GeometryFormComponent, "", {}, function (data) {
      // cheking fille objcte is empty or not
      if (Object.keys(data).length > 0) {
        that.geometryReference.feature.properties = data['data'];
      }
    });
  }

  checkGeometryDrawn() {
    const geoJSON = this.geometryGroup.toGeoJSON();
    if (geoJSON.features.length === 0) {
      // this.toastService.showToast(this.displayProperties.addSketchingMsg);
      return false;
    } else {
      return true;
    }
  }

  openGeometryFormSketching(featureData, featureLayer) {
    if (this.toolbarButtonConf.actionStarted)
      return;    
    this.commonService.setAssetFormId(featureData.assetFormId);
    this.geometryReference = featureLayer;
    this.isHistory = this.route.snapshot.params.isHistory == 'true' ? true : false;
    this.commonService.setGeometryProperties(this.geometryReference.feature.properties);
    let that = this;
    this.modalService.openModal(GeometryFormComponent, "", { isHistoryView: this.isHistory }, function (data) {
      if (Object.keys(data).length > 0) {
        that.geometryReference.feature.properties = data['data'];
      }

    })
  }

  // gotoCurrentLocation() {
  //   if (this.toolbarButtonConf.actionStarted || this.sketchingMenu)
  //     return;
  //   //this.map.locate({setView: true, Zoom: 18});
  //   let boundArray = []
  //   this.closeAddressSearch();
  //   this.loadingService.present()
  //   this.geoLocationService.getLatLong().then((data) => {
  //     this.loadingService.dismiss()
  //     let lat = data.coords.latitude;
  //     let long = data.coords.longitude;
  //     boundArray.push([lat, long])
  //     this.map.fitBounds(boundArray).setZoom(18)
  //     //this.map.flyTo([lat,  long],18);
      
  //   }, (error) => {
  //     this.loadingService.dismiss();
  //     this.toastService.showToast(this.displayProperties.unableToGetLocation);
  //   });
  // }

  gotoCurrentLocation() {
    if (this.toolbarButtonConf.actionStarted || this.sketchingMenu)
      return;
    // For removing previous added markers
    if (this.markersArray.length > 0) {
      for (var k = 0; k < this.markersArray.length; k++) {
        this.map.removeControl(this.markersArray[k]);
      }
    }
    let boundArray = []
    this.closeAddressSearch();
    this.loadingService.present()
    this.geoLocationService.getLatLong().then((data) => {
      this.loadingService.dismiss()
      let lat = data.coords.latitude;
      let long = data.coords.longitude;
      boundArray.push([lat, long])
      this.map.fitBounds(boundArray).setZoom(Constants.zoomLevels.gotoCurrentLocationZoomVal);
      this.addressSearch.clearLayers();
      var century21icon = L.icon({
        iconUrl: '../../assets/images/CurrentLocationMarker.svg',
        iconSize: [48, 125]
      });
      // this.theMarker = L.marker([lat, long], { icon: century21icon }).addTo(this.map);
      // this.markersArray.push(this.theMarker);


      this.addressSearch.addLayer(L.marker([lat, long], { icon: century21icon }));


    }, (error) => {
      this.loadingService.dismiss();
      this.toastService.showToast(this.displayProperties.unableToGetLocation);
    });
  }

  findAddress() {
    if (this.toolbarButtonConf.actionStarted || this.sketchingMenu)
      return;
    this.addressSearchStatus = true;
    this.showSearch=false;
    if(this.viewBookmark || this.viewFindRoute){
      this.modalController.dismiss(false);
      this.viewBookmark = false;
    this.viewFindRoute = false;
    }
    // create the geocoding control and add it to the map
    let that = this;
    if (this.geocoder)
      that.map.removeControl(that.geocoder);
    this.geocoder = new L.esri.Controls.Geosearch({ expanded: true, collapseAfterResult: false, placeholder: Constants.addressSearchText }).addTo(that.map);
    this.markersArray = []
    const myIcon = L.icon({
      iconUrl: '../../assets/images/map-pin-marked-blue.svg',
      iconSize: [48, 125]
    });

    //listen for the results event and add every result to the map
    this.geocoder.on("results", function (data) {
      that.addressSearch.clearLayers();
      that.addressSearch.addLayer(L.marker(data.results[0].latlng, { icon: myIcon }));
      // that.map.flyTo([data.results[0].latlng.lat,  data.results[0].latlng.lng],18);
      // that.map.removeControl(that.geocoder);      
    });
  }

  closeAddressSearch() {
    let that = this;
    this.addressSearchStatus = false;
    try {
      that.map.removeControl(that.geocoder);
      that.addressSearch.clearLayers();
    } catch (e) {

    }
  }

  addBookmark(){
    if(this.viewBookmark){
     this.viewBookmark = false;
    }
    else {
     this.showSearch=false;
     this.viewBookmark = true;
     this.closeAddressSearch();
     this.sketchingMenu = false;
     this.viewFindRoute = false;
    }
    this.modalService.openModal(BookmarksComponent, 'mapInteraction', {northEast: this.map.getBounds()._northEast, southWest: this.map.getBounds()._southWest, zoomLevel: this.map.getZoom()}, (data) => {
      this.viewBookmark = false;
      if(data){
       this.bookMarkBounds(data);
      }
    });
  }

  bookMarkBounds(bookmark){
    let convertToJson1 = JSON.parse(bookmark.northEast);
    let convertToJson2 = JSON.parse(bookmark.southWest);
   this.map.fitBounds([convertToJson1, convertToJson2])
  }

  measuringTool(){
    debugger
    this.viewFindRoute = false;
    this.showSearch=false;
    this.viewBookmark = false;
    this.sketchingMenu = false;
    this.disableIntractionHandleer()
    let that = this;
    this.drawingController();
    this.interactionHandler = new L.Draw.Polyline(that.map, that.options.options.create.polyline);
    this.interactionHandler.enable();
    this.toastService.showToast("Please draw line and click on done button or end point of line to save changes", 5000);
   }

   showAssetSearch(){
    this.closeAddressSearch();
    this.assetSearchList = [];
    if(this.showSearch){
      this.showSearch=false;
      this.searchValue = '';
    }else{
      this.showSearch=true;
      if(this.viewFindRoute || this.viewBookmark){
        this.modalController.dismiss(false);
        this.viewBookmark = false;
        this.viewFindRoute = false;
      }
      this.viewBookmark = false;
      this.sketchingMenu = false;
    }
  }

  
  distanceBTGeoLocation(lat1, lon1, lat2, lon2, unit) {
    if ((lat1 == lat2) && (lon1 == lon2)) {
      return 0;
    }
    else {
      var radlat1 = Math.PI * lat1/180;
      var radlat2 = Math.PI * lat2/180;
      var theta = lon1-lon2;
      var radtheta = Math.PI * theta/180;
      var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = dist * 180/Math.PI;
      dist = dist * 60 * 1.1515;
      if (unit=="K") {
        dist = dist * 1.609344;
      }
      if (unit=="N") {
        dist = dist * 0.8684;
      }
      return dist;
    }
  }

  calcPolygonArea(vertices) {
    var pointsCount = vertices.length,
          area = 0.0,
          d2r = Math.PI / 180,
          p1, p2;

      if (pointsCount > 2) {
          for (var i = 0; i < pointsCount; i++) {
              p1 = vertices[i];
              p2 = vertices[(i + 1) % pointsCount];
              area += ((p2.lng - p1.lng) * d2r) *
                  (2 + Math.sin(p1.lat * d2r) + Math.sin(p2.lat * d2r));
          }
          area = area * 6378137.0 * 6378137.0 / 2.0;
          return Math.abs(area);
      }
}

findRouteBTtwoLocations() {
  if(this.viewFindRoute){
    this.viewFindRoute = false;
  }
  else {
    this.viewFindRoute = true;
    this.showSearch=false;
      this.viewBookmark = false;
      this.sketchingMenu = false;
    this.commonService.currentLocation.subscribe((location: any) => {
      if(location){
        if(this.srcCoords){
          let prevSrc = this.srcCoords.split(',');
          this.removeSpecificMarker(prevSrc);
        }
        this.srcCoords = location;
        this.commonService.setSrcCoords(this.srcCoords);
        let latlngs = location.split(',');
        
        let addMarker =  L.marker(latlngs).addTo(this.map);
          this.markersArray.push(addMarker);
          // this.map.fitBounds([latlngs]);
      }
    }, err => { console.log(err)})
  }
  if (this.toolbarButtonConf.actionStarted || this.sketchingMenu)
    return;
  // For removing previous added markers
  if (this.markersArray.length > 0) {
    for (var k = 0; k < this.markersArray.length; k++) {
      this.map.removeControl(this.markersArray[k]);
      this.srcCoords = '';
      this.destCoords = '';
      this.commonService.setSrcCoords(this.srcCoords);
      this.commonService.setDestCoords(this.destCoords);
    }
  }
  this.closeAddressSearch();
  this.modalService.openModal(FindRouteComponent, 'mapInteraction',{}, (data) => {
    
      this.closeFindRoute(data);
  });
}

closeFindRoute(closeRoute){
  // 
  this.viewFindRoute = closeRoute;
  if (this.markersArray.length > 0) {
    for (var k = 0; k < this.markersArray.length; k++) {
      
      this.map.removeControl(this.markersArray[k]);
    }
  }
}

removeSpecificMarker(_latlng){
  if (this.markersArray.length > 0) {
    for (var k = 0; k < this.markersArray.length; k++) {
      if(this.markersArray[k]['_latlng']['lat'] == _latlng[0] && this.markersArray[k]['_latlng']['lng'] && _latlng[1]){
        this.map.removeControl(this.markersArray[k]);
      }
    }
  }
}

findRoute(coords){
  if(this.srcCoords == '' && this.destCoords == ''){
    this.srcCoords = coords.lat+", "+coords.lng;
      this.commonService.setSrcCoords(this.srcCoords);
      let addMarker =  L.marker([coords.lat, coords.lng]).addTo(this.map);
          this.markersArray.push(addMarker);
    // this.map.fitBounds([[coords.lat, coords.lng]]);
  }
  else if(this.srcCoords != '' && this.destCoords == ''){
    this.destCoords  = coords.lat+", "+coords.lng;
      this.commonService.setDestCoords(this.destCoords);
      let addMarker =  L.marker([coords.lat, coords.lng]).addTo(this.map);
          this.markersArray.push(addMarker);
  }
  else if(this.srcCoords != '' && this.destCoords != ''){
    if(this.srcCoords==this.destCoords){
      this.destCoords = '';
      this.commonService.setDestCoords(this.destCoords);
    }
    else {
      // 
    }
  }
}

async gotoDynamicLayers(feature_id){
  // const loading = await this.loadingController.create({
  //   message: 'Please wait'
  // });
  // await loading.present();
  this.loadingService.present();
      let lowerCaseFeatureId = this.lowerCase.transform(feature_id);
  let  url = "https://myworld.tatapower.com/myworld/mcs_search?&application=standard&limit=10&term="+lowerCaseFeatureId;
  this.restApiService.getServiceProcess(url​​​​).subscribe((res: any) => {​​​​
    
    this.loadingService.dismiss();
    if(res.suggestions && res.suggestions.length > 1){
      this.toastService.showToast('Multiple Features Found', 2000);
      // res.suggestions.forEach(eachEle => {
      //   this.selectedFeature(eachEle, 'gotoField')
      // });
    }
    else if(res.suggestions && res.suggestions.length===1){
      this.selectedFeature(res.suggestions[0], 'gotoField')
    }
    else if(res.suggestions && res.suggestions.length == 0){
      this.toastService.showToast('Features info not Found, please check ID', 2000);
    }
  }, err => {
    this.loadingService.dismiss();
    });
}

selectedFeature(feature, widgetName?, showButton?, mapInterPage?, formId?){
    if(widgetName=='gotoField'){
      var divide = feature.data.id.split(':');
      
      var url = "https://myworld.tatapower.com/myworld/mcs_feature_info?tablename=" + divide[0] + "&id=" + divide[1];
    }
    else if(widgetName=='mapInteraction'){
      var url = "https://myworld.tatapower.com/myworld/mcs_feature_info?tablename=" + feature.properties.myw_object_type + "&id=" + feature.id;
      // this.viewMapInteraction.next(true);
    }
    else {
      
      var url = "https://myworld.tatapower.com/myworld/mcs_feature_info?tablename=" + feature.properties.myw_object_type + "&id=" + feature.id;
    }
    // this.viewMapInteraction.next(false);
    this.restApiService.getServiceProcess(url​​​​).subscribe((res: any = {}) => {​​​​
  
    // this.backButton = showBackButton;
    this.gotoMapPopUp(res.myw_external_name, res, 'dynamic_layer');
    this.map.fitBounds([[res['bbox'][1], res['bbox'][0]],[res['bbox'][3],res['bbox'][2]]]);
    }, err => {});
  }

  async gotoMapPopUp(layerName, features, id?, showButton?){
    let that = this;
    // this.commonService.setGeoJsonNeedToRemove(features);
      var geojsonMarkerOptions = {
        radius: 20,
        fillColor: "#5DADE2",
        color: "#21618C",
        weight: 2,
        opacity: 0.8,
        fillOpacity: 0.4
    };
  //  this.geometryGroup = L.geoJSON(features, {
    const geometryLayer = new L.geoJSON(features, {
        pointToLayer: function (feature, latlng) {
          let circle = L.circleMarker(latlng, geojsonMarkerOptions);
            return circle;
        },
        onEachFeature: ( feature, layer ) => {
          let latlngs = [];
          let content = that.featureInfoView(feature, layerName);
           latlngs = that.getCoords(feature);
          const popup = L.popup({ maxWidth: 800 })
                .setLatLng(latlngs)
                .setContent(content)
                .openOn(that.map);
              layer.on('click', () => {
                layer.bindPopup(content);
            layer.openPopup();
          });
        },
    });
      setTimeout(() => {
        if(that.geometryGroup === undefined){
          that.geometryGroup = L.featureGroup();
          that.geometryGroup.addLayer(geometryLayer);
          that.geometryGroup.addTo(that.map);
        }
        else{
          that.geometryGroup.addLayer(geometryLayer);
          that.geometryGroup.addTo(that.map);
        }
        let layers: Array<any> = this.geometryGroup.getLayers();
          for (let j = 0; j < layers.length; j++) {
            if(layers[j]._layers){
              for (const key in layers[j]._layers) {
                if(layers[j]._layers[key].feature.id == features.id){
                  this.leafletLayerIds.push(layers[j]._leaflet_id);
                }
              }
            }
          }
      }, 10);
    // return this.geometryGroup;
  }

  featureInfoView(feature, layerName){
    const layerProperties = {
      info: feature.properties,
      type: feature.type
    };
    this.featureInfoData = layerProperties;
    
    let contentString = `<h6 class="card-title"><span class="text-primary">${layerName}</span> Information</h6>
    <div class="table-responsive">
    <table class="table table-bordered table-bordered-bd-warning mt-2 table-condensed table-hover">
    <tbody>`;
    for (let key in layerProperties.info) {
      contentString = contentString +
        `<tr>
        <td><small class="text-muted">${key} </small></td>
        <td><small class="text-muted">: ${layerProperties.info[key]}</small></td>
      </tr>`
    }
    contentString = contentString + `</tbody></table></div>`
  return contentString;
  }

  getCoords( feature){
    let latlngs = [];
    if(feature.geometry.coordinates[0].length > 0 && 
      feature.geometry.coordinates[0][0].length > 0 && 
      feature.geometry.coordinates[0][0][0].length > 0){
      // 
      latlngs[0] = feature.geometry.coordinates[0][0][0][1];
      latlngs[1] = feature.geometry.coordinates[0][0][0][0];
    }
    else if(feature.geometry.coordinates[0].length > 0 && 
    feature.geometry.coordinates[0][0].length > 0){
      // 
      latlngs[0] = feature.geometry.coordinates[0][0][1];
      latlngs[1] = feature.geometry.coordinates[0][0][0];
    }
    else if(feature.geometry.coordinates[0].length > 0){
        // 
        latlngs[0] = feature.geometry.coordinates[0][1];
        latlngs[1] = feature.geometry.coordinates[0][0];
      }
      else if(feature.geometry.coordinates.length > 0){
          // 
          latlngs[0] = feature.geometry.coordinates[1];
          latlngs[1] = feature.geometry.coordinates[0];
        }
        else {
          
        }
    return latlngs;
  }

}
