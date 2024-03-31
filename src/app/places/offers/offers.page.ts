import { Component, OnInit } from '@angular/core';
import { Place } from '../places.models';
import { PlacesService } from '../places-service.service';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit {

  loadedOffers: Place[] = [];

  constructor(private placesService: PlacesService) { }

  ngOnInit() {
    this.loadedOffers = this.placesService.offers;
  }

}
