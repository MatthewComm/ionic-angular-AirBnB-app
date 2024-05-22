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
    const newBooking = new Booking(
      Math.random().toString(),
      placeId,
      this.authService.userId,
      placeTitle,
      placeImage,
      firstName,
      lastName,
      guestNumber,
      dateFrom,
      dateTo,
    );

    return this.http.post<{ name: string }>('https://ionic-angular-airbnb-app-default-rtdb.europe-west1.firebasedatabase.app/bookings.json', { ...newBooking, id: null })
      .pipe(
        switchMap(resData => {
          generatedId = resData.name;
          return this.bookings;
        }
        ),
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
    return this.http.get<{[key: string]: BookingData }>(`https://ionic-angular-airbnb-app-default-rtdb.europe-west1.firebasedatabase.app/bookings.json?orderBy="userId"&equalTo="${this.authService.userId}"`)
      .pipe(
        map(resDats => {
          const bookings = [];
          for (const key in resDats) {
            if (resDats.hasOwnProperty(key)) {
              bookings.push(new Booking(
                key,
                resDats[key].placeId,
                resDats[key].userId,
                resDats[key].placeTitle,
                resDats[key].placeImage,
                resDats[key].firstName,
                resDats[key].lastName,
                resDats[key].guestNumber,
                new Date(resDats[key].bookedFrom),
                new Date(resDats[key].bookedTo),
              ));
            }
          }
          return bookings;
        }),
        take(1),
        tap(bookings => {
          this._bookings.next(bookings);
        })
      )
  }
}
