import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';


export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _userIsAuthenticated = false;
  private _userId = '';

  constructor(
    private http: HttpClient
  ) {}

  get userIsAuthenticated() {
    return this._userIsAuthenticated;
  }

  get userId() {
    return this._userId;
  }

  signUp(email:string, password: string) {
    const requestData = {
      email: email,
      password: password,
      returnSecureToken: true
    };
    return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseApiKey}`, requestData)

  }

  login(email: string, password: string) {
    const requestBody = {
      email: email,
      password: password,
      returnSecureToken: true
    };
    return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseApiKey}`, requestBody)
  }

  logout() {
    this._userIsAuthenticated = false;
  }
}
