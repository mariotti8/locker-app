import { createAction, props } from '@ngrx/store';
import { FirebaseLocker } from '../../models/locker.model';
import { LockerStatus } from './locker-status.model';

/**
 * 1) Azione per dire all’Effect di pubblicare un comando MQTT “APRI” o “CHIUDI”
 */
export const toggleLockerRequest = createAction(
  '[Locker] Toggle Locker Request'
);

/**
 * 3) Azione per dire all’Effect di pubblicare un comando MQTT “APRI” o “CHIUDI”
 */
export const selectLocker = createAction(
  '[Locker] Select Locker',
  props<{ locker: FirebaseLocker }>()
);

/**
 * 4) Azione che aggiorna nel Store il nuovo valore di LockerStatus ricevuto dal broker MQTT
 */
export const lockerStatusUpdated = createAction(
  '[Locker] Status From MQTT',
  props<{ status: LockerStatus }>()
);

/**
 * 5) Azione per gestire gli errori MQTT (ad esempio, timeout o publish fallito)
 */
export const lockerError = createAction(
  '[Locker] Error',
  props<{ error: string }>()
);

/**
 * 5) Azione per resettare lo stato del locker selezionato
 */
export const resetLocker = createAction('[Locker] Reset Locker');
