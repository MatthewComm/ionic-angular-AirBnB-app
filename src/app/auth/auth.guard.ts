import { Injectable } from '@angular/core';
import { CanMatchFn, Route, UrlSegment, Router, UrlTree } from '@angular/router';
import { Observable, map, take, switchMap, of } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canMatch(): Observable<boolean | UrlTree> {
    return this.authService.userIsAuthenticated.pipe(
      take(1),
      switchMap(isAuthenticated => {
        if (!isAuthenticated) {
          return this.authService.autoLogin().pipe(
            map(autoLoggedIn => {
              if (autoLoggedIn) {
                return true;
              } else {
                return this.router.createUrlTree(['/auth']);
              }
            })
          );
        } else {
          return of(true);
        }
      })
    );
  }
}
