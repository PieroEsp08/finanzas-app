import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { from, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  const apiUrL = environment.apiUrl;

  return from(authService.getSession()).pipe(
    switchMap(({ data }) => {
      const token = data.session?.access_token;

      if (token && req.url.startsWith(apiUrL)) {
        const reqConToken = req.clone({
          headers: req.headers.set('Authorization', `Bearer ${token}`)
        });
        return next(reqConToken);
      }

      return next(req);
    })
  );
};