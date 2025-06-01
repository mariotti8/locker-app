// src/dashboard/dashboard.component.ts
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { select, Store } from '@ngrx/store';
import {
  selectIsUnlocked,
  selectLockerError,
  selectLockerStatus,
} from '../../store/locker/locker.selectors';
import * as LockerActions from '../../store/locker/locker.actions';
import { LockerStatus } from '../../store/locker/locker-status.model';
import { AppState } from '../../store';

@Component({
  selector: 'dashboard-root',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [CommonModule],
})
export class DashboardComponent {
  private store = inject(Store<AppState>);
  private auth = inject(AuthService);

  user$ = this.auth.user$;
  lockerStatus$: Observable<LockerStatus | null> = this.store.pipe(
    select(selectLockerStatus)
  );
  isUnlocked$: Observable<boolean> = this.store.pipe(select(selectIsUnlocked));
  error$: Observable<string | null> = this.store.pipe(
    select(selectLockerError)
  );
  toggleText$: Observable<string> = this.lockerStatus$.pipe(
    map((status) => this.getToggleText(status))
  );

  getToggleText(status: LockerStatus | null): string {
    if (status === 'APRI') {
      return 'BLOCCA';
    } else {
      return 'SBLOCCA';
    }
  }

  toggleLockStatus(): void {
    this.store.dispatch(LockerActions.toggleLockerRequest());
  }
}
