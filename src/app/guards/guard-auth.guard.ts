import { CanActivateFn } from '@angular/router';

export const guardAuthGuard: CanActivateFn = (route, state) => {
  return true;
};
