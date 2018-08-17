import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommunicationService } from '../services/communication.service'

@Component({
  selector: 'app-current',
  templateUrl: './current.component.html',
  styleUrls: ['./current.component.css']
})
export class CurrentComponent implements OnInit,OnDestroy {

  // flag on weather loaded
  @Input() weatherloaded:boolean;

  //Weather Metadata
  wd_currently: any = [];
  wd_hourly: any = [];
  wd_daily: any = [];

  // Weather Data
  wd_location: string;
  wd_timezone: string;
  wd_icon_now: string = 'partly cloudy';
  wd_temp_now: string;
  wd_summ_now: string;
  wd_weatherData_1hr = [];
  wd_weatherData_3hr = [];
  wd_weatherData_6hr = [];
  wd_weatherData_9hr = [];
  
  

  //subscription
  private subscription: Subscription;

  constructor(private _cs:CommunicationService) { 
    
    this.subscription = this._cs.notifyObservable.subscribe((res)=>{
        this.onWeatherGet(res);
        
      },
      (err)=>{
        console.log("error getting data from home component");
      },
      ()=> console.log("Completed")
    );
  }

  onWeatherGet(res){
    this.wd_currently = res.wd_currently;
    this.wd_daily = res.wd_daily;
    this.wd_hourly = res.wd_hourly;


    this.wd_location = res.wd_location;
    this.wd_timezone = res.wd_timezone;
    this.wd_icon_now = this.wd_currently.icon.trim();
    this.wd_temp_now = this.wd_currently.temperature.toString().slice(0,2);
    this.wd_summ_now = this.wd_currently.summary;

    for(let i = 0; i < this.wd_hourly.data.length; i++){
      let target_1 = this.wd_hourly.data[0].time + 3600;
      let target_3 = this.wd_hourly.data[0].time + 3600 * 3;
      let target_6 = this.wd_hourly.data[0].time + 3600 * 6;
      let target_9 = this.wd_hourly.data[0].time + 3600 * 9;
      
      // 1 hr later weather icon
      if(this.wd_hourly.data[i].time === target_1) {
        this.wd_weatherData_1hr = this.wd_hourly.data[i];
      }

      // 3 hrs later icon
      if(this.wd_hourly.data[i].time === target_3) {
        this.wd_weatherData_3hr = this.wd_hourly.data[i];
      }

      // 6 hrs  later icon
      if(this.wd_hourly.data[i].time === target_6) {
        this.wd_weatherData_6hr = this.wd_hourly.data[i];
      }

      // 9 hrs later weather icon
      if(this.wd_hourly.data[i].time === target_9) {
        this.wd_weatherData_9hr = this.wd_hourly.data[i];
      }
    }

  }

  ngOnInit() {

  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
}
