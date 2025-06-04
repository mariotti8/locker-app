import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap, catchError, exhaustMap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as FirebaseLockerActions from './firebase-locker.actions';
import { LockersService } from '../../services/lockersService';
import { FirebaseLocker } from '../../models/locker.model';

/**
 * Effetti per:
 *  a) Iniziare la subscription a STATUS_TOPIC non appena il sistema NgRx viene inizializzato
 *  b) Intercettare toggleLockerRequest e pubblicare “APRI” o “CHIUDI” di conseguenza
 */
@Injectable()
export class FirebaseLockerEffects {
  private actions$ = inject(Actions);
  private lockerService = inject(LockersService);

  subscribeToLockers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FirebaseLockerActions.loadLockers), // si attiva quando dispatchiamo loadLockers
      switchMap(() =>
        // subscribeToLockers restituisce un Observable<Locker[]>
        this.lockerService.getLockers$().pipe(
          map((lockers: FirebaseLocker[]) =>
            FirebaseLockerActions.loadLockersSuccess({ lockers })
          ),
          catchError((err) =>
            of(FirebaseLockerActions.loadLockersFailure({ error: err.message }))
          )
        )
      )
    )
  );

  /**
   * Effetto 2: Occupy Locker
   */
  occupyLocker$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FirebaseLockerActions.occupyLocker),
      // exhaustMap: ignora altre azioni similari finché la precedente non completa
      exhaustMap(({ lockerId, userId }) =>
        this.lockerService.occupyLocker(lockerId, userId).then(
          () => FirebaseLockerActions.occupyLockerSuccess({ lockerId, userId }),
          (error: any) =>
            FirebaseLockerActions.occupyLockerFailure({
              lockerId,
              error: error.message || String(error),
            })
        )
      )
    )
  );

  /**
   * Effetto 3: Release Locker
   */
  releaseLocker$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FirebaseLockerActions.releaseLocker),
      exhaustMap(({ lockerId, uidd }) =>
        this.lockerService.releaseLocker(lockerId, uidd).then(
          () => FirebaseLockerActions.releaseLockerSuccess({ lockerId }),
          (error: any) =>
            FirebaseLockerActions.releaseLockerFailure({
              lockerId,
              error: error.message || String(error),
            })
        )
      )
    )
  );
}
