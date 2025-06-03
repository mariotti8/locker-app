// src/app/services/lockers.service.ts
import { inject, Injectable } from '@angular/core';
// Import modulari di Firestore
// IMPORT “MODULARI” da @angular/fire/firestore
import {
  Firestore,
  collection,
  collectionData,
  doc,
  runTransaction,
  getDoc,
  updateDoc,
  addDoc,
  serverTimestamp,
  CollectionReference,
  DocumentData,
} from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';
import { FirebaseLocker } from '../models/locker.model';

@Injectable({
  providedIn: 'root',
})
export class LockersService {
  // Riferimento alla collezione “lockers”
  private firestore = inject(Firestore);

  // 2) Puntiamo alla collezione “lockers” come CollectionReference
  private lockersCollection = collection(
    this.firestore,
    'lockers'
  ) as CollectionReference<DocumentData>;

  /**
   * 1) Ottiene stream in real‐time di tutti i locker (snapshotChanges restituirà id+data)
   *    Trasformiamo il risultato in array di Locker con campo “id” esplicito.
   */
  public getLockers$(): Observable<FirebaseLocker[]> {
    return collectionData(this.lockersCollection, { idField: 'id' }).pipe(
      map((docs: DocumentData[]) => {
        // collectionData restituisce array di “DocumentData” con campo “id” aggiunto automaticamente
        // Possiamo castarne il tipo in Locker
        console.log({ docs });

        return docs.map((d) => d as FirebaseLocker);
      })
    );
  }

  /**
   * 2) Occupa un locker: aggiorna i campi `available`, `occupiedBy`, `timestampOccupied`.
   *    Usando una transaction è più sicuro per evitare race condition,
   *    ma qui mostreremo la versione “semplice” (con get & update lato client).
   */
  public async occupyLocker(lockerId: string, userId: string): Promise<void> {
    const lockerDocRef = doc(this.firestore, 'lockers', lockerId);

    await runTransaction(this.firestore, async (transaction) => {
      const snap = await transaction.get(lockerDocRef);

      if (!snap.exists()) {
        throw new Error('Locker non trovato');
      }
      const data = snap.data() as FirebaseLocker;
      console.log('Occupy', { data });
      if (!data.available) {
        throw new Error('Questo locker è già occupato.');
      }
      transaction.update(lockerDocRef, {
        available: false,
        occupiedBy: userId,
        timestampOccupied: serverTimestamp(),
      });
    });
  }

  /**
   * releaseLocker(lockerId, userId): rilascia il locker in modo atomico (transaction).
   * Controlla che il locker esista e che data.occupiedBy === userId prima di rilasciare.
   */
  public async releaseLocker(lockerId: string, userId: string): Promise<void> {
    const lockerDocRef = doc(this.firestore, 'lockers', lockerId);

    await runTransaction(this.firestore, async (transaction) => {
      const snap = await transaction.get(lockerDocRef);

      if (!snap.exists()) {
        throw new Error('Locker non trovato');
      }
      const data = snap.data() as FirebaseLocker;
      console.log('Release', { data, userId });
      if (data.available) {
        throw new Error('Questo locker è già libero.');
      }
      if (data.occupiedBy !== userId) {
        throw new Error(
          'Non puoi rilasciare un locker occupato da un altro utente.'
        );
      }
      transaction.update(lockerDocRef, {
        available: true,
        occupiedBy: null,
        timestampReleased: serverTimestamp(),
      });
    });
  }

  /**
   * addNewLocker(fields): aggiunge un nuovo documento “locker” con i campi iniziali.
   * Ad esempio utile per un pannello admin. Ritorna la promise con il documentId creato.
   */
  public async addNewLocker(
    initialFields: Partial<FirebaseLocker>
  ): Promise<string> {
    // Definiamo i campi di default per un locker nuovo
    const payload: Omit<FirebaseLocker, 'id'> = {
      available: true,
      occupiedBy: null,
      timestampOccupied: null,
      timestampReleased: null,
      ...initialFields,
    };
    const docRef = await addDoc(
      this.lockersCollection,
      payload as DocumentData
    );
    return docRef.id;
  }

  /**
   * getLockerOnce(lockerId): per recuperare i dati di un singolo locker una sola volta (no real-time).
   */
  public async getLockerOnce(lockerId: string): Promise<FirebaseLocker | null> {
    const lockerDocRef = doc(this.firestore, 'lockers', lockerId);
    const snap = await getDoc(lockerDocRef);
    if (!snap.exists()) return null;
    return { id: snap.id, ...(snap.data() as Omit<FirebaseLocker, 'id'>) };
  }
}
