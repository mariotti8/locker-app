// src/app/store/auth.effects.ts
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  Auth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  User
} from '@angular/fire/auth';
import { Store } from '@ngrx/store';
import { from, map, catchError, switchMap, tap } from 'rxjs';
import { of } from 'rxjs';
import * as AuthActions from './auth.actions';
import { Router } from '@angular/router';
import { UserProfile } from './auth.models';

@Injectable()
export class AuthEffects {
  private router = inject(Router); // 👈 injecta il route
  private actions$ = inject(Actions);
  private auth = inject(Auth); // 👈 injecta il servizio Aut
  private store = inject(Store); // 👈 injecta il servizio Stor
  // e
  constructor() {
    // Effetto “bootstrap” per sincronizzare lo stato iniziale con Firebase Auth
    onAuthStateChanged(this.auth, (fbUser: User | null) => {
      if (fbUser) {
        const userProfile = this.userToProfile(fbUser);
        this.store.dispatch(
          AuthActions.authStateChanged({ user: userProfile })
        );
      } else {
        this.store.dispatch(AuthActions.authStateChanged({ user: null }));
      }
    });
  }

  // Effetto per login
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({ email, password }) =>
        from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
          map((cred) => {
            const fbUser = cred.user;
            // Smonto il Firebase User in un plain object
            const userProfile = this.userToProfile(fbUser);
            return AuthActions.loginSuccess({ user: userProfile });
          }),
          catchError((err) =>
            of(
              AuthActions.loginFailure({ error: err.message || 'Errore login' })
            )
          )
        )
      )
    )
  );

  // Effetto per login con Google (signInWithPopup)
  loginWithGoogle$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginWithGoogle),
      switchMap(() => {
        const provider = new GoogleAuthProvider();
        return from(signInWithPopup(this.auth, provider)).pipe(
          map((cred) => {
            const fbUser = cred.user;
            // Smonto il Firebase User in un plain object
            const userProfile = this.userToProfile(fbUser);
            return AuthActions.loginSuccess({ user: userProfile });
          }),
          catchError((err) => {
            return of(
              AuthActions.loginFailure({
                error: err.message || 'Errore Google Sign-In',
              })
            );
          })
        );
      })
    )
  );

  // Effetto per logout
  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      switchMap(() =>
        from(signOut(this.auth)).pipe(
          map(() => AuthActions.logoutSuccess()),
          catchError((err) =>
            of(
              AuthActions.logoutFailure({
                error: err.message || 'Errore logout',
              })
            )
          )
        )
      )
    )
  );

  // Effetto per logout
  logoutSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logoutSuccess),
        tap(() => {
          this.router.navigate(['/login']); // 👈 redirect manuale
        })
      ),
    { dispatch: false }
  );

  // Helper: trasforma un oggetto User di Firebase in un plain object UserProfile
  private userToProfile(fbUser: User): UserProfile {
    return {
      uid: fbUser.uid,
      email: fbUser.email,
      displayName: fbUser.displayName,
      photoURL: fbUser.photoURL,
    };
  }
}
