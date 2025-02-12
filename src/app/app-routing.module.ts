import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import {GestionMedecinsComponent} from './gestion-medecins/gestion-medecins.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'calendar/admin', loadChildren: () => import('./calendar/calendar.module').then(m => m.CalendarModule) },
  { path: 'calendar/medecin', loadChildren: () => import('./calendar/calendar.module').then(m => m.CalendarModule) },
  { path: 'gestion-medecins', component: GestionMedecinsComponent },
  { path: '', redirectTo: '/accueil', pathMatch: 'full' },
  { path: '**', redirectTo: '/accueil' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
