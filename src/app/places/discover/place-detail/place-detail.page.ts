import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActionSheetController, LoadingController, ModalController, NavController } from '@ionic/angular';
import { PlacesService } from '../../places-service.service';
import { Place } from '../../places.models';
import { CreateBookingComponent } from 'src/app/bookings/create-booking/create-booking.component';
import { Subscription } from 'rxjs';
import { BookingsService } from 'src/app/bookings/bookings.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit, OnDestroy {

  place: Place;
  isBookable = false;

  private placeSub: Subscription = new Subscription();

  constructor(
    private router: ActivatedRoute,
    private navController: NavController,
    private placesService: PlacesService,
    private modalController: ModalController,
    private actionSheetController: ActionSheetController,
    private bookingService: BookingsService,
    private loadingController: LoadingController,
    private authService: AuthService
  ) {
    this.place = {} as Place;
  }

  ngOnInit() {
    this.router.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navController.navigateBack('/places/tabs/discover');
        return;
      }
      const placeId = paramMap.get('placeId')!;
      this.placeSub = this.placesService.getPlace(placeId).subscribe(place => {
        this.place = place as Place;
        this.isBookable = place.userID !== this.authService.userId;
      });
    });
  }


  onBookPlace() {
    // this.navController.navigateBack('/places/tabs/discover');
    // console.log('Booked');

    this.actionSheetController.create({
      header: 'Choose an Action',
      buttons: [
        {
          text: 'Select Date',
          handler: () => {
            this.openBookingModal('select');
          }
        },
        {
          text: 'Random Date',
          handler: () => {
            this.openBookingModal('random');
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    }).then(actionSheetElement => {
      actionSheetElement.present();
    });
  }

  openBookingModal(mode: 'select' | 'random') {
    this.modalController.create({
      component: CreateBookingComponent,
      componentProps: { selectedPlace: this.place, selectedMode: mode }
    }).then(modalElement => {
      modalElement.present();
      return modalElement.onDidDismiss();
    }).then(resultData => {
      this.loadingController.create({ message: 'Booking place...' }).then(loadingElement => {
        loadingElement.present();
        if (resultData.role === 'confirm') {
          this.bookingService.addBooking(
            this.place.id,
            this.place.title,
            this.place.imageUrl,
            resultData.data.bookingData.firstName,
            resultData.data.bookingData.lastName,
            resultData.data.bookingData.guestNumber,
            resultData.data.bookingData.startDate,
            resultData.data.bookingData.endDate
          ).subscribe(() => {
            loadingElement.dismiss();
          });
        }
      });
    })
  }

  ngOnDestroy() {
    if (this.placeSub) {
      this.placeSub.unsubscribe();
    }
  }
}
