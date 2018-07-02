import { Injectable, OnInit } from '@angular/core';
import { RequestOptions, Headers, URLSearchParams, } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';
import { Response } from '@angular/http';
import { environment } from '../../../../environments/environment';

@Injectable()
export class UserService implements OnInit {
  // token:string=localStorage.getItem('token');
  constructor(private _http: HttpClient,
    private router: Router) {

  }
  ngOnInit() {
  }
  /**
   * Register  user
   * 
   * @param {any} user - user detail
   * 
   * @returns added user details with _id
   */
  register(user: any):any {
    return this._http.post(environment.serverURL + '/register', user).map((res: Response) => {
      return res
    }
    );
  }
  /**
     * Confirm Phone number 
   */
  confirmPhoneOtp(data) {
    return this._http.get(environment.serverURL + '/appusers/confirmPhone?username=' + data.username + '&token=' + data.token).map((res: Response) => {
      return res
    }
    );
  }
  /***
   * Login User account
   * @param {any} loginData - Username & password
   * 
   * @returns user details
   */
  login(loginData) {
    return this._http.post(environment.serverURL + '/login', loginData).map((res: Response) => {
      return res;
    })
  }
  
  /***
   * Reset Password of User
   */
  resetPassword(resetData) {
    return this._http.post(environment.serverURL + '/reset-password?access_token=' + resetData.access_token, { password: resetData.password, confirmation: resetData.password }).map((res: Response) => {
      return res;
    })
  }
  /**
   * Logout User
   */
  logout() {
    localStorage.removeItem('user');
    this.router.navigate(['auth/login'])
  }

  /**
   * Forget the password
   * 
   * @param {any} email - user email
   * 
   */
  forgetPassword(emails) {
    var data = { email: emails, location: environment.baseURL };
    return this._http.post(environment.serverURL + '/appusers/reset', data).map((res: Response) => {
      return res;
    })
  }

  /**
   * Phone Valdation Check
   * 
   * @param {number} num - phone number with country code
   * 
   * @returns is valid or not.
   */
  phoneValidationCheck(num: number) {
    return this._http.get(environment.serverURL + '/appusers/checkNumber?phoneNumber=' + num).map(
      (res: Response) => {
        return res;
      }
    )
  }

 /**
   * upload attachment
   * 
   * @param {any} data - attachment file
   * 
   * @returns object with attachment _id and path.
   */
  attachmentUpload(data): any {
    return this._http.post(environment.serverURL + '/files/upload', data).map(
      res => {
        return res;

      }
    )
  }
  /**
   * Save or Update user Profile
   * 
   * @param {any} data - Profile detail
   * @param {any} customerId - customer id
   * 
   * @returns updated or added record details
   */
  saveProfile(data, customerId) {
    // var getUserData = localStorage.getItem('user');
    // var parseUserData = JSON.parse(getUserData);
    // var id = parseUserData.user.customerId;
    // console.log(data);
    if (customerId == "new") {
      return this._http.post(environment.serverURL + "/customers/", data).map(
        res => {
          // console.log(res)
          return res
        }
      )
    }
    else {
      return this._http.put(environment.serverURL + "/customers/" + customerId, data).map(
        res => {
          // console.log(res)
          return res
        }
      )
    }
  }
 
/**
   * get profile data
   * 
   * 
   * @returns {object} profile data
   */
  getProfileData(customerId): any {
    var getUserData = localStorage.getItem('user');
    var parseUserData = JSON.parse(getUserData);
    var id = parseUserData.user.customerId;
    return this._http.get(environment.serverURL + "/customers/" + customerId).map(
      res => {
        return res;
      }
    )
  }

/**
   * get All customers
   * 
   * 
   * @returns {any} list of all customers
   */
  getAllCustomers(): any {
    var getUserData = localStorage.getItem('user');
    var parseUserData = JSON.parse(getUserData);
    var id = parseUserData.user.customerId;
    return this._http.get(environment.serverURL + "/customers/").map(
      res => {
        return res;
      }
    )
  }

/**
   * Delete Customer
   * @param {any} id - customer id
   * 
   * @returns delete cutomer confirmation.
   */
  deleteCustomer(id): any {
    return this._http.delete(environment.serverURL + "/customers/" + id).map(
      res => {
        return res;
      }
    )
  }

  /**
   * Get all banks
   * @returns {any} list of banks.
   */
  getbank(): any {
    return this._http.get(environment.serverURL + "/bank").map(
      res => {
        return res;
      }
    )
  }

  /**
   *  RoleMapping
   **/
  roleMapping(foo) {
    return this._http.post(environment.serverURL + "/RoleMappings", foo).map(
      res => {
        return res;
      }
    )
  }
  /**  
   * Appuser Update role 
   * @param {any} foo - All detail of Appuser with new role _id
   * 
   * @returns Appuser Details
   **/
  roleUpdate(foo) {
    return this._http.put(environment.serverURL + "/appusers/" + foo.userId + "?access_token=" + foo.token, { roleId: foo.roleId }).map(
      res => {
        return res;
      }
    )
  }

}