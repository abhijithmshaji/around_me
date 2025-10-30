import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  private baseUrl = 'http://localhost:5000/api/'; // backend URL

  constructor(private http: HttpClient) { }

  public loginUsers(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}users/login`, { email, password });
  }

  public get isLoggedIn() {
    const token = localStorage.getItem('token')
    if (token) {
      return true
    } else {
      return false
    }
  }

  public get userName() {
    const userData = localStorage.getItem('user')
    if (userData) {
      return JSON.parse(userData).name
    } else {
      return null
    }
  }
}
