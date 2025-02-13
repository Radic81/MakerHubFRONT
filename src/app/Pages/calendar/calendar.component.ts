import { Component, OnInit } from '@angular/core';
// Plugins FullCalendar
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
// Remplacez par votre services adapté aux rendez-vous
import { RendezVousService } from '../../services/rendezVous.service';
import {AuthService} from '../../services/auth.service';
import {User} from '../../models/user.model';
import {JwtPayload} from '../../models/jwtPayload.model';

@Component({
  selector: 'app-calendar',
  standalone: false,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  currentUser!: JwtPayload

  // Liste des rendez-vous (provenant de la table "rendez_vous")
  rendezVousList: any[] = [];

  today: string = '';
  calendarOptions: any = {
    initialView: 'dayGridMonth'
  };

  showDialog: boolean = false;

  // Pour le dialogue d'affichage ou d'édition
  clickedRendezVous: any = null;
  view: string = ''; // 'display', 'new' ou 'edit'
  changedRendezVous: any;

  // Propriétés pour la gestion des couleurs (tags)
  tags: any[] = [];

  // Pour la barre latérale
  medecins: any[] = [];
  selectedMedecin: any = null;

  constructor(
    private rendezVousService: RendezVousService,
    private readonly _auth: AuthService
  ) { }

  ngOnInit(): void {
    // Date initiale du calendrier
    this.today = '2022-05-11';

    // Exemple de données statiques pour les médecins (à remplacer par un appel à votre API si nécessaire)
    this.medecins = [
      { id: "1", name: 'Dr. Dupont' },
      { id: "2", name: 'Dr. Martin' },
      { id: "0", name: 'Dr. Dero' }
    ];

    // Récupération des rendez-vous depuis le back via le services
    this.rendezVousService.getRendezVous().subscribe(data => {
      this.rendezVousList = data;
      // On configure le calendrier avec la liste des rendez-vous
      this.calendarOptions = { ...this.calendarOptions, events: this.rendezVousList };
      // On peut récupérer les couleurs ou tags depuis chaque rendez-vous (selon votre mapping)
      this.tags = this.rendezVousList.map(item => item.tag);
    });

    // Configuration initiale de FullCalendar
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

    this.currentUser = this._auth.getTokenData()!
  }

  // Appelée lors du clic sur un rendez-vous dans le calendrier
  onRendezVousClick(e: any) {
    this.clickedRendezVous = e.event;
    let plainRendezVous = e.event.toPlainObject({ collapseExtendedProps: true, collapseColor: true });
    this.view = 'display';
    this.showDialog = true;

    this.changedRendezVous = { ...plainRendezVous, ...this.clickedRendezVous };
    this.changedRendezVous.start = this.clickedRendezVous.start;
    this.changedRendezVous.end = this.clickedRendezVous.end ? this.clickedRendezVous.end : this.clickedRendezVous.start;
  }

  // Appelée lors de la sélection d'une plage horaire pour créer un rendez-vous
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
      tag: { color: null, name: null }
    };
  }

  // Sauvegarde (création ou mise à jour) d'un rendez-vous
  handleSave() {
    if (!this.validate()) {
      return;
    } else {
      this.showDialog = false;
      this.clickedRendezVous = {
        ...this.changedRendezVous,
        backgroundColor: this.changedRendezVous.tag.color,
        borderColor: this.changedRendezVous.tag.color,
        textColor: '#212121'
      };

      if (this.clickedRendezVous.hasOwnProperty('id')) {
        // Modification d'un rendez-vous existant
        this.rendezVousList = this.rendezVousList.map(i =>
          i.id.toString() === this.clickedRendezVous.id.toString() ? this.clickedRendezVous : i
        );
      } else {
        // Création d'un nouveau rendez-vous
        this.rendezVousList = [
          ...this.rendezVousList,
          { ...this.clickedRendezVous, id: Math.floor(Math.random() * 10000) }
        ];
      }
      // Mise à jour des rendez-vous dans FullCalendar
      this.calendarOptions = { ...this.calendarOptions, events: this.rendezVousList };
      this.clickedRendezVous = null;
    }
  }

  onEditClick() {
    this.view = 'edit';
  }

  // Suppression d'un rendez-vous
  delete() {
    this.rendezVousList = this.rendezVousList.filter(i => i.id.toString() !== this.clickedRendezVous.id.toString());
    this.calendarOptions = { ...this.calendarOptions, events: this.rendezVousList };
    this.showDialog = false;
  }

  validate() {
    let { start, end } = this.changedRendezVous;
    return start && end;
  }

  // Méthode appelée lors de la sélection d'un médecin dans le menu déroulant
  onMedecinChange(event: any) {
    console.log("Médecin sélectionné :", this.selectedMedecin);
    // Ici, vous pourrez filtrer la liste des rendez-vous en fonction du médecin sélectionné.
    // Par exemple, si chaque rendez-vous possède une propriété "medecinId" mappée à "id_utilisateur" :
    // this.calendarOptions = { ...this.calendarOptions, events: this.rendezVousList.filter(rv => rv.medecinId === this.selectedMedecin.id) };
  }

  disconnect():void {
    this._auth.logout();
  }
}
