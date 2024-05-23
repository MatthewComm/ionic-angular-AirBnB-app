import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, tap, from } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from './user.model';
import { Preferences } from '@capacitor/preferences';


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
    return this._user.asObservable().pipe(
      map(user => {
        if (user && user.id && user.token) {
          return true;
        } else {
          return false;
        }
      })
    );
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

  private async fetchAuthData() {
    const { value } = await Preferences.get({ key: 'authData' });
    if (value) {
      const authData = JSON.parse(value);
      return authData;
    }
    return null;
  }

  autoLogin() {
    return from(this.fetchAuthData()).pipe(
      map(authData => {
        if (!authData) {
          return false;
        }
        const expirationTime = new Date(authData.tokenExpirationDate);
        if (expirationTime <= new Date()) {
          return false;
        }
        const user = new User(authData.userId, authData.email, authData.token, expirationTime);
        return user;
      }),
      tap(user => {
        if (user) {
          this._user.next(user);
        }
      }),
      map(user => {
        return !!user;
      })
    );
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
          this.storeAuthData(userData.localId, userData.idToken, expirationTime.toISOString(), userData.email);
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
          this.storeAuthData(userData.localId, userData.idToken, expirationTime.toISOString(), userData.email);
        })
      );
  }

  logout() {
    this._user.next({} as User);
    Preferences.remove({ key: 'authData' });
  }

  async storeAuthData(userId: string, token: string, tokenExpirationDate: string, email: string) {
    const data = JSON.stringify({ userId, token, tokenExpirationDate, email});
    await Preferences.set({ key: 'authData', value: data });
  }
}

