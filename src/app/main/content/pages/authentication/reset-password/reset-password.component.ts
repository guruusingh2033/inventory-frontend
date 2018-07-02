import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { UserService } from '../../../services';
import { FuseSplashScreenService } from '@fuse/services/splash-screen.service';
@Component({
  selector: 'fuse-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  animations: fuseAnimations
})
export class FuseResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  resetPasswordFormErrors: any;
  token: string;
  failureMsg: string;

  constructor(
    private fuseConfig: FuseConfigService,
    private fuseSplashScreen: FuseSplashScreenService,
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private route: ActivatedRoute,
  ) {
    this.fuseConfig.setConfig({
      layout: {
        navigation: 'none',
        toolbar: 'none',
        footer: 'none'
      }
    });

    this.resetPasswordFormErrors = {
      password: {},
      passwordConfirm: {}
    };
  }

  ngOnInit() {
    this.resetPasswordForm = this.formBuilder.group({
      password: ['', Validators.required],
      passwordConfirm: ['', [Validators.required, confirmPassword]]
    });

    this.resetPasswordForm.valueChanges.subscribe(() => {
      this.onResetPasswordFormValuesChanged();
    });
    this.token = this.route.snapshot.queryParams.access_token;
  }

  onResetPasswordFormValuesChanged() {
    for (const field in this.resetPasswordFormErrors) {
      if (!this.resetPasswordFormErrors.hasOwnProperty(field)) {
        continue;
      }

      // Clear previous errors
      this.resetPasswordFormErrors[field] = {};

      // Get the control
      const control = this.resetPasswordForm.get(field);

      if (control && control.dirty && !control.valid) {
        this.resetPasswordFormErrors[field] = control.errors;
      }
    }
  }

  confirmReset() {
    this.fuseSplashScreen.show();
    this.userService.resetPassword({ access_token: this.token, password: this.resetPasswordForm.value.password }).subscribe(
      res => {
        this.router.navigate(['/auth/login']);
        this.fuseSplashScreen.hide();

      },
      err => {
        this.fuseSplashScreen.hide();
        this.failureMsg = err.error;
        setInterval(() => {
          this.failureMsg = "";
        }, 5000)
      }
    )
  }
}

function confirmPassword(control: AbstractControl) {
  if (!control.parent || !control) {
    return;
  }

  const password = control.parent.get('password');
  const passwordConfirm = control.parent.get('passwordConfirm');

  if (!password || !passwordConfirm) {
    return;
  }

  if (passwordConfirm.value === '') {
    return;
  }

  if (password.value !== passwordConfirm.value) {
    return {
      passwordsNotMatch: true
    };
  }
}
