import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import {GestionMedecinsComponent} from './pages/gestion-medecins/gestion-medecins.component';
import {CalendarComponent} from './pages/calendar/calendar.component';
import {GestionPatientsComponent} from './pages/gestion-patients/gestion-patients.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'calendar/admin', component: CalendarComponent },
  { path: 'gestion-medecins', component: GestionMedecinsComponent },
  { path: 'gestion-patients', component: GestionPatientsComponent },
  { path: '', redirectTo: '/accueil', pathMatch: 'full' },
  { path: '**', redirectTo: '/accueil' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
