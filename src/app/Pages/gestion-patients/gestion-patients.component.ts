import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gestion-patients',
  standalone: false,
  templateUrl: './gestion-patients.component.html',
  styleUrls: ['./gestion-patients.component.css']
})
export class GestionPatientsComponent implements OnInit {
  // Liste complète des patients (données fictives pour l'instant)
  patients: any[] = [];
  // Liste filtrée (mise à jour lors de la recherche)
  filteredPatients: any[] = [];
  searchTerm: string = '';

  // Gestion de la popup (dialog)
  displayDialog: boolean = false;
  dialogHeader: string = '';
  // Objet représentant le patient sélectionné ou en cours de création/modification
  selectedPatient: any = {};

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Chargement initial des patients (données fictives)
    this.patients = [
      { id_patient: 1, prenom: 'Alice', nom: 'Dupont', email: 'alice.dupont@hotmail.com', telephone: '0472984559' },
      { id_patient: 2, prenom: 'Bob', nom: 'Martin', email: 'bob.martin@google.be', telephone: '0484903710' },
      { id_patient: 3, prenom: 'Charlie', nom: 'Durand', email: 'charlie.durand@yahoo.fr', telephone: '0477472919' },
      { id_patient: 4, prenom: 'David', nom: 'Lefevre', email: 'david.lefevre@telenet.be', telephone: '0482901749' },
      { id_patient: 5, prenom: 'Eva', nom: 'Leroy', email: 'eva.leroy@outsiplou.lesbains', telephone: '0472770741' },
      { id_patient: 6, prenom: 'Fabien', nom: 'Lambert', email: 'fabien.lambert@net.core', telephone: '0484248116' },
      // Vous pouvez ajouter d'autres exemples ou récupérer les données via un service
    ];
    this.filteredPatients = [...this.patients];
  }

  // Retour à la page précédente
  onRetour() {
    this.router.navigate(['/calendar/admin']);
  }

  // Filtrage des patients selon le terme de recherche
  onSearch() {
    const term = this.searchTerm.trim().toLowerCase();
    if (term === '') {
      this.filteredPatients = [...this.patients];
    } else {
      this.filteredPatients = this.patients.filter(patient =>
        (patient.prenom + ' ' + patient.nom).toLowerCase().includes(term) ||
        patient.email.toLowerCase().includes(term)
      );
    }
  }

  // Ouverture de la popup en mode affichage/modification (au clic sur "Voir")
  onView(patient: any) {
    this.selectedPatient = { ...patient };
    this.dialogHeader = 'Détails du patient';
    this.displayDialog = true;
  }

  // Ouverture de la popup en mode création (au clic sur "Créer")
  onCreate() {
    console.log("onCreate déclenché");
    this.selectedPatient = { prenom: '', nom: '', email: '', mot_de_passe: '', telephone: '' };
    this.dialogHeader = 'Créer un nouveau patient';
    this.displayDialog = true;
    console.log("displayDialog =", this.displayDialog);
  }

  // Sauvegarde (création ou mise à jour) du patient
  onSavePatient() {
    if (this.selectedPatient.id_patient) {
      // Modification d'un patient existant
      this.patients = this.patients.map(p =>
        p.id_patient === this.selectedPatient.id_patient ? this.selectedPatient : p
      );
    } else {
      // Création d'un nouveau patient (attribution d'un id fictif)
      this.selectedPatient.id_patient = Math.floor(Math.random() * 10000);
      this.patients.push(this.selectedPatient);
    }
    // Mise à jour de la liste filtrée et fermeture de la popup
    this.filteredPatients = [...this.patients];
    this.displayDialog = false;
  }

  // Fermeture de la popup
  onDialogHide() {
    this.displayDialog = false;
  }
}
