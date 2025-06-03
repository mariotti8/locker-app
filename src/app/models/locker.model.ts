// src/app/models/locker.model.ts
export interface FirebaseLocker {
  id: string; // id del documento (es. “3”, “4”, ecc.)
  available: boolean; // true → libero, false → occupato
  occupiedBy?: string | null; // UID dell’utente che ha occupato il locker (opzionale)
  timestampOccupied?: any; // firebase.firestore.Timestamp quando è stato occupato
  timestampReleased?: any; // firebase.firestore.Timestamp quando è stato rilasciato
  // Puoi aggiungere altri campi (ad esempio info di posizione, dimensione, ecc.)
}
