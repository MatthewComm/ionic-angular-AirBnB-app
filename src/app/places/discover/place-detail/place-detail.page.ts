import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { PlacesService } from '../../places-service.service';
import { Place } from '../../places.models';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit {

  place: Place;

  constructor(
    private router: ActivatedRoute,
    private navController: NavController,
    private placesService: PlacesService
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
      this.place = this.placesService.getPlace(placeId) as Place;
    });
  }

  onBookPlace() {
    this.navController.navigateBack('/places/tabs/discover');
    console.log('Booked');
  }

}
