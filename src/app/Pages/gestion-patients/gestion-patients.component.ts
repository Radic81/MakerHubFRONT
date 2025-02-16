import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PatientService, Patient } from '../../services/patient.service';

@Component({
  selector: 'app-gestion-patients',
  standalone: false,
  templateUrl: './gestion-patients.component.html',
  styleUrls: ['./gestion-patients.component.css']
})
export class GestionPatientsComponent implements OnInit {
  patients: Patient[] = [];
  filteredPatients: Patient[] = [];
  searchTerm: string = '';

  // Gestion de la popup (dialog)
  displayDialog: boolean = false;
  dialogHeader: string = '';
  selectedPatient: Patient = {
    id_patient: 0,
    prenom: '',
    nom: '',
    telephone: '',
    numeroIdentite: ''
  };

  constructor(private router: Router, private patientService: PatientService) {}

  ngOnInit(): void {
    this.loadPatients();
  }

  // Charge la liste des patients depuis l'API
  loadPatients(): void {
    this.patientService.getAll().subscribe({
      next: (data) => {
        this.patients = data;
        this.filteredPatients = [...this.patients];
      },
      error: (error) => console.error("Erreur lors de la récupération des patients", error)
    });
  }

  onRetour(): void {
    this.router.navigate(['/calendar/admin']);
  }

  onSearch(): void {
    const term = this.searchTerm.trim().toLowerCase();
    if (term === '') {
      this.filteredPatients = [...this.patients];
    } else {
      this.filteredPatients = this.patients.filter(patient =>
        (patient.prenom + ' ' + patient.nom).toLowerCase().includes(term) ||
        patient.numeroIdentite.toLowerCase().includes(term)
      );
    }
  }

  onView(patient: Patient): void {
    this.selectedPatient = { ...patient };
    this.dialogHeader = 'Détails du patient';
    this.displayDialog = true;
  }

  onCreate(): void {
    this.selectedPatient = {
      id_patient: 0,
      prenom: '',
      nom: '',
      telephone: '',
      numeroIdentite: ''
    };
    this.dialogHeader = 'Créer un nouveau patient';
    this.displayDialog = true;
  }

  onSavePatient(): void {
    console.log("onSavePatient() a été appelé", this.selectedPatient);
    if (this.selectedPatient.id_patient && this.selectedPatient.id_patient !== 0) {
      // Mise à jour d'un patient existant
      this.patientService.update(this.selectedPatient.id_patient, this.selectedPatient)
        .subscribe({
          next: (updatedPatient) => {
            this.patients = this.patients.map(p =>
              p.id_patient === updatedPatient.id_patient ? updatedPatient : p
            );
            this.filteredPatients = [...this.patients];
            this.displayDialog = false;
          },
          error: (error) => console.error("Erreur lors de la mise à jour du patient", error)
        });
    } else {
      // Création d'un nouveau patient
      this.patientService.create(this.selectedPatient)
        .subscribe({
          next: (newPatient) => {
            this.patients.push(newPatient);
            this.filteredPatients = [...this.patients];
            this.displayDialog = false;
          },
          error: (error) => console.error("Erreur lors de la création du patient", error)
        });
    }
  }

  onDialogHide(): void {
    this.displayDialog = false;
  }
}
