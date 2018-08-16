import { Injectable } from '@angular/core';
import { Http, Jsonp } from '@angular/http';
import { map, catchError } from 'rxjs/operators';
import { Observable,of } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {

  gl_url = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
  gc_url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='

  constructor(private _jsonp: Jsonp, private _http: Http) { }

  getCoordinates(name:string) {
    return this._http.get(this.gl_url+name)
    .pipe(
      map(response => response.json()),
      catchError(this.handleError<any>('Error while getting Coordinates from name'))
    );
  }

  getLocation(lat: string, long: string){
    return this._http.get(this.gc_url+lat+","+long)
    .pipe(
      map(res => res.json()),
      catchError(this.handleError<any>('Error in getting name from Location'))
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
