import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  
  currentUser = signal<{ username: string, role: string } | null>(null);
  token = signal<string | null>(localStorage.getItem('token'));

  constructor() {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      this.currentUser.set(JSON.parse(savedUser));
    }
  }

  login(credentials: { email: string, password: any }) {
    return this.http.post<any>(`${environment.apiUrl}/auth/login`, credentials).pipe(
      tap(res => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify({ username: res.username, role: res.role }));
        this.token.set(res.token);
        this.currentUser.set({ username: res.username, role: res.role });
      })
    );
  }

  register(userData: any) {
    return this.http.post(`${environment.apiUrl}/auth/register`, userData);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.token.set(null);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  isAdmin() {
    return this.currentUser()?.role === 'Admin';
  }

  isAuthenticated() {
    return !!this.token();
  }
}
