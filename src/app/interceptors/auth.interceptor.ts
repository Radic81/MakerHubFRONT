import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const userJson = localStorage.getItem('user');
  if (userJson) {
    const user = JSON.parse(userJson);
    if (user?.token) {
      const clonedReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${user.token}`
        }
      });
      return next(clonedReq);
    }
  }
  return next(req);
};
