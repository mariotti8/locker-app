import { createFeatureSelector, createSelector } from '@ngrx/store';
import { LockerStatus } from './locker-status.model';
import { MqttLockerState } from './mqtt-locker.reducer';

export const selectMqttLockerState = createFeatureSelector<MqttLockerState>('mqttLocker');

/**
 * Ritorna uno status singolo
 */
export const selectLockerStatus = createSelector(
  selectMqttLockerState,
  (state) => state?.status
);
/**
 * Ritorna un boolean se aperto (per il singolo locker)
 */
export const selectIsUnlocked = createSelector(
  selectMqttLockerState,
  (state) => state?.status === LockerStatus.APERTO
);
/**
 * Ritorna eventuale errore per un locker
 */
export const selectLockerError = createSelector(
  selectMqttLockerState,
  (state) => state.error || ''
);
/**
 * Ritorna l'ID del locker attualmente selezionato
 */
export const selectCurrentLocker = createSelector(
  selectMqttLockerState,
  (state) => state?.currentLocker
);
