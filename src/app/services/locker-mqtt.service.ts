import { inject, Injectable } from '@angular/core';
import { MqttService, IMqttMessage } from 'ngx-mqtt';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { lockerStatusUpdated } from '../store/locker/locker.actions';
import { LockerStatus } from '../store/locker/locker-status.model';

/**
 * Il topic su cui inviare comandi (APRI/CHIUDI) e su cui ricevere lo stato
 */
const STATUS_TOPIC = 'locker/1/status';

@Injectable({
  providedIn: 'root'
})
export class LockerMqttService {

  private mqttService = inject(MqttService);
  private store = inject(Store);

  /**
   * Ritorna un Observable che emette ogni volta che arriva un messaggio da STATUS_TOPIC.
   * Si assume che il payload sia esattamente una stringa che corrisponde a una key di LockerStatus.
   */
  observeStatus(): Observable<LockerStatus> {
    return this.mqttService.observe(STATUS_TOPIC).pipe(
      map((msg: IMqttMessage) => {
        const raw = msg.payload.toString();
        // Assumiamo che raw sia esattamente una stringa come 'APERTO' o 'CHIUSO'
        this.store.dispatch(lockerStatusUpdated({ status: raw as LockerStatus }));
        return raw as LockerStatus;
      })
    );
  }

  /**
   * Pubblica un comando su COMMAND_TOPIC per aprire o chiudere il locker.
   * Il payload è una stringa: “APRI” o “CHIUDI”.
   */
  publishCommand(cmd: 'APRI' | 'CHIUDI'): void {
    // unsafePublish serve per WebSocket senza TLS; se usi wss, usa publish()
    this.mqttService.unsafePublish(STATUS_TOPIC, cmd, {
      qos: 1,
      retain: false,
    });
  }
}
