import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone : false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private router: Router) {}

  login(): void {
    if (this.username && this.password) {
      if (this.username.toLowerCase() === 'admin') {
        this.router.navigate(['/calendar/admin']);
      } else {
        this.router.navigate(['/calendar/medecin'], { queryParams: { user: this.username } });
      }
    }
  }
}
