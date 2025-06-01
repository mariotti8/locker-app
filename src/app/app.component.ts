import { Component, inject } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [RouterOutlet, CommonModule]
})
export class AppComponent {
  private auth = inject(AuthService);
  user$ = this.auth.user$;

  logout() {
    this.auth.logout();
  }
}
