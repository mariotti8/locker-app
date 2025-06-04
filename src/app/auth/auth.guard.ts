// src/app/guards/auth.guard.ts
import { inject, Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest } from 'rxjs';
import { filter, take, map } from 'rxjs/operators';
import {
  selectAuthInitialized,
  selectIsAuthenticated,
} from '../store/auth/auth.selectors';

@Injectable({ providedIn: 'root' })
export class AuthGuard {
  // Inietto Store e Router
  private store = inject(Store);
  private router = inject(Router);

  canActivate(): CanActivateFn {
    // Usiamo combineLatest per attendere inizializzazione e ottenere autenticazione
    return () =>
      combineLatest([
        this.store.select(selectAuthInitialized),
        this.store.select(selectIsAuthenticated),
      ]).pipe(
        // Aspetta finché initialized === false
        filter(([initialized, _]) => initialized),
        // Prendi solo la prima emissione (quella in cui initialized diventa true)
        take(1),
        map(([_, isAuth]) => {
          if (!isAuth) {
            // Se non sono autenticato, redirect a /login
            this.router.navigate(['/login']);
            return false;
          }
          // Se sono autenticato, lascio passare
          return true;
        })
      );
  }
}
