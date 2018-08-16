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

    //other variables
    locationDenied: boolean = false;
    usrInp: string;
    weatherLoaded:boolean = false;

    // location information for user input and current location
    usr_lat:string; 
    usr_lng:string;
    curr_lat:string;
    curr_lng:string;

    // publishable weather data
    wd_data:any; 

    //Weather Metadata
    wd_currently: any = [];
    wd_hourly: any = [];
    wd_daily: any = [];

    // Weather Data
    wd_location: string;
    wd_timezone: string;

    constructor(
                private _ws:WeatherService, 
                private _gs:GeolocationService,
                private _cs:CommunicationService
              ){

      //Place Holder for Input
      this.usrInp = 'Change Location... ';

      // check if location access is allowed
      if(navigator.geolocation){
        this.goToMyLocation();
      }
      else {
        this.locationDenied=true;
      } 
    }

    ngOnInit(){
      // listen for user input
      let obs$ = fromEvent(this.userInput.nativeElement,'input')
      .pipe(
        map((e:any) => e.target.value),
        debounceTime(1000),
        distinctUntilChanged()
      ).subscribe((txt:string) => this.getLocationbyName(txt));
    }

    // get coordinates from user input
    getLocationbyName(cityName:string){
      if(cityName!=""){
        this._gs.getCoordinates(cityName).subscribe(
          res => {
            if(res.status==="OK"){
              this.usr_lat=res.results[0].geometry.location.lat;
              this.usr_lng=res.results[0].geometry.location.lng;
              this.wd_location = res.results[0].formatted_address;          
              this.getWeather(this.usr_lat,this.usr_lng);
            }
            else console.log("Invalid Input");
          },
          err => {
            console.log("Error while fetching Location by Name");
          }
        );
      }
      else {
        this.goToMyLocation();
      }
    }

    getNameByLocation(lat:string,lng:string){
      this._gs.getLocation(lat,lng).subscribe(
        res => {
          if(res.status === "OK"){
            this.wd_location = res.results[0].formatted_address;
            this.getWeather(this.curr_lat,this.curr_lng);
          }
          else {
            console.log("Error fetching User location information");
          }
        },
        err => {
          console.log("Error fetching city from location");
        }
      );
    }

    // get weather data from coordinates
    getWeather(lat:string,lng:string){
      this._ws.getWeather(lat,lng).subscribe(
        res => {
          console.log(res);
          this.setIdle();
        }
      )
    }

    onWeatherGet(){
      // communicate this data with other
      this.wd_data = {
        wd_currently:this.wd_currently,
        wd_hourly:this.wd_hourly,
        wd_daily:this.wd_daily,
        wd_location:this.wd_location,
        wd_timezone:this.wd_timezone
      };
      this._cs.communicate(this.wd_data);
      this.setIdle();
    }

    goToMyLocation(){
      this.setBusy();
      this.usrInp='Change Location .. '
      if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition((pos)=>{
          this.curr_lat = pos.coords.latitude.toString();
          this.curr_lng = pos.coords.longitude.toString();
          this.getNameByLocation(this.curr_lat,this.curr_lng);
        },(err)=>{
          this.setIdle();
          console.log("Error Obtaining user current location");
        });
      }
      else {
        this.setIdle();
        console.log("User has denied the location permission");
      }
    }

    // Show spinner
    setBusy(){
      this.weatherLoaded = false;
    }

    // Hide spinner
    setIdle(){
      setTimeout(function() {
        this.weatherLoaded = true;
      }.bind(this), 100);
    }
}
