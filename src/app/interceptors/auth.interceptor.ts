import { HttpInterceptorFn } from '@angular/common/http';

// Définit une fonction d'interception HTTP avec le type HttpInterceptorFn
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // localStorage.getItem : méthode du navigateur pour récupérer une donnée stockée
  // 'user' : la clé sous laquelle nos données utilisateur sont stockées
  const userJson = localStorage.getItem('user');

  // Si on a trouvé des données utilisateur
  if (userJson) {
    // JSON.parse : convertit une chaîne JSON en objet JavaScript
    const user = JSON.parse(userJson);

    // Vérifie si l'utilisateur a un token (avec l'opérateur '?.' de sécurité)
    if (user?.token) {
      // req.clone() : crée une copie de la requête car on ne peut pas modifier l'originale
      const clonedReq = req.clone({
        // setHeaders : définit les en-têtes HTTP de la requête
        setHeaders: {
          // Format standard d'authentification : 'Bearer' suivi du token
          // Les backticks `` permettent d'insérer des variables avec ${...}
          Authorization: `Bearer ${user.token}`
        }
      });
      // Envoie la requête modifiée
      return next(clonedReq);
    }
  }
  // Si pas de token, envoie la requête originale sans modification
  return next(req);
};
