import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { UserService } from '../../../services/user.service';
import { CountryCode } from './country-code';

// seraching
import { ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { VERSION } from '@angular/material';
import { FormControl } from '@angular/forms';
import { MatSelect } from '@angular/material';

import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { takeUntil } from 'rxjs/operators';
import { } from 'rxjs/add/operator/then';

interface Country {
  id: string;
  name: string;
  code: string
}


@Component({
  selector: 'fuse-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: fuseAnimations
})
export class FuseLoginComponent implements OnInit {
  loginForm: FormGroup;
  loginFormErrors: any;
  countryCodes: any;
  failureMsg: string = "";
  showCountryCodeField: boolean = true;
  codeData: string = "";
  showPlusSign: boolean = false;
  saveSearch: string;
  showDropbox: boolean = true;
  lastSearch: string = "";


  constructor(
    private fuseConfig: FuseConfigService,
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

    this.loginFormErrors = {
      email: {},
      password: {},
    };
  }

  ngOnInit() {
    this.countryCodes = new CountryCode();
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', Validators.required],
    });
  }

  ngAfterViewInit() {
  }

  //**
  //* Login Function
  //****
  login() {
    var credentials = { email: "", password: "" };
    credentials.password = this.loginForm.value.password;
    credentials.email = this.loginForm.value.email;

    this.userService.login(credentials).subscribe(
      res => {
        localStorage.setItem('isLogin', 'true');
        console.log(res);
        localStorage.setItem('user', JSON.stringify(res));
        this.router.navigate(['auth/inventory'])
        console.log(res);
      },
      err => {
          this.failureMsg = err.error.errors;
          setInterval(() => {
            this.failureMsg = "";
          }, 5000)
        }
      
    )
  }
}

