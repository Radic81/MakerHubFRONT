import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { jwtDecode } from 'jwt-decode';
import { JwtPayload } from '../models/jwtPayload.model';

export const authGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Récupérer l'utilisateur actuel
  const currentUser = authService._currentUser$.value;

  // Si pas d'utilisateur ou pas de token, rediriger vers login
  if (!currentUser?.token) {
    router.navigate(['/login']);
    return false;
  }

  // Décoder le token pour obtenir le rôle
  const tokenData = jwtDecode<JwtPayload>(currentUser.token);
  const userRole = tokenData["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

  // Si la route nécessite un rôle spécifique
  if (route.data?.['roles'] && !route.data['roles'].includes(userRole)) {
    // Rediriger vers une page d'erreur ou le dashboard approprié
    if (userRole === '0') {
      router.navigate(['/calendar/admin']);
    } else {
      router.navigate(['/calendar/medecin']);
    }
    return false;
  }

  return true;
};
