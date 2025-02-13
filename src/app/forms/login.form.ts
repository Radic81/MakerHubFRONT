import {Validators} from '@angular/forms';

export const LoginForm = {
  email:      [null, [Validators.required, Validators.email]],
  motDePasse:   [null, [Validators.required, Validators.minLength(2)]]
}
