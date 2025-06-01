import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

  async login() {
    console.log('Login with', this.username, this.password);
  }

  async onLoginWithGoogle() {
    console.log('Google login clicked');
    await this.auth.loginWithGoogle();
    this.router.navigate(['/dashboard']);
  }

  onLoginWithApple() {
    console.log('Apple login clicked');
    // TODO: trigger OAuth login
  }
}
