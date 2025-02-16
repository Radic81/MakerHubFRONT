import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RendezVous {
  id: number;
  title: string;
  start: Date;
  end: Date;
  description: string;
  location: string;
  tag: { color: string, name: string };
  medecinId: number;
}

@Injectable({
  providedIn: 'root'
})
export class RendezVousService {
  private apiUrl = 'http://localhost:5191/api/RendezVous';

  constructor(private http: HttpClient) { }

  /**
   * Récupère la liste de tous les rendez-vous
   */
  getRendezVous(): Observable<RendezVous[]> {
    return this.http.get<RendezVous[]>(this.apiUrl);
  }

  /**
   * Récupère la liste des rendez-vous d'un médecin en particulier
   */
  getRendezVousByMedecin(medecinId: number): Observable<RendezVous[]> {
    return this.http.get<RendezVous[]>(`${this.apiUrl}/utilisateur/${medecinId}`);
  }

  // Méthodes pour créer, mettre à jour ou supprimer un rendez-vous :

  createRendezVous(rdv: RendezVous): Observable<any> {
    return this.http.post(this.apiUrl, rdv);
  }

  updateRendezVous(id: number, rdv: RendezVous): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, rdv);
  }

  deleteRendezVous(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
