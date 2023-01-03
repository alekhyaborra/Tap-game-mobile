import { GpsTrackingPage } from './../gps-tracking/gps-tracking.page';
import { BlueToothDevicesPageModule } from './../blue-tooth-devices/blue-tooth-devices.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DashboardPage } from './dashboard.page';

const routes: Routes = [
  {
    path: '',
    component: DashboardPage
  },
  {
       path: 'devices',
      loadChildren: () => import('../blue-tooth-devices/blue-tooth-devices.module').then( m => m.BlueToothDevicesPageModule)
  },
  
  {
    path:'formsList',
    children:[
      {
        path:'',
        loadChildren: () => import('../forms/forms-list/forms-list.module').then( m => m.FormsListPageModule)
      },
      {
        path:"osmSketching/:fromForm/:isHistory",
        loadChildren: () => import('../osm/osm.module').then(m => m.OsmPageModule)
      },
      { 
        path: 'geometryObjectForm/:isHistory', 
        loadChildren: () => import('../sharedPages/geometry-object-form/geometry-object-form.module').then( m=> m.GeometryObjectFormPageModule) 
      },
      {
        path: 'records',
        children: [
          {
            path: 'formFiller' + '/:formId' + '/:recordId',
            loadChildren:() => import ('../sharedPages/form-builder/form-builder.module').then(m =>m.FormBuilderModule)
          },
          {
            path:':formName/:formId',
            loadChildren:() => import('../sharedPages/work-orders/work-orders.module').then(m =>m.WorkOrdersPageModule)
          }
        ]
      }
    ]
  },
  {
    path:'tasksList',
    children:[
      {
        path:"mapBox/:taskId/:assignmentId",
        loadChildren:() => import('../map/map.module').then(m =>m.MapPageModule)
      },
      {
        path:"googleMap/:taskId/:assignmentId",
        loadChildren:() => import('../google-maps/google-maps.module').then(m => m.GoogleMapsPageModule)
      },
      {
        path:"osm/:taskId/:assignmentId",
        loadChildren:() => import('../osm/osm.module').then(m => m.OsmPageModule)
      },
      {
        path:"osm/:data/:id",
        loadChildren:() => import('../osm/osm.module').then(m => m.OsmPageModule)
      },
      {
        path:"mapBoxSketching/:fromForm",
        loadChildren:() => import('../map/map.module').then(m => m.MapPageModule)
      },
      {
        path:"googleMapSketching/:fromForm",
        loadChildren:() => import('../google-maps/google-maps.module').then(m => m.GoogleMapsPageModule)
      },
      {
        path:"osmSketching/:fromForm/:isHistory",
        loadChildren:() => import('../osm/osm.module').then(m => m.OsmPageModule)
      },
      { 
        path: 'geometryObjectForm/:isHistory', 
        loadChildren:() => import('../sharedPages/geometry-object-form/geometry-object-form.module').then(m => m.GeometryObjectFormPageModule)
      },
      {
        path:':notificationId',
        loadChildren:() => import('../tasks/tasks-list/tasks-list.module').then(m =>m.TasksListPageModule)
      },
      {
        path:':taskId/:taskName/:assignmentId',
        children:[
          {
            path:':assignmentName/:formId/:notificationId',
            loadChildren:() => import('../sharedPages/work-orders/work-orders.module').then(m => m.WorkOrdersPageModule)
          },
          {
            path:':recordId/:formId',
            loadChildren:() => import('../sharedPages/form-builder/form-builder.module').then(m =>m.FormBuilderModule)
          }
        ]
      }
     
    ]
  },
  {
    path:'notifications',
    children:[
      {
        path:'',
        loadChildren:() => import('../notifications/notifications.module').then(m =>m.NotificationsPageModule)
      }
    ]
  },
  {
    path:'settings',
    
    children:[
      {
        path: 'devices',
        loadChildren:() => import('../blue-tooth-devices/blue-tooth-devices.module').then(m =>m.BlueToothDevicesPageModule)
      },
      {
        path:'',
        loadChildren:() => import('../settings/settings.module').then(m =>m.SettingsPageModule)
      },
      {
        path:'changePassword',
        loadChildren:() => import('../change-password/change-password.module').then(m =>m.ChangePasswordPageModule)
      },
      {
        path:'aboutus',
        loadChildren:() => import('../settings/aboutus/aboutus.module').then(m =>m.AboutusPageModule)
      },
      {
        path: 'gpsDevice',
        loadChildren:() => import('../gps-tracking/gps-tracking.module').then(m =>m.GpsTrackingPageModule)
      },
      {
        path: 'reference-list',
        loadChildren:() => import('../reference-list/reference-list.module').then(m => m.ReferenceListPageModule)
      }
    ]
  },
  {
    path:'history',
    children:[      
      {
        path:'form/:recordId/:formId',
        loadChildren:() => import('../sharedPages/form-builder/form-builder.module').then(m =>m.FormBuilderModule)
      },
      {
        path:':formId/:taskId/:assignmentId',
        loadChildren:() => import('../sharedPages/history/history.module').then(m =>m.HistoryPageModule)
      }
    ]
    
  }

];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class DashboardRoutingModule { }
