import { Injectable } from '@angular/core';
import { Http,Jsonp } from '@angular/http';
import { map, catchError } from 'rxjs/operators';
import { Observable,of } from 'rxjs'
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class WeatherService {
  
  serverUrl = 'http://localhost:3000/';
  //serverUrl = "ec2-18-218-94-32.us-east-2.compute.amazonaws.com:3000/"

  constructor(private _http: Http) { }

  getWeather(lat: string, lng: string){ 
      var requestUrl = "http://weatherserver.us-east-2.elasticbeanstalk.com/weather";
      requestUrl+="?lat="+lat+"&lng="+lng;
      return this._http.get(requestUrl).pipe(
        map(res => res.json())
      );
  }

}
