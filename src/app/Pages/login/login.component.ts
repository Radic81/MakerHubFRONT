import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoginForm } from '../../forms/login.form';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private readonly router: Router,
    private readonly _fb: FormBuilder,
    private readonly _auth: AuthService
  ) {
    this.loginForm = this._fb.group({...LoginForm});
  }

  submit(): void {
    this.loginForm.markAsTouched();

    if (!this.loginForm.valid) return;

    this._auth.login(this.loginForm.value).subscribe({
      next: (response) => {
        const tokenData = this._auth.getTokenData();
        if (tokenData) {
          const userRole = tokenData["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

          if (userRole === '0') {
            // Pour l'admin
            this.router.navigate(['/calendar/admin']);
          } else if (userRole === '1') {
            // Pour un médecin, on récupère l'ID via nameidentifier
            const doctorId = tokenData["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
            if (!doctorId) {
              console.error("Identifiant médecin introuvable dans le token");
              // On peut afficher une notification ou rediriger ailleurs en cas d'erreur
            } else {
              // Convertir en nombre si nécessaire
              this.router.navigate(['/calendar/medecin', Number(doctorId)]);
            }
          }
        }
      },
      error: (err) => {
        console.error('Erreur de connexion:', err);
        // Afficher un message d'erreur à l'utilisateur
      }
    });
  }
}
