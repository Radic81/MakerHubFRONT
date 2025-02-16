import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// Interface Patient mise à jour pour correspondre au modèle backend
export interface Patient {
  id_patient: number;
  prenom: string;
  nom: string;
  telephone: string;
  numeroIdentite: string; // Champ obligatoire selon Patient.cs du backend
}

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  // L'URL de base pour les endpoints patients, définie dans environment.ts
  private apiUrl = environment.patientApi;

  constructor(private http: HttpClient) { }

  getAll(): Observable<Patient[]> {
    return this.http.get<Patient[]>(this.apiUrl);
  }

  getById(id: number): Observable<Patient> {
    return this.http.get<Patient>(`${this.apiUrl}/${id}`);
  }

  create(patient: Patient): Observable<Patient> {
    return this.http.post<Patient>(this.apiUrl, patient);
  }

  update(id: number, patient: Patient): Observable<Patient> {
    return this.http.put<Patient>(`${this.apiUrl}/${id}`, patient);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
