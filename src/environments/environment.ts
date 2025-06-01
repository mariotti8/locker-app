export const environment = {
  production: true,
  mqttConfig: {
    hostname: 'd204b71c12404f10a30da5503b4ec3f8.s1.eu.hivemq.cloud',
    port: 8884,
    protocol: 'wss',
    path: '/mqtt', // Path tipico per HiveMQ Cloud
    username: 'mariotti8', // Inserisci il tuo username HiveMQ Cloud
    password: 'Catone4!', // Inserisci la tua password HiveMQ Cloud
  },
  firebaseConfig: {
    apiKey: 'AIzaSyDTZSTzCFlB6IgiMJ5noQvetGg-9s1JV7c',
    authDomain: 'catone4locker.firebaseapp.com',
    projectId: 'catone4locker',
    storageBucket: 'catone4locker.firebasestorage.app',
    messagingSenderId: '989457566765',
    appId: '1:989457566765:web:456e45452e4fdf93b4bca4',
    measurementId: 'G-J3912DE045',
  },
};
