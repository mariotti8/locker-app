import { createAction, props } from '@ngrx/store';
import { LockerStatus } from './locker-status.model';


/**
 * 1) Azione per dire all’Effect di pubblicare un comando MQTT “APRI” o “CHIUDI”
 */
export const toggleLockerRequest = createAction(
  '[Locker] Toggle Locker Request'
);

/**
 * 2) Azione “interno” che effettivamente mappa il comando in testuale MQTT.
 *    In questo esempio NON serve un payload, perché l’Effect deduce da stato attuale
 *    se inviare “APRI” o “CHIUDI”.
 *    Potresti anche omettere questa action e dispatchare direttamente sblocca/ blocca,
 *    ma con questo approccio rimaniamo su “unica azione di toggle” nel componente.
 */

/**
 * 3) Azione che aggiorna nel Store il nuovo valore di LockerStatus ricevuto dal broker MQTT
 */
export const lockerStatusUpdated = createAction(
  '[Locker] Status From MQTT',
  props<{ status: LockerStatus }>()
);

/**
 * 4) Azione per gestire gli errori MQTT (ad esempio, timeout o publish fallito)
 */
export const lockerError = createAction(
  '[Locker] Error',
  props<{ error: string }>()
);
