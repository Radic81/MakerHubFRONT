import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gestion-medecins',
  standalone: false,
  templateUrl: './gestion-medecins.component.html',
  styleUrls: ['./gestion-medecins.component.css']
})
export class GestionMedecinsComponent implements OnInit {
  // Liste complète des médecins (données fictives pour l'instant)
  medecins: any[] = [];
  // Liste filtrée (mise à jour lors de la recherche)
  filteredMedecins: any[] = [];
  searchTerm: string = '';

  // Gestion de la popup (dialog)
  displayDialog: boolean = false;
  dialogHeader: string = '';
  // Objet représentant le médecin sélectionné ou en cours de création/modification
  selectedMedecin: any = {};

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Chargement initial des médecins (données fictives)
    this.medecins = [
      { id_utilisateur: 1, prenom: 'Alice', nom: 'Dupont', email: 'alice.dupont@hotmail.com', telephone: '0472984559' },
      { id_utilisateur: 2, prenom: 'Bob', nom: 'Martin', email: 'bob.martin@google.be', telephone: '0484903710' },
      { id_utilisateur: 3, prenom: 'Charlie', nom: 'Durand', email: 'charlie.durand@yahoo.fr', telephone: '0477472919' },
      { id_utilisateur: 4, prenom: 'David', nom: 'Lefevre', email: 'david.lefevre@telenet.be', telephone: '0482901749' },
      { id_utilisateur: 5, prenom: 'Eva', nom: 'Leroy', email: 'eva.leroy@outsiplou.lesbains', telephone: '0472770741' },
      { id_utilisateur: 6, prenom: 'Fabien', nom: 'Lambert', email: 'fabien.lambert@net.core', telephone: '0484248116' },
      // Vous pouvez ajouter d'autres exemples ou récupérer les données via un services
    ];
    this.filteredMedecins = [...this.medecins];
  }

  // Retour à la page précédente
  onRetour() {
    this.router.navigate(['/calendar/admin']);
  }

  // Filtrage des médecins selon le terme de recherche
  onSearch() {
    const term = this.searchTerm.trim().toLowerCase();
    if (term === '') {
      this.filteredMedecins = [...this.medecins];
    } else {
      this.filteredMedecins = this.medecins.filter(medecin =>
        (medecin.prenom + ' ' + medecin.nom).toLowerCase().includes(term) ||
        medecin.email.toLowerCase().includes(term)
      );
    }
  }

  // Ouverture de la popup en mode affichage/modification (au clic sur "Voir")
  onView(medecin: any) {
    this.selectedMedecin = { ...medecin };
    this.dialogHeader = 'Détails du médecin';
    this.displayDialog = true;
  }

  // Ouverture de la popup en mode création (au clic sur "Créer")
  onCreate() {
    console.log("onCreate déclenché");
    this.selectedMedecin = { prenom: '', nom: '', email: '', mot_de_passe: '', telephone: '' };
    this.dialogHeader = 'Créer un nouveau médecin';
    this.displayDialog = true;
    console.log("displayDialog =", this.displayDialog);
  }


  // Sauvegarde (création ou mise à jour) du médecin
  onSaveMedecin() {
    if (this.selectedMedecin.id_utilisateur) {
      // Modification d'un médecin existant
      this.medecins = this.medecins.map(m =>
        m.id_utilisateur === this.selectedMedecin.id_utilisateur ? this.selectedMedecin : m
      );
    } else {
      // Création d'un nouveau médecin (attribution d'un id fictif)
      this.selectedMedecin.id_utilisateur = Math.floor(Math.random() * 10000);
      this.medecins.push(this.selectedMedecin);
    }
    // Mise à jour de la liste filtrée et fermeture de la popup
    this.filteredMedecins = [...this.medecins];
    this.displayDialog = false;
  }

  // Fermeture de la popup
  onDialogHide() {
    this.displayDialog = false;
  }
}
