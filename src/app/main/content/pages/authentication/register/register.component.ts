import { Component, OnInit, Input } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { UserService } from '../../../services/user.service';
import { CountryCode } from './country-code';
import { FuseSplashScreenService } from '@fuse/services/splash-screen.service';

// seraching
import { ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { VERSION } from '@angular/material';
import { FormControl } from '@angular/forms';
import { MatSelect } from '@angular/material';

import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { takeUntil } from 'rxjs/operators';

interface Country {
  id: string;
  name: string;
  code: string
}
//

@Component({
  selector: 'fuse-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  animations: fuseAnimations
})
export class FuseRegisterComponent implements OnInit {
  @ViewChild('mySelect') mySelect;

  // seraching

  version = VERSION;
  saveSearch: string;
  showDropbox: boolean = true;
  /** control for the selected bank */
  public bankCtrl: FormControl = new FormControl();

  /** control for the MatSelect filter keyword */
  public bankFilterCtrl: FormControl = new FormControl();

  /** control for the selected bank for multi-selection */
  public bankMultiCtrl: FormControl = new FormControl();

  /** control for the MatSelect filter keyword multi-selection */
  public bankMultiFilterCtrl: FormControl = new FormControl();

  private _coutries = new CountryCode();

  /** list of countries */
  private countries: Country[] = this._coutries.allCountries;

  /** list of banks filtered by search keyword */
  public filteredBanks: ReplaySubject<Country[]> = new ReplaySubject<Country[]>(1);

  /** list of banks filtered by search keyword for multi-selection */
  public filteredBanksMulti: ReplaySubject<Country[]> = new ReplaySubject<Country[]>(1);

  @ViewChild('singleSelect') singleSelect: MatSelect;
  @ViewChild('multiSelect') multiSelect: MatSelect;

  /** Subject that emits when the component has been destroyed. */
  private _onDestroy = new Subject<void>();

  @Input() placeholderLabel = 'Search';
  // seraching
  registerForm: FormGroup;
  registerFormErrors: any;
  countryCodes: any;
  isSubmitting = false;
  codeData: string = "";
  showCountryCodeField: boolean = true;
  showPlusSign: boolean = false;
  isPhoneOk: boolean;
  countryNum: any = "";
  isCountryCodeOk: boolean;
  isZombian: boolean;
  isProcessing: boolean;
  phoneNumber: any = "";
  failureMsg: string = "";
  lastSearch: string = ""

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

    this.registerFormErrors = {
      firstName: {},
      lastName: {},
      countryCode: {},
      phoneNumber: {},
      emailAddress: {},
      password: {},
      passwordConfirm: {}
    };
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      passwordConfirm: ['', [Validators.required, confirmPassword]]
    });

  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  onRegisterFormValuesChanged() {
    for (const field in this.registerFormErrors) {
      if (!this.registerFormErrors.hasOwnProperty(field)) {
        continue;
      }

      // Clear previous errors
      this.registerFormErrors[field] = {};

      // Get the control
      const control = this.registerForm.get(field);

      if (control && control.dirty && !control.valid) {
        this.registerFormErrors[field] = control.errors;
      }
    }
  }

  /** register new user
   * 
  */
  register() {
    debugger;
    this.fuseSplashScreen.show();
    this.isSubmitting = true;
    var credentials = this.registerForm.value;
    this.userService.register(credentials).subscribe(
      res => {
        this.fuseSplashScreen.hide();
        this.isSubmitting = false;
        localStorage.setItem('username', credentials.phoneNumber);
        localStorage.setItem('password', credentials.password);
        this.router.navigate(['/auth/login'])
      },
      err => {
        console.log(err);
        this.fuseSplashScreen.hide();
        this.isSubmitting = false;
          this.failureMsg = err.error.error;
          setInterval(() => {
            this.failureMsg = "";
          }, 8000)
      }
    )
  }
}


/** validate password or confirm password
 * @param {AbstractControl} control - controls of password and confirm password
*/
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
