import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { environment } from '../../environments/envoronment';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedInSubject = new BehaviorSubject<boolean>(false);  // Initially logged out
  private userDataSubject = new BehaviorSubject<any>({});

  loggedUserData$ = this.userDataSubject.asObservable();
  loggedIn$ = this.loggedInSubject.asObservable();
  token: string | null = ''
  user: any = {}

  constructor(private http: HttpClient, private router: Router) {
    this.setLoginData()
  }

  setLoginData() {
    if (sessionStorage.getItem("token") != null) {
      this.token = sessionStorage.getItem("token");
      this.decodeToken()
      this.loggedInSubject.next(true);
    }
  }

  login(userData: { username: string, password: string, role: string }): Observable<any> {
    return this.http.post(environment.apiUrl + "Auth/login", userData);
  }

  getAllUser() {
    return this.http.get(environment.apiUrl + "Auth/allUser");
  }

  registerUser(userData:any){
    return this.http.post(environment.apiUrl + "Auth/register",userData);

  }

  decodeToken() {
    this.token = sessionStorage.getItem('token');
    if (this.token != null) {
      const base = this.token.split('.')[1];
      const url = base.replace(/-/g, '+').replace(/ /g, '/');
      const anc = decodeURIComponent(atob(url).split('').map((c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      }).join(''))
      this.setUserData(JSON.parse(anc))
      return JSON.parse(anc)
    }
  }

  logout() {
    this.loggedInSubject.next(false);
    this.userDataSubject.next(null);
  }

  setUserData(userData: any) {
    this.loggedInSubject.next(true);
    this.userDataSubject.next(userData)
  }

  isLoggedIn() {
    return { isLoggedIn: this.loggedInSubject.getValue(), userData: this.userDataSubject.getValue() };
  }

}
