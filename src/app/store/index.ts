import { FirebaseLockerState } from './firebase-locker/firebase-locker.reducer';
import { MqttLockerState } from './mqtt-locker/mqtt-locker.reducer';
import { AuthState } from './auth/auth.reducer';

export interface AppState {
  mqttLocker: MqttLockerState;
  firebaseLocker: FirebaseLockerState;
  auth: AuthState;
}
