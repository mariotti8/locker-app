// src/dashboard/dashboard.component.ts
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { select, Store } from '@ngrx/store';
import {
  selectAllLockers,
  selectLockersLoading,
} from '../../store/firebase-locker/firebase-locker.selectors';
import * as FirebaseLockerActions from '../../store/firebase-locker/firebase-locker.actions';
import * as MqttLockerActions from '../../store/mqtt-locker/mqtt-locker.actions';
import { AppState } from '../../store';

import { FirebaseLocker } from '../../models/locker.model';
import {
  occupyLocker,
  releaseLocker,
} from '../../store/firebase-locker/firebase-locker.actions';
import {
  selectCurrentLocker,
  selectIsUnlocked,
  selectLockerError,
  selectLockerStatus,
} from '../../store/mqtt-locker/mqtt-locker.selectors';
import { LockerStatus } from '../../store/mqtt-locker/locker-status.model';
import { selectAuthLoading, selectUser } from '../../store/auth/auth.selectors';
import { UserProfile } from '../../store/auth/auth.models';

@Component({
  selector: 'dashboard-root',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [CommonModule],
})
export class DashboardComponent {
  private store = inject(Store<AppState>);

  currentUser!: UserProfile | null;

  user$ = this.store.pipe(
    select(selectUser),
    tap((user) => {
      this.currentUser = user;
    })
  );

  loading$ = this.store.select(selectAuthLoading);
  currentLocker$ = this.store.select(selectCurrentLocker);
  status$: Observable<LockerStatus | null> = this.store.select(selectLockerStatus);
  isUnlocked$: Observable<boolean> = this.store.select(selectIsUnlocked);
  error$: Observable<string> = this.store.select(selectLockerError);
  lockers$: Observable<FirebaseLocker[]> = this.store.select(selectAllLockers);

  constructor() {
    this.store.dispatch(FirebaseLockerActions.loadLockers());
  }

  releaseLoceker(locker: FirebaseLocker): void {
    this.store.dispatch(
      releaseLocker({
        lockerId: locker.id,
        uidd: this.currentUser?.uid as string,
      })
    );
  }

  toggleLockStatus(): void {
    this.store.dispatch(MqttLockerActions.toggleLockerRequest());
  }

  selectLocker(locker: FirebaseLocker): void {
    if (locker.available) {
      this.store.dispatch(MqttLockerActions.selectLocker({ locker }));
      // l’utente vuole occupare il locker
      this.store.dispatch(
        occupyLocker({
          lockerId: locker.id,
          userId: this.currentUser?.uid as string,
        })
      );
    } else {
    }
  }
}
