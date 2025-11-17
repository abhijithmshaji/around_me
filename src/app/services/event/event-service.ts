import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private http: HttpClient){}
  
  private baseUrl = 'http://localhost:5000/api/';

  public getEvents():Observable<any>{
     return this.http.get(`${this.baseUrl}events`);
  }
  public addEvents(formData:any):Observable<any>{
    return this.http.post(`${this.baseUrl}events/create`, formData);
  }
}
