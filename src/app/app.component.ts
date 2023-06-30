import { Component } from '@angular/core';
import { IpcService } from './ipc.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'angular-autoupdate';
  version: any;

  constructor(
    private ipcService: IpcService
  ) { }


  ngOnInit() {
    this.ipcService.getItems().subscribe((items) => {
      console.log('version', items)
      this.version = items
    });
  }

}
