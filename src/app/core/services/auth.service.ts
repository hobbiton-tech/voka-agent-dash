import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, take, catchError } from 'rxjs/operators';

import { CookieService } from '../services/cookie.service';
import { User } from '../models/auth.models';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  user; // User;

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore
  ) {}

  /**
   * Returns the current user
   */
  public currentUser() {
    if (!this.user) {
      this.user = JSON.parse(this.cookieService.getCookie('currentUser'));
    }

    return this.user;
  }

  register({ first_name, last_name, email, password }) {
    return new Promise<any>((resolve, reject) => {
      this.afAuth
        .createUserWithEmailAndPassword(email, password)
        .then((res) => {
          res.user.sendEmailVerification();
          let userId = res.user.uid;

          this.firestore
            .collection('users')
            .doc(userId)
            .set({
              first_name,
              last_name,
              email,
            })
            .then(() => {
              resolve(res);
            })
            .catch((error) => {
              console.error('AuthService register: ', error);
            });
        })
        .catch((error) => {
          console.error('AuthService register: ', error);
          reject(error);
        });
    });
  }

  /**
   * Performs the auth
   * @param email email of user
   * @param password password of user
   */
  login(email: string, password: string) {
    return new Promise<any>((resolve, reject) => {
      this.afAuth
        .signInWithEmailAndPassword(email, password)
        .then((res) => {
          // Get user data
          let userId = res.user.uid;

          this.firestore
            .collection('users')
            .doc(userId)
            .get()
            .pipe(take(1))
            .subscribe((userData) => {
              if (userData.exists) {
                this.user = userData.data();
                this.user = Object.assign(this.user, res.user);

                // store user details and jwt in cookie
                this.cookieService.setCookie(
                  'currentUser',
                  JSON.stringify(res.user),
                  1
                );

                resolve(res);
              } else {
                console.error("User doesn't exist");
              }
            });
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  /**
   * Logout the user
   */
  logout() {
    // remove user from local storage to log user out
    this.cookieService.deleteCookie('currentUser');

    return new Promise<any>((resolve, reject) => {
      this.afAuth
        .signOut()
        .then((res) => {
          this.user = null;
          resolve(res);
        })
        .catch((error) => {
          console.error(error);
          reject(error);
        });
    });
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.error(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
