import { Component, OnDestroy, OnInit } from '@angular/core';
import { BookingsService } from './bookings.service';
import { Booking } from './bookings.model';
import { IonItemSliding, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit, OnDestroy {

  loadedBookings: Booking[] = [];
  bookingsSub: Subscription = new Subscription();

  constructor(
    private bookingsService: BookingsService,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    this.bookingsSub = this.bookingsService.bookings.subscribe(bookings => {
      this.loadedBookings = bookings;
    });
  }

  cancelBooking(bookingId: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    /*
      Create a loading element that displays a message and subscribes
      to the observable returned by the cancelBooking method.
      once it gets a response, it dismisses the loading element.
    */
    this.loadingCtrl.create({
      message: 'Cancelling...'}
    ).then(loadingEl => {
      loadingEl.present();
      this.bookingsService.cancelBooking(bookingId).subscribe(() => {
        loadingEl.dismiss();
      });
    });
  }

  ngOnDestroy() {
    if (this.bookingsSub) {
      this.bookingsSub.unsubscribe();
    }
  }

}