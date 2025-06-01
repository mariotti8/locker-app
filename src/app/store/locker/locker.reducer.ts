import { createReducer, on } from '@ngrx/store';
import * as LockerActions from './locker.actions';
import { LockerStatus } from './locker-status.model';

export interface LockerState {
  status: LockerStatus | null;
  error: string | null;
}

export const initialLockerState: LockerState = {
  status: null,
  error: null,
};

export const lockerReducer = createReducer(
  initialLockerState,

  // Quando arriva un aggiornamento di stato dal broker (dal nostro Effect):
  on(LockerActions.lockerStatusUpdated, (state, { status }) => ({
    ...state,
    status,
    error: null,
  })),

  // Se c’è un errore (publish fallito o timeout):
  on(LockerActions.lockerError, (state, { error }) => ({
    ...state,
    error,
  }))
);
