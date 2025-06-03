import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { selectIsAuthenticated } from '../../store/auth/auth.selectors';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [CommonModule, FormsModule],
})
export class LoginComponent {
  username = '';
  password = '';

  private auth = inject(AuthService);
  private router = inject(Router);
  private store = inject(Store);

  isAuthenticated$ = this.store.pipe(select(selectIsAuthenticated));

  constructor() {
    this.isAuthenticated$.subscribe((isAuth) => {
      if (isAuth) {
        this.router.navigate(['/dashboard']);
      }
    });
  }

  async login() {
    console.log('Login with', this.username, this.password);
  }

  async onLoginWithGoogle() {
    console.log('Google login clicked');
    this.auth.loginWithGoogle();
  }

  onLoginWithApple() {
    console.log('Apple login clicked');
    // TODO: trigger OAuth login
  }
}
