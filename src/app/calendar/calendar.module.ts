import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarRoutingModule } from './calendar-routing.module';
import { CalendarComponent } from './calendar.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { CalendarModule as PrimeCalendarModule } from 'primeng/calendar';
import {EventService} from '../service/event.service';
import {Textarea} from 'primeng/textarea';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CalendarRoutingModule,
    FullCalendarModule,
    DialogModule,
    Textarea,
    ButtonModule,
    PrimeCalendarModule,
    InputTextModule,
    DropdownModule,
    ToastModule,
    RippleModule
  ],
  declarations: [CalendarComponent],
  providers: [EventService, ]
})
export class CalendarModule { }
