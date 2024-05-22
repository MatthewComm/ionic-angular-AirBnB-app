import { Component, OnInit } from '@angular/core';
import { AuthResponseData, AuthService } from './auth.service';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  isLoading = false;
  isLoginMode = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
  }

  authenticate(email: string, password: string) {
    this.isLoading = true;
    this.loadingCtrl.create({ keyboardClose: true, message: 'Logging in...' }).then(loadingEl => {
        loadingEl.present();
        let authObs: Observable<AuthResponseData>;
        if (this.isLoginMode) {
          authObs = this.authService.login(email, password);
        } else {
          authObs = this.authService.signUp(email, password);
        }
        authObs.subscribe({
          next: (resData) => {
            console.log(resData);
            loadingEl.dismiss();
            this.isLoading = false;
            this.router.navigateByUrl('/places/tabs/discover');
          },
          error: (errRes) => {
            loadingEl.dismiss();
            this.isLoading = false;
            const code = errRes.error.error.message;
            let message = 'Could not sign you up, please try again.';
            if (code === 'EMAIL_EXISTS') {
              message = 'This email address exists already!';
            } else if (code === 'EMAIL_NOT_FOUND') {
              message = 'E-Mail address could not be found.';
            } else if (code === 'INVALID_PASSWORD') {
              message = 'This password is not correct.';
            } else if (code === 'USER_DISABLED') {
              message = 'This user account has been disabled.';
            } else if (code === 'INVALID_PASSWORD') {
              message = 'This password is not correct.';
            } else if (code === 'INVALID_LOGIN_CREDENTIALS') {
              message = 'Invalid login credentials. Please try again.';
            }
            this.showAlert(message);
          },
          complete: () => {
            // Optionally handle the complete event
          }
        });
    });
}


  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    this.authenticate(email, password);
  }

  onSwitchAuthMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  private showAlert(message: string) {
    this.alertCtrl.create({
      header: 'Authentication failed',
      message: message,
      buttons: ['Okay']
    })
      .then(alertEl => {
        alertEl.present();
      });
  }

}
