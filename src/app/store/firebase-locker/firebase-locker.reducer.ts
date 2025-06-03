import { createReducer, on } from '@ngrx/store';
import * as FirebaseLockerActions from './firebase-locker.actions';
import { FirebaseLocker } from '../../models/locker.model';

export interface FirebaseLockerState {
  lockers: FirebaseLocker[];
  loading: boolean;
  error: string | null;
}
export const initialFirebaseLockerState: FirebaseLockerState = {
  lockers: [],
  loading: false,
  error: null,
};

export const firebaseLockerReducer = createReducer(
  initialFirebaseLockerState,
  on(FirebaseLockerActions.loadLockers, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(FirebaseLockerActions.loadLockersSuccess, (state, { lockers }) => ({
    ...state,
    lockers,
    loading: false,
    error: null,
  })),
  on(FirebaseLockerActions.loadLockersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // 2) Occupy Locker
  on(FirebaseLockerActions.occupyLocker, (state) => ({
    ...state,
    // possiamo anche settare loading: true, ma dato che stiamo sulla real‐time,
    // potremmo non bloccare l’interfaccia. Dipende dal tuo UX design.
    error: null,
  })),
  on(FirebaseLockerActions.occupyLockerSuccess, (state, { lockerId, userId }) => {
    // Poiché la transazione Firestore emetterà un change in real‐time, potremmo
    // non dover aggiornare manualmente lo state; tuttavia, qui mostriamo
    // come aggiornare localmente in caso volessimo un feedback immediato.
    const updatedItems = state.lockers.map((l) =>
      l.id === lockerId ? { ...l, available: false, occupiedBy: userId } : l
    );
    return {
      ...state,
      lockers: updatedItems,
    };
  }),
  on(FirebaseLockerActions.occupyLockerFailure, (state, { lockerId, error }) => ({
    ...state,
    error,
  })),

  // 3) Release Locker
  on(FirebaseLockerActions.releaseLocker, (state) => ({
    ...state,
    error: null,
  })),
  on(FirebaseLockerActions.releaseLockerSuccess, (state, { lockerId }) => {
    const updatedItems = state.lockers.map((l) =>
      l.id === lockerId ? { ...l, available: true, occupiedBy: null } : l
    );
    return {
      ...state,
      lockers: updatedItems,
    };
  }),
  on(FirebaseLockerActions.releaseLockerFailure, (state, { lockerId, error }) => ({
    ...state,
    error,
  }))
);
