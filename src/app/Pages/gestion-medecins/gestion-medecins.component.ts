import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UtilisateurService, Utilisateur } from '../../services/utilisateur.service';

@Component({
  selector: 'app-gestion-medecins',
  standalone: false,
  templateUrl: './gestion-medecins.component.html',
  styleUrls: ['./gestion-medecins.component.css']
})
export class GestionMedecinsComponent implements OnInit {
  medecins: Utilisateur[] = [];
  filteredMedecins: Utilisateur[] = [];
  searchTerm: string = '';

  // Pour la gestion du formulaire en popup
  displayDialog: boolean = false;
  dialogHeader: string = '';
  selectedMedecin: Utilisateur = {
    idUtilisateur: 0,
    motDePasse: '',
    email: '',
    role: 2, // par exemple, rôle "médecin"
    nom: '',
    prenom: '',
    telephone: ''
  };

  constructor(private router: Router, private utilisateurService: UtilisateurService) {}

  ngOnInit(): void {
    this.loadMedecins();
  }

  // Charge la liste des médecins depuis l'API
  loadMedecins(): void {
    this.utilisateurService.getAll().subscribe({
      next: (data) => {
        this.medecins = data;
        this.filteredMedecins = [...this.medecins];
      },
      error: (err) => console.error('Erreur lors de la récupération des médecins :', err)
    });
  }

  onSearch(): void {
    const term = this.searchTerm.trim().toLowerCase();
    if (term === '') {
      this.filteredMedecins = [...this.medecins];
    } else {
      this.filteredMedecins = this.medecins.filter(medecin =>
        ((medecin.prenom || '') + ' ' + (medecin.nom || '')).toLowerCase().includes(term) ||
        medecin.email.toLowerCase().includes(term)
      );
    }
  }

  onView(medecin: Utilisateur): void {
    this.selectedMedecin = { ...medecin };
    this.dialogHeader = 'Détails du médecin';
    this.displayDialog = true;
  }

  onCreate(): void {
    this.selectedMedecin = {
      idUtilisateur: 0,
      motDePasse: '',
      email: '',
      role: 2,
      nom: '',
      prenom: '',
      telephone: ''
    };
    this.dialogHeader = 'Créer un nouveau médecin';
    this.displayDialog = true;
  }

  // Sauvegarde (création ou mise à jour) d'un médecin
  onSaveMedecin(): void {
    if (this.selectedMedecin.idUtilisateur && this.selectedMedecin.idUtilisateur !== 0) {
      // Mise à jour d'un médecin existant
      this.utilisateurService.update(this.selectedMedecin.idUtilisateur, this.selectedMedecin)
        .subscribe({
          next: () => {
            this.loadMedecins();
            this.displayDialog = false;
          },
          error: (err) => console.error('Erreur lors de la mise à jour du médecin :', err)
        });
    } else {
      // Création d'un nouveau médecin
      this.utilisateurService.create(this.selectedMedecin)
        .subscribe({
          next: (nouveauMedecin) => {
            this.medecins.push(nouveauMedecin);
            this.filteredMedecins = [...this.medecins];
            this.displayDialog = false;
          },
          error: (err) => console.error('Erreur lors de la création du médecin :', err)
        });
    }
  }

  // Fermeture de la popup
  onDialogHide(): void {
    this.displayDialog = false;
  }

  onRetour(): void {
    this.router.navigate(['/calendar/admin']);
  }
}
