import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'  // Cela permet d'utiliser le service partout dans l'application sans l'ajouter dans les providers manuellement
})
export class RendezVousService {

  constructor() { }

  /**
   * Récupère la liste des rendez-vous.
   * Pour l'instant, nous retournons des données fictives.
   */
  getRendezVous(): Observable<any[]> {
    // Exemple de données fictives (à remplacer par un appel HTTP plus tard)
    const rendezVousDummy = [
      {
        id: 1,
        title: "Consultation Dr. Dupont",
        start: new Date("2022-05-11T08:00:00"),
        end: new Date("2022-05-11T09:00:00"),
        description: "Consultation générale",
        location: "Salle 101",
        tag: { color: "#FF0000", name: "Urgent" },
        medecinId: 1
      },
      {
        id: 2,
        title: "Visite Dr. Martin",
        start: new Date("2022-05-12T10:00:00"),
        end: new Date("2022-05-12T10:30:00"),
        description: "Suivi régulier",
        location: "Salle 102",
        tag: { color: "#00FF00", name: "Suivi" },
        medecinId: 2
      }
    ];
    return of(rendezVousDummy);
  }

  // Vous pourrez ajouter ici d'autres méthodes (par exemple, pour créer, modifier ou supprimer un rendez-vous)
}
