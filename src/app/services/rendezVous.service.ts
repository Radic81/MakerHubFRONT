import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import { map } from 'rxjs/operators';

export interface RendezVous {
  idRendezVous?: number;
  dateDebut: Date;
  dateFin: Date;
  description?: string;
  motifRdv?: string;
  idPatient: number;
  idUtilisateur: number;
}

@Injectable({
  providedIn: 'root'
})
export class RendezVousService {
  private apiUrl = 'http://localhost:5191/api/RendezVous';

  constructor(private http: HttpClient) { }

  getRendezVous(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(rdvs => rdvs.map(rdv => ({
        id: rdv.idRendezVous,
        title: rdv.motifRdv || 'Sans titre',
        start: rdv.dateDebut,
        end: rdv.dateFin,
        description: rdv.description,
        patientId: rdv.idPatient,
        medecinId: rdv.idUtilisateur
      })))
    );
  }

  getRendezVousByMedecin(medecinId: number): Observable<any[]> {
    console.log('Appel API pour le médecin:', medecinId);
    return this.http.get<any[]>(`${this.apiUrl}/utilisateur/${medecinId}`).pipe(
      tap(data => console.log('Données reçues:', data)),
      map(rdvs => rdvs.map(rdv => ({
        id: rdv.idRendezVous,
        title: rdv.motifRdv || 'Sans titre',
        start: rdv.dateDebut,
        end: rdv.dateFin,
        description: rdv.description,
        patientId: rdv.idPatient,
        medecinId: rdv.idUtilisateur
      })))
    );
  }

  createRendezVous(rdv: any): Observable<any> {
    const payload = {
      dateDebut: rdv.start,
      dateFin: rdv.end,
      description: rdv.description,
      motifRdv: rdv.title,
      idPatient: rdv.patientId || 0,
      idUtilisateur: rdv.medecinId
    };
    return this.http.post(this.apiUrl, payload);
  }

  updateRendezVous(id: number, rdv: any): Observable<any> {
    const payload = {
      dateDebut: rdv.start,
      dateFin: rdv.end,
      description: rdv.description,
      motifRdv: rdv.title,
      idPatient: rdv.patientId || 0,
      idUtilisateur: rdv.medecinId
    };
    return this.http.put(`${this.apiUrl}/${id}`, payload);
  }

  deleteRendezVous(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
