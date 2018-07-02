import { Injectable, OnInit } from '@angular/core';
import { RequestOptions, Headers, URLSearchParams, } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';
import { Response } from '@angular/http';
import { environment } from '../../../../environments/environment';

@Injectable()
export class BankService implements OnInit {
  // token:string=localStorage.getItem('token');
  constructor(private _http: HttpClient,
    private router: Router) {

  }
  ngOnInit() {
  }

  getAllBanks() : any
  {
    return this._http.get(environment.serverURL + "/banks").map(
      res => {
        return res;
      }
    )
  }

}