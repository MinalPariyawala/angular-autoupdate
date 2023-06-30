import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electronyzer';
import { of, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IpcService {

  constructor(private _electronService: ElectronService) { }

  getItems(): Observable<any> {
    return of(this._electronService.ipcRenderer.sendSync('get-items'));
  }
}
