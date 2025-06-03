import { createReducer, on } from '@ngrx/store';
import * as LockerActions from './mqtt-locker.actions';
import { LockerStatus } from './locker-status.model';
import { FirebaseLocker } from '../../models/locker.model';

export interface MqttLockerState {
  currentLocker: FirebaseLocker | null;
  status: LockerStatus | null;
  error: string | null;
}
export const initialMqttLockerState: MqttLockerState = {
  status: null,
  currentLocker: null,
  error: null,
};

export const mqttLockerReducer = createReducer(
  initialMqttLockerState,
  on(LockerActions.selectLocker, (state, { locker }) => ({
    ...state,
    currentLocker: locker,
  })),
  on(LockerActions.lockerStatusUpdated, (state, { status }) => ({
    ...state,
    status: status,
    error: null,
  })),
  on(LockerActions.resetLocker, (state) => ({
    ...state,
    currentLocker: null,
    error: null,
  })),
  on(LockerActions.lockerError, (state, { error }) => ({
    ...state,
    error: error,
  }))
);
