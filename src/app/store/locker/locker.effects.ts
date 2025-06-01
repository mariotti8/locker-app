import { inject, Injectable } from '@angular/core';
import {
  Actions,
  createEffect,
  ofType,
  ROOT_EFFECTS_INIT,
} from '@ngrx/effects';
import { map, switchMap, catchError, takeUntil, withLatestFrom } from 'rxjs/operators';
import { of, tap } from 'rxjs';

import * as LockerActions from './locker.actions';
import { LockerMqttService } from '../../services/locker-mqtt.service';
import { LockerStatus } from './locker-status.model';
import { select, Store } from '@ngrx/store';
import { selectIsUnlocked } from './locker.selectors';
import { AppState } from '..';

/**
 * Effetti per:
 *  a) Iniziare la subscription a STATUS_TOPIC non appena il sistema NgRx viene inizializzato
 *  b) Intercettare toggleLockerRequest e pubblicare “APRI” o “CHIUDI” di conseguenza
 */
@Injectable()
export class LockerEffects {
  private lockerMqttService = inject(LockerMqttService);
  private actions$ = inject(Actions);
  private store = inject(Store<AppState>);

  /**
   * 1) Effetto “di avvio”: quando NgRx Effects si inizializza (ROOT_EFFECTS_INIT),
   *    avvia una subscription a observeStatus() che, per ogni messaggio, dispatcha lockerStatusUpdated({ status }).
   *    Nel takeUntil definiamo che la subscription si disattivi quando arriva un’azione di error (facoltativo),
   *    oppure potremmo metterla attiva per sempre finché l’app è in memoria.
   */
  initStatusListener$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROOT_EFFECTS_INIT),
      switchMap(() =>
        this.lockerMqttService.observeStatus().pipe(
          map((status: LockerStatus) =>
            LockerActions.lockerStatusUpdated({ status })
          ),
          catchError((err) =>
            of(
              LockerActions.lockerError({
                error: err.message || err.toString(),
              })
            )
          )
        )
      )
    )
  );

  /**
   * 2) Esempio “più corretto” con withLatestFrom:
   *      vogliamo prendere lo stato corrente (isUnlocked) dal Store e decidere quale comando inviare.
   */
  toggleLockerWithState$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(LockerActions.toggleLockerRequest),
        // Prendiamo isUnlocked$ dal Store
        // Per usarlo, dobbiamo importare `Store` e `select` e definire un selector selectIsUnlocked
        withLatestFrom(this.store.pipe(select(selectIsUnlocked))),
        tap(([_, isUnlocked]: [any, boolean]) => {
          const cmd = isUnlocked ? 'CHIUDI' : 'APRI';
          this.lockerMqttService.publishCommand(cmd);
        })
      ),
    { dispatch: false }
  );

  // (Opzionale) se vuoi catturare publish error come LockerActions.lockerError:
  publishErrorHandler$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LockerActions.toggleLockerRequest),
      switchMap(() =>
        // Se publishCommand fosse una Promise, potresti trasformarla in from(...).pipe(
        //    map(() => ({ type: 'noop' })),
        //    catchError(err => of(LockerActions.lockerError({ error: err.message })))
        // )
        of({ type: 'NO_ACTION' })
      )
    )
  );
}
