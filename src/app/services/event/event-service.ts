import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private http: HttpClient) { }

  private baseUrl = 'http://localhost:5000/api/';

  public eventSignal = signal<any[]>([])

  public setEvents(events: any[]) {
    this.eventSignal.set(events);
  }

  public clear() {
    this.eventSignal.set([]);
  }

  public getEvents(): Observable<any> {
    return this.http.get(`${this.baseUrl}events`);
  }
  public addEvents(formData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}events/create`, formData);
  }
  public getEventById(id: string | null): Observable<any> {
    return this.http.get(`${this.baseUrl}events/${id}`)
  }
  public deleteEvet(id:string|null):Observable<any>{
    return this.http.delete(`${this.baseUrl}events/${id}`)
  }
}
