import { Component, OnDestroy, OnInit } from '@angular/core';
import { Place } from '../../places.models';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { PlacesService } from '../../places-service.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit, OnDestroy {

  place: Place;
  form: FormGroup;
  private placeSub: Subscription = new Subscription();

  constructor(
    private router: ActivatedRoute,
    private navController: NavController,
    private placesService: PlacesService
    ) {
      this.place = {} as Place;
      this.form = new FormGroup({});
    }

  ngOnInit() {
    this.router.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navController.navigateBack('/places/tabs/offers');
        return;
      }
      const placeId = paramMap.get('placeId')!;
     this.placeSub = this.placesService.getPlace(placeId).subscribe((place) => {
        this.place = place as Place;
      });

      this.form = new FormGroup({
        title: new FormControl(this.place.title, {
          updateOn: 'blur',
          validators: [
            Validators.required
          ],
        }),
        description: new FormControl(this.place.description, {
          updateOn: 'blur',
          validators: [
            Validators.required,
            Validators.maxLength(180)
          ]
        }),
      });
    }
    );
  }

  onEditOffer() {
    if (!this.form.valid) {
      return;
    }
    console.log(this.form);
  }

  ngOnDestroy() {
    if (this.placeSub) {
      this.placeSub.unsubscribe();
    }
  }

}
