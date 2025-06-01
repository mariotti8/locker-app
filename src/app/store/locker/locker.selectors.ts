import { createFeatureSelector, createSelector } from '@ngrx/store';
import { LockerState } from './locker.reducer';

export const selectLockerState = createFeatureSelector<LockerState>('locker');

export const selectLockerStatus = createSelector(
  selectLockerState,
  (state) => state.status
);

export const selectLockerError = createSelector(
  selectLockerState,
  (state) => state.error
);

// Comodo per ottenere un boolean “isUnlocked”
export const selectIsUnlocked = createSelector(
  selectLockerStatus,
  (status) => status === 'APRI'
);
