import { Component, inject } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectIsAuthenticated, selectUser } from './store/auth/auth.selectors';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [RouterOutlet, CommonModule],
})
export class AppComponent {
  private auth = inject(AuthService);
  private store = inject(Store);

  isAuthenticated$: Observable<boolean | null> = this.store.pipe(
    select(selectIsAuthenticated)
  );
  user$ = this.store.pipe(
    select(selectUser)
  );

  logout() {
    this.auth.logout();
  }
}
