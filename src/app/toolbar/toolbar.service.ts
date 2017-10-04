import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Channel } from '../models/Channel';

@Injectable()
export class ToolbarService {
  currentChannel = new Subject<Channel>();

  constructor() { }

  selectChannel(channel: Channel) {
    this.currentChannel.next(channel);
  }
}
