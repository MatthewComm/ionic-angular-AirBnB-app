import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from './user.model';


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

  private _user = new BehaviorSubject<User>({} as User);

  constructor(
    private http: HttpClient
  ) { }

  get userIsAuthenticated() {
    return this._user.asObservable().pipe(map(user => {
      if (user) {
        return !!user;
      } else {
        return false;
      }
    }));
  }

  get userId() {
    return this._user.asObservable().pipe(map(user => {
      if (!user) {
        return null;
      }
      return user.id;
    }
    ));
  }

  signUp(email: string, password: string) {
    const requestData = {
      email: email,
      password: password,
      returnSecureToken: true
    };
    return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseApiKey}`, requestData)
      .pipe(
        tap(userData => {
          const expirationTime = new Date(new Date().getTime() + (+userData.expiresIn * 1000));
          this._user.next(
            new User(userData.localId, userData.email, userData.idToken, expirationTime)
          );
        })
      );
  }

login(email: string, password: string) {
  const requestBody = {
    email: email,
    password: password,
    returnSecureToken: true
  };
  return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseApiKey}`, requestBody)
    .pipe(
      tap(userData => {
        const expirationTime = new Date(new Date().getTime() + (+userData.expiresIn * 1000));
        this._user.next(
          new User(userData.localId, userData.email, userData.idToken, expirationTime)
        );
      })
    );
}

logout() {
  this._user.next({} as User);
}
}
