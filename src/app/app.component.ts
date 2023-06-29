import { Component } from '@angular/core';
import { IpcService } from './ipc.service';
import { app } from 'electron';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-autoupdate';
  version: any;

  constructor(private ipcService: IpcService) { }

  ngOnInit() {

    console.log('app ver', app.getVersion());
    this.ipcService.getData().subscribe((res) => {
      console.log("getResponseData() response =>", res.data);
      // setTimeout(() => {
      this.version = res.data;
      // }, 500)
      console.log('version', this.version);
    });
  }
}
