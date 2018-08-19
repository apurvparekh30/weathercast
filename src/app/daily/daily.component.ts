import { Component, OnInit, OnDestroy,Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommunicationService } from '../services/communication.service'

@Component({
  selector: 'app-daily',
  templateUrl: './daily.component.html',
  styleUrls: ['./daily.component.css']
})
export class DailyComponent implements OnInit,OnDestroy {


  // flag on weather loaded
  @Input() weatherloaded:boolean;

  wd_daily: any = [];

  private subscription: Subscription;

  constructor(private _cs: CommunicationService) {
    this.subscription = this._cs.notifyObservable.subscribe((res) => {
      this.onWeatherGet(res);
    },
      (err) => {
        console.log("error getting data from home component");
      },
      () => console.log("Completed")
    );
  }

  onWeatherGet(res){
    console.log("daily " + this.weatherloaded);
    this.wd_daily = res.wd_daily;
  }

  ngOnInit() {
    
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

}
