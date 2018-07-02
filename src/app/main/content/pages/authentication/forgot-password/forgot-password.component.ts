import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FuseSplashScreenService } from '@fuse/services/splash-screen.service';
import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { UserService } from '../../../services';
import { Router } from '@angular/router';
@Component({
  selector: 'fuse-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  animations: fuseAnimations
})
export class FuseForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  forgotPasswordFormErrors: any;
  failureMsg: string;
  constructor(
    private fuseConfig: FuseConfigService,
    private fuseSplashScreen: FuseSplashScreenService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.fuseConfig.setConfig({
      layout: {
        navigation: 'none',
        toolbar: 'none',
        footer: 'none'
      }
    });

    this.forgotPasswordFormErrors = {
      email: {}
    };
  }

  ngOnInit() {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.forgotPasswordForm.valueChanges.subscribe(() => {
      this.onForgotPasswordFormValuesChanged();
    });
  }

  onForgotPasswordFormValuesChanged() {
    for (const field in this.forgotPasswordFormErrors) {
      if (!this.forgotPasswordFormErrors.hasOwnProperty(field)) {
        continue;
      }

      // Clear previous errors
      this.forgotPasswordFormErrors[field] = {};

      // Get the control
      const control = this.forgotPasswordForm.get(field);

      if (control && control.dirty && !control.valid) {
        this.forgotPasswordFormErrors[field] = control.errors;
      }
    }
  }

  /**
   * send email to confirmation the password.
   */
  confirmForgotApi() {
    this.fuseSplashScreen.show();
    this.userService.forgetPassword(this.forgotPasswordForm.value.email).subscribe(
      res => {
        this.fuseSplashScreen.hide();
        this.router.navigate(['auth/mail-confirm'])
      },
      err => {
        this.fuseSplashScreen.hide();
        this.failureMsg = err.message;
        setInterval(() => {
          this.failureMsg = "";
        }, 5000)
      }
    )
  }
}
