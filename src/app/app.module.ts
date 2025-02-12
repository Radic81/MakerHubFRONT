import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { GestionMedecinsComponent } from './gestion-medecins/gestion-medecins.component';
import {Dialog} from 'primeng/dialog';
import {ButtonDirective} from 'primeng/button';
import {InputText} from 'primeng/inputtext';
import {PrimeTemplate} from 'primeng/api';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    GestionMedecinsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    Dialog,
    ButtonDirective,
    InputText,
    PrimeTemplate
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
