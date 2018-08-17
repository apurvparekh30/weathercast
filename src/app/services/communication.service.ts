import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {

  private weatherSource = new Subject<any>();

  notifyObservable = this.weatherSource.asObservable();

  public communicate(wd:any) {
    this.weatherSource.next(wd);
  }

}

// change class for weather
// change in location service
// server code optimization
