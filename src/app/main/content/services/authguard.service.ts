import { Injectable, OnInit } from '@angular/core';
import { RequestOptions, Headers, URLSearchParams, } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Response } from '@angular/http';


@Injectable()
export class AuthGuard implements OnInit {
  user: any;
  constructor(private router: Router) {
    this.user = localStorage.getItem('user');
  }
  ngOnInit() {
    }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.user = localStorage.getItem('user');
    if (this.user) {
      return true;
    }
    else {
      this.router.navigate(['auth/login']);
    }
  }

}