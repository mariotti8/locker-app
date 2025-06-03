import { Injectable, inject } from '@angular/core';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { Auth, user } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { login, loginWithGoogle, logout } from '../store/auth/auth.actions';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth: Auth = inject(Auth);
  private router = inject(Router); // 👈 injecta il router
  private store = inject(Store); // 👈 injecta il router

  user$ = user(this.auth);

  // loginWithGoogle() {
  //   return signInWithPopup(this.auth, new GoogleAuthProvider());
  // }

  public loginWithGoogle() {
    this.store.dispatch(loginWithGoogle());
  }

  public doLogin(email: string, password: string) {
    this.store.dispatch(login({ email, password }));
  }

  public async logout() {
    // 1) Informa Firebase che fai il logout
    await signOut(this.auth);
    // 2) Dispatcha l’azione logout(); il meta-reducer ripulisce tutto lo store
    this.store.dispatch(logout());
  }
}
