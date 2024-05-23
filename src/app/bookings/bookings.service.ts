import { Injectable } from '@angular/core';
import { BehaviorSubject, delay, take, tap, switchMap, map } from 'rxjs';
import { Booking } from './bookings.model';
import { AuthService } from '../auth/auth.service';
import { HttpClient } from '@angular/common/http';


interface BookingData {
  bookedFrom: string;
  bookedTo: string;
  firstName: string;
  guestNumber: number;
  lastName: string;
  placeId: string;
  placeImage: string;
  placeTitle: string;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class BookingsService {

  private _bookings = new BehaviorSubject<Booking[]>([]);
  isLoading: Boolean = false;

  constructor(
    private authService: AuthService,
    private http: HttpClient
  ) { }

  get bookings() {
    return this._bookings.asObservable();
  }

  // Method to add a booking
  addBooking(
    placeId: string,
    placeTitle: string,
    placeImage: string,
    firstName: string,
    lastName: string,
    guestNumber: number,
    dateFrom: Date,
    dateTo: Date
  ) {
    let generatedId: string;
    let newBooking: Booking;

    return this.authService.userId.pipe(
      take(1),
      switchMap(userId => {
        if (!userId) {
          throw new Error('No user ID found!');
        }
        newBooking = new Booking(
          Math.random().toString(),
          placeId,
          userId,
          placeTitle,
          placeImage,
          firstName,
          lastName,
          guestNumber,
          dateFrom,
          dateTo,
        );
        return this.http.post<{ name: string }>(
          'https://ionic-angular-airbnb-app-default-rtdb.europe-west1.firebasedatabase.app/bookings.json',
          { ...newBooking, id: null }
        );
      }),
      switchMap(resData => {
        generatedId = resData.name;
        return this.bookings;
      }),
      take(1),
      tap(bookings => {
        newBooking.id = generatedId;
        this._bookings.next(bookings.concat(newBooking));
      })
    );
  }


  //Method for cancelling a booking.
  cancelBooking(bookingId: string) {
    return this.http.delete(`https://ionic-angular-airbnb-app-default-rtdb.europe-west1.firebasedatabase.app/bookings/${bookingId}.json`)
      .pipe(
        switchMap(() => {
          return this.bookings;
        }),
        take(1),
        tap(bookings => {
          this._bookings.next(bookings.filter(b => b.id !== bookingId));
        })
      )
  }

  fetchBookings() {
    return this.authService.userId.pipe(
      take(1),
      switchMap(userId => {
        if (!userId) {
          throw new Error('User not found!');
        }
        return this.http.get<{ [key: string]: BookingData }>(
          `https://ionic-angular-airbnb-app-default-rtdb.europe-west1.firebasedatabase.app/bookings.json?orderBy="userId"&equalTo="${userId}"`
        );
      }),
      map(resData => {
        const bookings = [];
        for (const key in resData) {
          if (resData.hasOwnProperty(key)) {
            bookings.push(
              new Booking(
                key,
                resData[key].placeId,
                resData[key].userId,
                resData[key].placeTitle,
                resData[key].placeImage,
                resData[key].firstName,
                resData[key].lastName,
                resData[key].guestNumber,
                new Date(resData[key].bookedFrom),
                new Date(resData[key].bookedTo)
              )
            );
          }
        }
        return bookings;
      }),
      tap(bookings => {
        this._bookings.next(bookings);
      })
    );
  }
}

