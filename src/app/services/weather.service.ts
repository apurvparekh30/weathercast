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

  constructor(private _jsonp: Jsonp, private _http: Http) { }

  getWeather(lat: string, lng: string){ 
    /* let params = new HttpParams();
    params = params.append('lat',lat);
    params = params.append('lng',lng); */
    return this._http.get(this.serverUrl+"lat/"+lat+"/lng/"+lng)
    .pipe(
      map(res => res.json()),
      catchError(this.handleError<any>('Error in getting Weather Details'))
    );
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
 
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
