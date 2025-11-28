import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class User {
  public displayName = signal<string>('')
  private baseUrl = 'http://localhost:5000/api/'; // backend URL

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      this.displayName.set(parsed.name);
    }
  }

  public getUsers(): Observable<any> {
    return this.http.get(`${this.baseUrl}users`);
  }

  public registerUsers(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}users/register`, userData);
  }
  public setDisplayName(name: string): void {
    this.displayName.set(name);
  }

  public clearDisplayName(): void {
    this.displayName.set('');
  }

  public addToWishlist(eventId: string): Observable<any> {
    const token = localStorage.getItem("token");

    return this.http.post(
      `${this.baseUrl}users/wishlist/${eventId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }

  public removeFromWishlist(eventId: string) {
    const token = localStorage.getItem("token");

    return this.http.delete(`${this.baseUrl}users/wishlist/${eventId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  public updateProfile(formData: FormData) {
  const token = localStorage.getItem("token");

  return this.http.put(`${this.baseUrl}users/profile`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

public getUserById(id: string) {
  const token = localStorage.getItem("token");

  return this.http.get(`${this.baseUrl}users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

}
