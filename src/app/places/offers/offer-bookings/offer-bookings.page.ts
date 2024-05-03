import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { PlacesService } from '../../places-service.service';
import { Place } from '../../places.models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-offer-bookings',
  templateUrl: './offer-bookings.page.html',
  styleUrls: ['./offer-bookings.page.scss'],
})
export class OfferBookingsPage implements OnInit, OnDestroy {

  place: Place;
  private placeSub: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private navController: NavController,
    private placesService: PlacesService
    ) {
      this.place = {} as Place;
     }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navController.navigateBack('/places/tabs/offers');
        return;
      }
      const placeId = paramMap.get('placeId')!;
      this.placeSub = this.placesService.getPlace(placeId).subscribe((place) => {
        this.place = place as Place;
      });
    });
  }

  onEdit() {
    console.log(this.place.id);
  }

  ngOnDestroy() {
    if (this.placeSub) {
      this.placeSub.unsubscribe();
    }
  }

}
