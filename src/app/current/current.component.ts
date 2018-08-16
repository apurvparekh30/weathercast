import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommunicationService } from '../services/communication.service'

@Component({
  selector: 'app-current',
  templateUrl: './current.component.html',
  styleUrls: ['./current.component.css']
})
export class CurrentComponent implements OnInit,OnDestroy {

  // subscription

  private subscription: Subscription;

  constructor(private _cs:CommunicationService) { }

  ngOnInit() {
    this.subscription = this._cs.weatherData$.subscribe((res)=>{
      //console.log(res);
    });
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
}
