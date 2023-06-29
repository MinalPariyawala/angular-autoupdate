import { Injectable } from '@angular/core';
import { IpcRenderer } from 'electron';
import { Observable } from 'rxjs';
declare const window: any;

@Injectable({
  providedIn: 'root'
})
export class IpcService {
  ipc: IpcRenderer;

  constructor() {
    console.log(window['require']);
    if (<any>window.require) {
      try {
        this.ipc = (<any>window).require("electron").ipcRenderer;
      } catch (error) {
        throw error;
      }
    } else {
      console.warn("Could not load electron ipc");
    }
  }

  getData() {
    return new Observable<any>(observer => {
      console.log("observer:", observer);
      this.ipc.once("getDataResponse", (event, arg) => {
        console.log("ipc.once event", event);
        observer.next(arg);
      });
      this.ipc.send("getData");
    });
  }
}
