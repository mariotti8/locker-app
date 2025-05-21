import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection, isDevMode,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { IMqttServiceOptions, MqttModule } from 'ngx-mqtt';
import { provideServiceWorker } from '@angular/service-worker';

const MQTT_SERVICE_OPTIONS: IMqttServiceOptions = {
  hostname: 'd204b71c12404f10a30da5503b4ec3f8.s1.eu.hivemq.cloud', // Il tuo hostname HiveMQ Cloud
  port: 8884, // Porta WebSocket sicura (wss)
  protocol: 'wss', // Usa 'wss' per WebSocket sicuro
  path: '/mqtt', // Path tipico per HiveMQ Cloud
  username: 'mariotti8', // Inserisci il tuo username HiveMQ Cloud
  password: 'Catone4!', // Inserisci la tua password HiveMQ Cloud
};

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
