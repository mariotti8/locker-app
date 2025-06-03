import { inject, Injectable } from '@angular/core';
import { MqttService, IMqttMessage } from 'ngx-mqtt';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LockerStatus } from '../store/mqtt-locker/locker-status.model';

@Injectable({
  providedIn: 'root',
})
export class LockerMqttService {
  private mqttService = inject(MqttService);

  /**
   * Ritorna un Observable che emette ogni volta che arriva un messaggio da STATUS_TOPIC.
   * Si assume che il payload sia esattamente una stringa che corrisponde a una key di LockerStatus.
   */

  observeStatus(id: string): Observable<LockerStatus> {
    const topic = `locker/${id}/status`;
    return this.mqttService
      .observe(topic)
      .pipe(map((msg: IMqttMessage) => msg.payload.toString() as LockerStatus));
  }

  /**
   * Pubblica un comando su COMMAND_TOPIC per aprire o chiudere il locker.
   * Il payload è una stringa: “APRI” o “CHIUDI”.
   */

  publishCommand(id: string | null, cmd: 'APRI' | 'CHIUDI'): void {
    if (id) {
      const topic = `locker/${id}/command`;
      this.mqttService.unsafePublish(topic, cmd, { qos: 1, retain: true });
    }
  }
}
