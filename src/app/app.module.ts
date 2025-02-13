import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { GestionMedecinsComponent } from './pages/gestion-medecins/gestion-medecins.component';
import {CalendarComponent} from './pages/calendar/calendar.component';

// Importation des modules PrimeNG appropriés
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import {provideAnimations} from '@angular/platform-browser/animations';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {DropdownModule} from 'primeng/dropdown';
import {FullCalendarModule} from '@fullcalendar/angular';
import {Calendar} from 'primeng/calendar';
import { GestionPatientsComponent } from './pages/gestion-patients/gestion-patients.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    GestionMedecinsComponent,
    CalendarComponent,
    GestionPatientsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    FullCalendarModule,
    Calendar,
    ReactiveFormsModule
  ],
  providers: [
    provideAnimations(),
    provideHttpClient(
      withInterceptors([])
    )
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
