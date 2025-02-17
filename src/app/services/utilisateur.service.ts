import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// Interface pour typer les utilisateurs (médecins)
export interface Utilisateur {
  idUtilisateur: number;
  motDePasse: string;
  email: string;
  role: number;
  nom?: string;
  prenom?: string;
  telephone: string;
}

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {
  // L'URL de base pour les endpoints des utilisateurs
  private apiUrl = environment.utilisateurApi;

  constructor(private http: HttpClient) { }

  // Récupère la liste de tous les utilisateurs (médecins)
  getAll(): Observable<Utilisateur[]> {
    return this.http.get<Utilisateur[]>(this.apiUrl);
  }

  // Récupère un utilisateur par son id
  getById(id: number): Observable<Utilisateur> {
    return this.http.get<Utilisateur>(`${this.apiUrl}/${id}`);
  }

  // Crée un nouvel utilisateur
  create(utilisateur: Utilisateur): Observable<Utilisateur> {
    console.log('Données envoyées à l\'API:', utilisateur); // Ajout du log
    return this.http.post<Utilisateur>(this.apiUrl, utilisateur);
  }

  // Met à jour un utilisateur existant
  update(id: number, utilisateur: Utilisateur): Observable<Utilisateur> {
    return this.http.put<Utilisateur>(`${this.apiUrl}/${id}`, utilisateur);
  }
}
