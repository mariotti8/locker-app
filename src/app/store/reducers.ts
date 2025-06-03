import { ActionReducerMap } from '@ngrx/store';
import { authReducer } from './auth/auth.reducer';
import { firebaseLockerReducer } from './firebase-locker/firebase-locker.reducer';
import { mqttLockerReducer } from './mqtt-locker/mqtt-locker.reducer';
import { AppState } from './index';

export const reducers: ActionReducerMap<AppState> = {
  mqttLocker: mqttLockerReducer,
  firebaseLocker: firebaseLockerReducer,
  auth: authReducer,
};
