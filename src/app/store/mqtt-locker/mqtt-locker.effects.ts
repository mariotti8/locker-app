import { inject, Injectable } from '@angular/core';
import {
  Actions,
  createEffect,
  ofType,
  ROOT_EFFECTS_INIT,
} from '@ngrx/effects';
import {
  map,
  switchMap,
  catchError,
  takeUntil,
  withLatestFrom,
  mergeMap,
  exhaustMap,
  filter,
} from 'rxjs/operators';
import { of, tap } from 'rxjs';

import * as MqttLockerActions from './mqtt-locker.actions';
import * as FirebaseLockerActions from '../firebase-locker/firebase-locker.actions';
import { LockerMqttService } from '../../services/locker-mqtt.service';
import { LockerStatus } from './locker-status.model';
import { select, Store } from '@ngrx/store';
import { selectIsUnlocked } from './mqtt-locker.selectors';
import { AppState } from '..';
import { LockersService } from '../../services/lockersService';
import { FirebaseLocker } from '../../models/locker.model';

/**
 * Effetti per:
 *  a) Iniziare la subscription a STATUS_TOPIC non appena il sistema NgRx viene inizializzato
 *  b) Intercettare toggleLockerRequest e pubblicare “APRI” o “CHIUDI” di conseguenza
 */
@Injectable()
export class MqttLockerEffects {
  private lockerMqttService = inject(LockerMqttService);
  private actions$ = inject(Actions);
  private store = inject(Store<AppState>);

  /**
   * 1) Effetto “di avvio”: quando NgRx Effects si inizializza (ROOT_EFFECTS_INIT),
   *    avvia una subscription a observeStatus() che, per ogni messaggio, dispatcha lockerStatusUpdated({ status }).
   *    Nel takeUntil definiamo che la subscription si disattivi quando arriva un’azione di error (facoltativo),
   *    oppure potremmo metterla attiva per sempre finché l’app è in memoria.
   */
  initStatusListener$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MqttLockerActions.selectLocker),
      mergeMap(({ locker }) =>
        this.lockerMqttService.observeStatus(locker.id).pipe(
          map((status: LockerStatus) =>
            MqttLockerActions.lockerStatusUpdated({ status })
          ),
          catchError((err) =>
            of(
              MqttLockerActions.lockerError({
                error: `Errore MQTT locker ${locker?.id}: ${err.message || err}`,
              })
            )
          ),
          // Chiudi la subscription quando arriva releaseLockerSuccess per lo stesso locker
          takeUntil(
            this.actions$.pipe(
              ofType(FirebaseLockerActions.releaseLockerSuccess),
              // Filtra solo se l'id coincide
              map((action) => action.lockerId),
              // Solo se l'id corrisponde a quello osservato
              // (locker.id è chiuso nell'observable)
              // Usa filter per chiudere solo la subscription giusta
              // (importa filter da rxjs/operators)
              filter((releasedId) => releasedId === locker?.id)
            )
          )
        )
      )
    );
  });

  /**
   * 2) Esempio “più corretto” con withLatestFrom:
   *      vogliamo prendere lo stato corrente (isUnlocked) dal Store e decidere quale comando inviare.
   */
  toggleLockerWithState$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(MqttLockerActions.toggleLockerRequest),
        // Usa withLatestFrom per ottenere lo stato corrente solo quando l'azione viene dispatchata
        withLatestFrom(this.store.select((state: AppState) => state)),
        tap(([_, state]) => {
          const isUnlocked = selectIsUnlocked(state);
          const cmd = isUnlocked ? 'CHIUDI' : 'APRI';
          this.lockerMqttService.publishCommand(
            state.mqttLocker.currentLocker?.id || '',
            cmd
          );
        })
      ),
    { dispatch: false }
  );

  // (Opzionale) se vuoi catturare publish error come LockerActions.lockerError:
  publishErrorHandler$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MqttLockerActions.toggleLockerRequest),
      switchMap(() => of({ type: 'NO_ACTION' }))
    )
  );

  /**
   * Effetto 3: Release Locker
   */
  releaseLockerSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FirebaseLockerActions.releaseLockerSuccess),
      map(() => MqttLockerActions.resetLocker())
    )
  );
  /**
   * Effetto 4: Select current locker
   */
  currentLocker$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FirebaseLockerActions.loadLockersSuccess),
      withLatestFrom(this.store.select((state: AppState) => state)),
      map(([{ lockers }, state]) => {
        const currentLocker = lockers.find(
          (l: FirebaseLocker) => l.occupiedBy === state.auth.user?.['uid']
        );
        return MqttLockerActions.selectLocker({
          locker: currentLocker as FirebaseLocker,
        });
      })
    )
  );
}
