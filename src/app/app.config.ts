import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
  isDevMode,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { IMqttServiceOptions, MqttModule } from 'ngx-mqtt';
import { provideServiceWorker } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { lockerReducer } from './store/locker/locker.reducer';
import { LockerEffects } from './store/locker/locker.effects';
import { provideEffects } from '@ngrx/effects';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { reducers } from './store/reducers';

const MQTT_SERVICE_OPTIONS: IMqttServiceOptions =
  environment.mqttConfig as IMqttServiceOptions;

export const appConfig: ApplicationConfig = {
  providers: [
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideStore(reducers),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: false,
    }),
    provideEffects([LockerEffects]),
    importProvidersFrom(MqttModule.forRoot(MQTT_SERVICE_OPTIONS)),
    provideHttpClient(withInterceptorsFromDi()),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
};
