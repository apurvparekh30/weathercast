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
    var requestUrl = 'http://weatherserver-env.spszbfpqr6.us-east-2.elasticbeanstalk.com//coordinates?text=' + text;
    return this._http.get(requestUrl).pipe(
      map(res => res.json())
    );
  }

  getLocation(lat: string, lng: string) {
    var requestUrl = "http://weatherserver-env.spszbfpqr6.us-east-2.elasticbeanstalk.com//location";
    requestUrl += "?lat=" + lat + "&lng=" + lng;
    return this._http.get(requestUrl).pipe(
      map(res => res.json())
    );
  }

  getCurrentPosition() {
    var requestUrl = "http://weatherserver-env.spszbfpqr6.us-east-2.elasticbeanstalk.com//mylocation";
    //console.log(requestUrl);
    return this._http.get(requestUrl).pipe(
      map(
        res => res.json()
      ));
    /* var requestUrl = "https://api.ipify.org?format=json";
    var ipaddress;
    this._http.get(requestUrl).subscribe(
      res=>{
        ipaddress = res.json().ip.toString();
        console.log(ipaddress);
      },
      err=>{
        console.log(err)
      }
    ) 
    var key = "7af6f2d92eeed85c576c533ad90cdfa1";
    requestUrl = "http://api.ipstack.com/"+ipaddress+"?access_key="+key;
    return this._http.get(requestUrl).pipe(
      map(
        res => res.json()
      )
    ); */
  }

}
