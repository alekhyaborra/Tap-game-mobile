// import { NgModule } from '@angular/core';
// import { Routes, RouterModule } from '@angular/router';

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  
  // {
  //   path: 'page',
  //   loadChildren: () => import('./pages/page/page.module').then( m => m.PagePageModule)
  // },

   {
     path: 'login',
     loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
   },

   {
    path: 'changePassword/:username/:userType',
    loadChildren: () => import('./change-password/change-password.module').then( m => m.ChangePasswordPageModule)
  },

  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then( m => m.DashboardPageModule)
  },
  {
    path: 'blue-tooth-devices',
    loadChildren: () => import('./blue-tooth-devices/blue-tooth-devices.module').then( m => m.BlueToothDevicesPageModule)
  },
  {
    path: 'gps-tracking',
    loadChildren: () => import('./gps-tracking/gps-tracking.module').then( m => m.GpsTrackingPageModule)
  },

  //  {
  //    path: 'login',
  //    loadChildren: './login/login.module#LoginPageModule'
  //  },
  // {
  //   path: 'changePassword/:username/:userType',
  //   loadChildren: './change-password/change-password.module#ChangePasswordPageModule'
  // },
  // {
  //   path: 'dashboard',
  //   loadChildren: './dashboard/dashboard.module#DashboardPageModule'
  // },   
  // { 
  //   path: 'blue-tooth-devices', 
  //   loadChildren: './blue-tooth-devices/blue-tooth-devices.module#BlueToothDevicesPageModule'
  //  },
  // { 
  //   path: 'gps-tracking', loadChildren: './gps-tracking/gps-tracking.module#GpsTrackingPageModule' 
  // },
  



];

@NgModule({
  imports: [
    RouterModule.forRoot(routes,
    {
    }),
   
  ],
  exports: [RouterModule],
  providers: [
  ]
})
export class AppRoutingModule {}

























// const routes: Routes = [
//   { path: '', redirectTo: 'login', pathMatch: 'full' },
//   { 
//     path: 'login', 
//     loadChildren: './login/login.module#LoginPageModule' 
//   },

//   { 
//     path: 'dashboard', 
//     children:[
//       {
//         path:'',
//         children:[
//           {
//             path:'',
//             loadChildren:'./dashboard/dashboard.module#DashboardPageModule'
//           },
//           {
//             path:'formsList',
//             children:[
//               {
//                 path:'',
//                 loadChildren:'./forms/forms-list/forms-list.module#FormsListPageModule'
//               },{
//                 path:'records',
//                 children:[
//                   {
//                     path:'',
//                     loadChildren:'./forms/records-list/records-list.module#RecordsListPageModule'
//                   }
//                 ]
//               }
//             ]
//         }
//       ]
//       }
//     ]
//   }
// ];
