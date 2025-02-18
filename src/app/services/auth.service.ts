import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {User} from '../models/user.model';
import {LoginUserForm, LoginResponse} from '../models/loginUser.form';
import {environment} from '../../environments/environment';
import {JwtPayload} from '../models/jwtPayload.model';
import {jwtDecode} from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public _currentUser$: BehaviorSubject<LoginResponse | undefined>;

  constructor(
    private readonly _http: HttpClient,
    private readonly _router: Router
  ) {
    let jsonUser = localStorage.getItem("user")
    this._currentUser$ = new BehaviorSubject<LoginResponse | undefined>(
      jsonUser ? JSON.parse(jsonUser) : undefined
    );
  }

  // Méthode de connexion qui prend un formulaire et retourne une réponse observable
  login(form: LoginUserForm): Observable<LoginResponse> {
    // Envoi de la requête POST HTTP
    return this._http.post<LoginResponse>(environment.loginUser, form).pipe(
      // 'tap' permet d'effectuer des actions sans modifier la réponse
      tap(response => {
        // Met à jour l'état de l'utilisateur courant
        this._currentUser$.next(response);
        // Sauvegarde dans le stockage local du navigateur
        localStorage.setItem("user", JSON.stringify(response));
      })
    );
  }

  logout(): void {
    this._currentUser$.next(undefined);
    localStorage.removeItem("user")
    this._router.navigate(["/"])
  }

  // Méthode pour décoder le token JWT
  getTokenData(): JwtPayload | undefined {
    // Vérifie si un token existe
    if (this._currentUser$.value?.token) {
      // Décode le token pour obtenir les informations
      return jwtDecode<JwtPayload>(this._currentUser$.value.token);
    }
    return undefined;
  }
}
