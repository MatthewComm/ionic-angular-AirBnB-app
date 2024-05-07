import { Component, OnDestroy, OnInit } from '@angular/core';
import { Place } from '../../places.models';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, NavController, AlertController } from '@ionic/angular';
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
  isLoading: Boolean = false;
  private placeSub: Subscription = new Subscription();

  constructor(
    private router: ActivatedRoute,
    private navController: NavController,
    private placesService: PlacesService,
    private loadingController: LoadingController,
    private alertCtrl: AlertController
  ) {
    this.place = {} as Place;
    this.form = new FormGroup({});
  }

  ngOnInit() {
    this.router.paramMap.subscribe({
      next: (paramMap) => {
        if (!paramMap.has('placeId')) {
          this.navController.navigateBack('/places/tabs/offers');
          return;
        }
        const placeId = paramMap.get('placeId')!;
        this.isLoading = true;
        this.placeSub = this.placesService.getPlace(placeId).subscribe({
          next: (place) => {
            this.place = place as Place;
            this.form = new FormGroup({
              title: new FormControl(this.place.title, {
                updateOn: 'blur',
                validators: [Validators.required],
              }),
              description: new FormControl(this.place.description, {
                updateOn: 'blur',
                validators: [Validators.required, Validators.maxLength(180)],
              }),
            });
            this.isLoading = false;
          },
          error: (error) => {
            this.alertCtrl.create({
              header: 'An error occurred!',
              message: 'Place could not be fetched. Please try again later.',
              buttons: [{
                text: 'Okay',
                handler: () => {
                  this.navController.navigateBack('/places/tabs/offers');
                }
              }]
            }).then(alertEl => {
              alertEl.present();
            });
          }
        });
      }
    });
  }


  onEditOffer() {
    if (!this.form.valid) {
      return;
    }

    this.loadingController.create({
      message: 'Updating place...',
    }).then(loadingEl => {
      loadingEl.present();
      this.placesService.updatePlace(
        this.place.id,
        this.form.value.title,
        this.form.value.description
      ).subscribe(() => {
        loadingEl.dismiss();
        this.navController.navigateBack('/places/tabs/offers');
      });
    });
  }

  ngOnDestroy() {
    if (this.placeSub) {
      this.placeSub.unsubscribe();
    }
  }

}
