import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { map, distinctUntilChanged, last } from 'rxjs/operators';
import { debounceTime } from 'rxjs/operators';
import { WeatherService } from '../services/weather.service'
import { GeolocationService } from '../services/geolocation.service';
import { CommunicationService } from '../services/communication.service';
import 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  @ViewChild('userInput') userInput: ElementRef;


  locationDenied: boolean = false;

  //other variables
  usrInp: string;
  weatherLoaded: boolean;
  invalid_message: string = '';

  // location information for user input and current location
  usr_lat: string;
  usr_lng: string;
  curr_lat: string;
  curr_lng: string;

  // publishable weather data
  wd_data: any;

  //Weather Metadata
  wd_currently: any = [];
  wd_hourly: any = [];
  wd_daily: any = [];

  // Weather Data
  wd_location: string;
  wd_timezone: string;

  constructor(
    private _ws: WeatherService,
    private _gs: GeolocationService,
    private _cs: CommunicationService
  ) {
    console.log("in constructor");
    if(navigator.geolocation){
      this.goToMyLocation();
    }
    else{
      console.log("user denied location");
      this.locationDenied=true;
    }
  }

  ngOnInit() {
    // listen for user input
    let obs$ = fromEvent(this.userInput.nativeElement, 'input')
      .pipe(
        map((e: any) => e.target.value),
        debounceTime(1000),
        distinctUntilChanged()
      ).subscribe((txt: string) => {
        this.setBusy();
        this.getCoordinates(txt)
      });
  }

  // get coordinates from user input
  getCoordinates(cityName: string) {
    if (cityName != "") {
      this._gs.getCoordinates(cityName).subscribe(
        res => {
          this.wd_location = res.Response.View[0].Result[0].Location.Address.Label;
          this.curr_lat = res.Response.View[0].Result[0].Location.NavigationPosition[0].Latitude;
          this.curr_lng = res.Response.View[0].Result[0].Location.NavigationPosition[0].Longitude;
          this.getWeather(this.curr_lat,this.curr_lng);
        },
        err => {
          console.log("Error orccured " + err);
        }
      )
    }
    else {
      this.goToMyLocation();
    }
  }

  getNameByLocation(lat: string, lng: string) {
    this._gs.getLocation(lat, lng).subscribe(
      res => {
        this.wd_location = res.Response.View[0].Result[0].Location.Address.Label;
        this.getWeather(this.curr_lat, this.curr_lng);
      },
      err => {
        console.log("Error fetching User location information");
      }
    );
  }

  // get weather data from coordinates
  getWeather(lat: string, lng: string) {
    this._ws.getWeather(lat, lng).subscribe(
      res => {
        this.wd_currently = res.currently;
        this.wd_timezone = res.timezone;
        this.wd_hourly = res.hourly;
        this.wd_daily = res.daily;
        this.onWeatherGet();
      },
      err=>{
        console.log("Error loading weather data " + err);
      }
    )
  }

  onWeatherGet() {
    // communicate this data with other
    this.wd_data = {
      wd_currently: this.wd_currently,
      wd_hourly: this.wd_hourly,
      wd_daily: this.wd_daily,
      wd_location: this.wd_location,
      wd_timezone: this.wd_timezone
    };
    this._cs.communicate(this.wd_data);
    this.setIdle();
  }

  goToMyLocation() {
    this.setBusy();
    this.usrInp = 'Change Location .. '
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        this.curr_lat = pos.coords.latitude.toString();
        this.curr_lng = pos.coords.longitude.toString();
        this.getNameByLocation(this.curr_lat, this.curr_lng);
      }, (err) => {
        this.setIdle();
        console.log("Error Obtaining user current location " + err);
      });
    }
    else {
      this.setIdle();
      console.log("User has denied the location permission");
    }
  }

  // Show spinner
  setBusy() {
    this.weatherLoaded = false;
  }

  // Hide spinner
  setIdle() {
    this.weatherLoaded = true;
  }
}
