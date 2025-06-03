import { createAction, props } from '@ngrx/store';
import { FirebaseLocker } from '../../models/locker.model';

// =================== LOAD FIREBASE LOCKERS ===================
/**
 * 1) Carica iniziale (non strettamente necessaria se ci basiamo solo su real‐time)
 */
export const loadLockers = createAction(
  '[Lockers] Load Lockers'
);

/**
 * 2) Success / Failure per load (utile se vogliamo gestire caricamento + errori)
 */
export const loadLockersSuccess = createAction(
  '[Lockers] Load Lockers Success',
  props<{ lockers: FirebaseLocker[] }>()
);

export const loadLockersFailure = createAction(
  '[Lockers] Load Lockers Failure',
  props<{ error: string }>()
);

/**
 * 3) Occupy Lockers
 */
export const occupyLocker = createAction(
  '[Lockers] Occupy Locker',
  props<{ lockerId: string; userId: string }>()
);
export const occupyLockerSuccess = createAction(
  '[Lockers] Occupy Locker Success',
  props<{ lockerId: string; userId: string }>()
);
export const occupyLockerFailure = createAction(
  '[Lockers] Occupy Locker Failure',
  props<{ lockerId: string; error: string }>()
);

/**
 * 4) Release Lockers
 */
export const releaseLocker = createAction(
  '[Lockers] Release Locker',
  props<{ lockerId: string, uidd: string }>()
);
export const releaseLockerSuccess = createAction(
  '[Lockers] Release Locker Success',
  props<{ lockerId: string }>()
);
export const releaseLockerFailure = createAction(
  '[Lockers] Release Locker Failure',
  props<{ lockerId: string; error: string }>()
);

/**
 * 5) Real‐time update: ogni volta che Firestore ci notifica un cambiamento,
 *    vogliamo scrivere direttamente il nuovo array di locker nello store.
 */
export const setLockersRealtime = createAction(
  '[Lockers] Set Lockers Realtime',
  props<{ lockers: FirebaseLocker[] }>()
);