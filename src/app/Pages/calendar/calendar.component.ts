import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { RendezVousService } from '../../services/rendezVous.service';
import { AuthService } from '../../services/auth.service';
import { JwtPayload } from '../../models/jwtPayload.model';

@Component({
  selector: 'app-calendar',
  standalone: false,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

  currentUser!: JwtPayload;
  rendezVousList: any[] = [];
  today: string = '';
  calendarOptions: any = {
    initialView: 'dayGridMonth'
  };
  showDialog: boolean = false;
  clickedRendezVous: any = null;
  view: string = ''; // 'display', 'new' ou 'edit'
  changedRendezVous: any;
  tags: any[] = [];
  medecins: any[] = [];
  selectedMedecin: any = null;

  constructor(
    private rendezVousService: RendezVousService,
    private readonly _auth: AuthService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.today = new Date().toISOString().split('T')[0];
    this.medecins = [
      { id: "1", name: 'Dr. Dupont' },
      { id: "2", name: 'Dr. Martin' },
      { id: "0", name: 'Dr. Dero' }
    ];

    this.rendezVousService.getRendezVous().subscribe(data => {
      this.rendezVousList = data;
      this.calendarOptions = { ...this.calendarOptions, events: this.rendezVousList };
      this.tags = this.rendezVousList.map(item => item.tag);
    });

    this.calendarOptions = {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      height: 720,
      initialDate: this.today,
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      editable: true,
      selectable: true,
      selectMirror: true,
      dayMaxEvents: true,
      eventClick: (e: any) => this.onRendezVousClick(e),
      select: (e: any) => this.onDateSelect(e)
    };

    this.currentUser = this._auth.getTokenData()!;
  }

  onRendezVousClick(e: any) {
    this.clickedRendezVous = e.event;
    let plainRendezVous = e.event.toPlainObject({ collapseExtendedProps: true, collapseColor: true });
    this.view = 'display';
    this.showDialog = true;

    this.changedRendezVous = { ...plainRendezVous, ...this.clickedRendezVous };
    this.changedRendezVous.start = new Date(this.clickedRendezVous.start);
    this.changedRendezVous.end = new Date(this.clickedRendezVous.end ? this.clickedRendezVous.end : this.clickedRendezVous.start);
    this.changedRendezVous.patientName = this.clickedRendezVous.extendedProps.patientName;
  }

  onDateSelect(e: any) {
    this.view = 'new';
    this.showDialog = true;
    this.changedRendezVous = {
      ...e,
      title: null,
      description: null,
      location: null,
      backgroundColor: null,
      borderColor: null,
      textColor: null,
      tag: { color: null, name: null },
      start: new Date(e.start),
      end: new Date(e.end)
    };
  }

  handleSave() {
    if (!this.validate()) {
      return;
    }

    const rendezVousToSave = {
      start: this.changedRendezVous.start,
      end: this.changedRendezVous.end,
      title: this.changedRendezVous.patientName, // On utilise patientName comme motifRdv
      description: this.changedRendezVous.description,
      patientId: 0, // À remplacer par l'ID du patient si vous l'avez
      medecinId: this.selectedMedecin
    };

    if (this.changedRendezVous.id) {
      this.rendezVousService.updateRendezVous(this.changedRendezVous.id, rendezVousToSave)
        .subscribe({
          next: () => {
            this.refreshCalendar();
            this.showDialog = false;
          },
          error: (error) => console.error('Erreur lors de la mise à jour:', error)
        });
    } else {
      this.rendezVousService.createRendezVous(rendezVousToSave)
        .subscribe({
          next: () => {
            this.refreshCalendar();
            this.showDialog = false;
          },
          error: (error) => console.error('Erreur lors de la création:', error)
        });
    }
  }

  private refreshCalendar() {
    if (this.selectedMedecin) {
      this.rendezVousService.getRendezVousByMedecin(this.selectedMedecin)
        .subscribe(events => {
          console.log('Fetched events for medecin:', events);
          this.rendezVousList = events;
          this.calendarOptions = { ...this.calendarOptions, events: this.rendezVousList };
          this.calendarComponent.getApi().refetchEvents(); // Forcer la mise à jour des événements
          this.cdr.detectChanges(); // Forcer la détection des changements
        });
    } else {
      this.rendezVousService.getRendezVous()
        .subscribe(events => {
          console.log('Recherche des évènements:', events);
          this.rendezVousList = events;
          this.calendarOptions = { ...this.calendarOptions, events: this.rendezVousList };
          this.calendarComponent.getApi().refetchEvents(); // Forcer la mise à jour des événements
          this.cdr.detectChanges(); // Forcer la détection des changements
        });
    }
  }

  onEditClick() {
    this.view = 'edit';
  }

  delete() {
    this.rendezVousList = this.rendezVousList.filter(i => i.id.toString() !== this.clickedRendezVous.id.toString());
    this.calendarOptions = { ...this.calendarOptions, events: this.rendezVousList };
    this.showDialog = false;
  }

  validate() {
    let { start, end } = this.changedRendezVous;
    return start && end;
  }

  onMedecinChange(event: any) {
    console.log("Médecin sélectionné :", this.selectedMedecin);
    // Ici, vous pourrez filtrer la liste des rendez-vous en fonction du médecin sélectionné.
    // Par exemple, si chaque rendez-vous possède une propriété "medecinId" mappée à "id_utilisateur" :
    // this.calendarOptions = { ...this.calendarOptions, events: this.rendezVousList.filter(rv => rv.medecinId === this.selectedMedecin.id) };
  }

  disconnect(): void {
    this._auth.logout();
  }
}
