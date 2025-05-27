export const environment = {
  production: false,
  mqttConfig: {
    hostname: 'localhost', // Il tuo hostname HiveMQ Cloud
    port: 9001, // Porta WebSocket sicura (wss)
    protocol: 'ws', // Usa 'wss' per WebSocket sicuro
    path: '/mqtt', // Path tipico per HiveMQ Cloud
  },
};
