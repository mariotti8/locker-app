// src/app/app.component.ts
import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { Subscription } from 'rxjs';

export enum LockerStatus {
  APRI = 'Aperto',
  CHIUDI = 'Chiuso',
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [CommonModule]
})
export class AppComponent {
  subscription!: Subscription;
  topicname: string = 'locker/1/status';
  isConnected: boolean = false;
  lockerStatus!: LockerStatus;

  constructor(private _mqttService: MqttService) {
    this.subscription = this._mqttService
      .observe(this.topicname)
      .subscribe((message: IMqttMessage) => {
        console.log('msg: ', message.payload.toString());
        this.lockerStatus =
          LockerStatus[message.payload.toString() as keyof typeof LockerStatus];
      });
  }

  toggleLockerStatus() {
    this.lockerStatus === LockerStatus.CHIUDI
      ? this.sendmsg("APRI")
      : this.sendmsg("CHIUDI");
  }

  get toggleText() {
    return this.lockerStatus === LockerStatus.CHIUDI ? 'SBLOCCA' : 'BLOCCA';
  }
  get toggleIcon() {
    return this.lockerStatus === LockerStatus.CHIUDI ? 'lock_open' : 'lock';
  }

  sendmsg(msg: string): void {
    // use unsafe publish for non-ssl websockets
    this._mqttService.unsafePublish(this.topicname, msg, {
      qos: 1,
      retain: true,
    });
  }

  // apriLocker() {
  //   this.mqttService.publish('locker/1/open', 'apri');
  //   console.log('📤 Comando inviato: apri');
  // }
}
