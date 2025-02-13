import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {FormBuilder, FormGroup} from '@angular/forms';
import {LoginForm} from '../../forms/login.form';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone : false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup

  constructor(
    private readonly router: Router,
    private readonly _fb: FormBuilder,
    private readonly _auth: AuthService
  ) {
    this.loginForm = this._fb.group({...LoginForm})
  }

  submit(): void {
    this.loginForm.markAsTouched();

    if (!this.loginForm.valid) return;

    this._auth.login(this.loginForm.value).subscribe({
      next: _ => {
        this.router.navigate(["calendar/admin"]);
      },
      error: err => {
        console.log(err);
      }
    })
  }
}
