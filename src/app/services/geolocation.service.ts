import { Injectable } from '@angular/core';
import { Http, Jsonp, RequestOptions, Headers } from '@angular/http';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {

  constructor(private _http: Http) { }

  getCoordinates(text: string) {
    var requestUrl = 'http://weatherserver.us-east-2.elasticbeanstalk.com/coordinates?text=' + text;
    return this._http.get(requestUrl).pipe(
      map(res => res.json())
    );
  }

  getLocation(lat: string, lng: string) {
    var requestUrl = "http://weatherserver.us-east-2.elasticbeanstalk.com/location";
    requestUrl += "?lat=" + lat + "&lng=" + lng;
    return this._http.get(requestUrl).pipe(
      map(res => res.json())
    );
  }

  getCurrentPosition() {
    var requestUrl = "http://weatherserver.us-east-2.elasticbeanstalk.com/mylocation";
    //console.log(requestUrl);
    return this._http.get(requestUrl).pipe(
      map(
        res => res.json()
      ));
    /* var requestUrll = "https://api.ipify.org?format=json";
    this._http.get(requestUrll).subscribe(
      res=>{
        console.log(res.json().ip.toString() + " hello")
      },
      err=>{
        console.log(err + " world")
      }
    ) */
  }

}
