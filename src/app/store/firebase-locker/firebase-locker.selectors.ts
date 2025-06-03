import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FirebaseLockerState } from './firebase-locker.reducer';

export const selectFirebaseLockerState =
  createFeatureSelector<FirebaseLockerState>('firebaseLocker');

// 2) Selettori di comodo
export const selectAllLockers = createSelector(
  selectFirebaseLockerState,
  (state: FirebaseLockerState) => state?.lockers
);

export const selectLockersLoading = createSelector(
  selectFirebaseLockerState,
  (state: FirebaseLockerState) => state?.loading
);

export const selectLockersError = createSelector(
  selectFirebaseLockerState,
  (state: FirebaseLockerState) => state?.error
);

// 3) Selettore per ottenere i locker disponibili
export const selectAvailableLockers = createSelector(
  selectAllLockers,
  (lockers) => lockers.filter((l) => l.available)
);

// 4) Selettore per ottenere i locker occupati
export const selectOccupiedLockers = createSelector(
  selectAllLockers,
  (lockers) => lockers.filter((l) => !l.available)
);
