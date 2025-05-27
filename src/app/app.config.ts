import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection, isDevMode,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { IMqttServiceOptions, MqttModule } from 'ngx-mqtt';
import { provideServiceWorker } from '@angular/service-worker';
import { environment } from '../environments/environment';

const MQTT_SERVICE_OPTIONS: IMqttServiceOptions = environment.mqttConfig as IMqttServiceOptions;

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    importProvidersFrom(MqttModule.forRoot(MQTT_SERVICE_OPTIONS)), provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
          }),
  ],
};
