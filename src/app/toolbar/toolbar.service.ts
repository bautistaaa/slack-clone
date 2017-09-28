import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ToolbarService {
  currentChannel = new Subject();

  constructor() { }

  selectChannel(channel: string) {
    this.currentChannel.next(channel);
  }
}
