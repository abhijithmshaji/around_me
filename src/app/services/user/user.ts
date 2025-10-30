import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class User {
  private baseUrl = 'http://localhost:5000/api/'; // backend URL

  constructor(private http: HttpClient) { }

  public getUsers(): Observable<any> {
    return this.http.get(`${this.baseUrl}users`);
  }

  public registerUsers(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}users/register`, userData);
  }
}
