import { Injectable, inject } from '@angular/core';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { Auth, user } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth: Auth = inject(Auth);
  private router = inject(Router); // 👈 injecta il router

  user$ = user(this.auth);

  loginWithGoogle() {
    return signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  async logout() {
    await signOut(this.auth);
    this.router.navigate(['/login']); // 👈 redirect manuale
  }
}
