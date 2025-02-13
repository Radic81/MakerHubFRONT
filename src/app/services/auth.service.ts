import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {User} from '../models/user.model';
import {LoginUserForm} from '../models/loginUser.form';
import {environment} from '../../environments/environment';
import {JwtPayload} from '../models/jwtPayload.model';
import {jwtDecode} from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public _currentUser$: BehaviorSubject<User | undefined>;

  constructor(
    private readonly _http: HttpClient,
    private readonly _router: Router
  ) {
    let jsonUser = localStorage.getItem("user")
    this._currentUser$ = new BehaviorSubject<User | undefined>(
      jsonUser ? JSON.parse(jsonUser) : undefined
    );
  }

  login(form: LoginUserForm): Observable<User> {
    return this._http.post<User>(environment.loginUser, form).pipe(
      tap(user => {
        this._currentUser$.next(user);
        localStorage.setItem("user", JSON.stringify(user));
      })
    );
  }

  logout(): void {
    this._currentUser$.next(undefined);
    localStorage.removeItem("user")
    this._router.navigate(["/"])
  }

  getTokenData(): JwtPayload | undefined {
    if (this._currentUser$.value?.token) {
      return jwtDecode<JwtPayload>(this._currentUser$.value.token);
    }
    return undefined;
  }
}
