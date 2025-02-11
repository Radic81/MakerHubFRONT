import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'calendar/admin', loadChildren: () => import('./calendar/calendar.module').then(m => m.CalendarModule) },
  { path: 'calendar/medecin', loadChildren: () => import('./calendar/calendar.module').then(m => m.CalendarModule) },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
