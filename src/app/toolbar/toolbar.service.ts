import { Injectable } from '@angular/core';
import { Channel } from '../models/Channel';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class ToolbarService {
  currentChannel$ = new BehaviorSubject<Channel>(null);

  selectChannel(channel: Channel) {
    this.currentChannel$.next(channel);
  }

}
