import { Injectable,OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import { Response } from '@angular/http';
import { RequestOptions, Headers, URLSearchParams, } from '@angular/http';
import { Router } from '@angular/router'
import 'rxjs/add/operator/map';
import { environment } from '../../../../../environments/environment';


@Injectable()
export class RoleService implements Resolve<any>
{
  timeline: any;
  about: any;
  photosVideos: any;

  timelineOnChanged: BehaviorSubject<any> = new BehaviorSubject({});
  aboutOnChanged: BehaviorSubject<any> = new BehaviorSubject({});
  photosVideosOnChanged: BehaviorSubject<any> = new BehaviorSubject({});
  private subject = new Subject<any>();

  constructor(private _http: HttpClient) {
  }

  sendMessage(foo) {
    this.subject.next({msg:foo});
    // this.subject.next(message);

  }

  clearMessage() {
    this.subject.next();
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }

  /**
   * Resolve
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {Observable<any> | Promise<any> | any}
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise((resolve, reject) => {
      Promise.all([

      ]).then(
        () => {
          resolve();
        },
        reject
      );
    });
  }

     /** Get List of all Role 
* 
* @returns Lists  Role
*/
   getAllRoles(): any {
    return this._http.get(environment.serverURL + "/Roles").map(
      res => {
        return res
      }
    )

  }
  
    /** Create a new Role 
   * @param {any} foo - Role object
   * 
   * @returns added Role object with _id
   */
  createRoles(foo): any {
    return this._http.post(environment.serverURL + "/Roles", foo).map(
      res => {
        return res;
      }
    )
  }

   /*** Update the Role 
  * @param {any} foo - Role object with id
  * 
  * @returns Role object
 */
  updateRoles(foo): any {
    return this._http.put(environment.serverURL + "/Roles", foo).map(
      res => {
        return res;
      }
    )
  }
  
 /** Delete the Role
*  @param {any} id - Role _id
* 
* @returns confirmation
*/
  deleteRoles(foo: string) {
    return this._http.delete(environment.serverURL + "/Roles/" + foo).map(
      res => {
        return res;
      }
    )
  }


}

















