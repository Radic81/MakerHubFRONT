import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { RendezVousService } from '../../services/rendezVous.service';
import { AuthService } from '../../services/auth.service';
import { JwtPayload } from '../../models/jwtPayload.model';
import { UtilisateurService, Utilisateur } from '../../services/utilisateur.service';

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
  medecins: Utilisateur[] = []; // Utiliser l'interface Utilisateur
  selectedMedecin: Utilisateur | null = null;

  constructor(
    private rendezVousService: RendezVousService,
    private readonly _auth: AuthService,
    private cdr: ChangeDetectorRef,
    private utilisateurService: UtilisateurService // Injecter le service UtilisateurService
  ) { }

  ngOnInit(): void {
    this.today = new Date().toISOString().split('T')[0];

    // Récupérer les médecins depuis la base de données
    this.utilisateurService.getAll().subscribe(data => {
      this.medecins = data.filter(u => u.role === 1); // Filtrer les utilisateurs avec le rôle de médecin (role === 1)
      if (this.medecins.length > 0) {
        this.selectedMedecin = this.medecins[0]; // Sélectionner le premier médecin par défaut
        this.refreshCalendar();
      }
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
      console.error('Validation failed');
      return;
    }

    if (!this.selectedMedecin) {
      console.error('Aucun médecin sélectionné');
      // Ajouter une notification à l'utilisateur ici
      return;
    }

    const rendezVousToSave = {
      start: this.changedRendezVous.start.toISOString(),
      end: this.changedRendezVous.end.toISOString(),
      title: this.changedRendezVous.patientName,
      description: this.changedRendezVous.description,
      patientId: 0,
      medecinId: this.selectedMedecin.idUtilisateur
    };

    console.log('Saving rendez-vous:', rendezVousToSave);

    if (this.changedRendezVous.id) {
      this.rendezVousService.updateRendezVous(this.changedRendezVous.id, rendezVousToSave)
        .subscribe({
          next: () => {
            this.refreshCalendar();
            this.showDialog = false;
          },
          error: (error) => console.error('Error updating rendez-vous:', error)
        });
    } else {
      this.rendezVousService.createRendezVous(rendezVousToSave)
        .subscribe({
          next: () => {
            this.refreshCalendar();
            this.showDialog = false;
          },
          error: (error) => console.error('Error creating rendez-vous:', error)
        });
    }
  }

  private refreshCalendar() {
    if (this.selectedMedecin) {
      const medecinId = Number(this.selectedMedecin.idUtilisateur);
      console.log('Refreshing calendar for medecin ID:', medecinId);

      this.rendezVousService.getRendezVousByMedecin(medecinId)
        .subscribe({
          next: (events) => {
            console.log('Fetched events:', events);
            this.rendezVousList = events;
            this.calendarOptions = { ...this.calendarOptions, events: this.rendezVousList };
            this.calendarComponent.getApi().refetchEvents();
            this.cdr.detectChanges();
          },
          error: (error) => {
            console.error('Error fetching events:', error);
            // Gérer l'erreur de manière appropriée
            this.rendezVousList = [];
            this.calendarOptions = { ...this.calendarOptions, events: [] };
            this.calendarComponent.getApi().refetchEvents();
            this.cdr.detectChanges();
          }
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
    return start && end && this.selectedMedecin;
  }

  onMedecinChange(event: any) {
    console.log("Médecin sélectionné :", this.selectedMedecin);
    console.log("ID du médecin :", this.selectedMedecin?.idUtilisateur);
    this.refreshCalendar();
  }

  disconnect(): void {
    this._auth.logout();
  }
}
