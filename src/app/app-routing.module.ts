import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Pages/login/login.component';
import { GestionMedecinsComponent } from './Pages/gestion-medecins/gestion-medecins.component';
import { CalendarComponent } from './Pages/calendar/calendar.component';
import { GestionPatientsComponent } from './Pages/gestion-patients/gestion-patients.component';
import { authGuard } from './guards/guard-auth.guard';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'calendar/admin',
    component: CalendarComponent,
    canActivate: [authGuard],
    data: { roles: ['0'] }  // Accessible uniquement pour l'admin
  },
  {
    path: 'calendar/medecin/:id',  // Route pour médecin avec l'ID en paramètre
    component: CalendarComponent,
    canActivate: [authGuard],
    data: { roles: ['1'] }  // Accessible uniquement pour les médecins
  },
  {
    path: 'gestion-medecins',
    component: GestionMedecinsComponent,
    canActivate: [authGuard],
    data: { roles: ['0'] }
  },
  {
    path: 'gestion-patients',
    component: GestionPatientsComponent,
    canActivate: [authGuard],
    data: { roles: ['0'] }
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
