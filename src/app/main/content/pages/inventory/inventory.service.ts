import { Injectable, OnInit } from '@angular/core';
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
export class inventoryService implements Resolve<any>
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
    this.subject.next({ msg: foo });
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

  /** Get List of all RealEstate 
* 
* @returns list of inventory
*/
  getAllInventory(): any {
    return this._http.get(environment.serverURL + "/Inventory").map(
      res => {
        return res
      }
    )

  }


    /** Get List of all RealEstate 
* 
* @returns list of inventory
*/
getAllInventoryUsageByInvenoryId(inventoryId): any {
  return this._http.get(environment.serverURL + "/InventoryUsageById/"+ inventoryId).map(
    res => {
      return res
    }
  )
}

  /** Create a new inventory 
   * @param {any} foo - inventory object
   * 
   * @returns added inventory object with _id
   */
  createInventor(foo): any {
    return this._http.post(environment.serverURL + "/Inventory", foo).map(
      res => {
        return res;
      }
    )
  }

  /*** Update the RealEstate 
  * @param {any} foo - inventoryinventory object with id
  * 
  * @returns inventory object
 */
  updateInventor(foo): any {
    return this._http.put(environment.serverURL + "/Inventory/", foo).map(
      res => {
        return res;
      }
    )
  }

  /** Delete the RealEstate
*  @param {any} id - inventory _id
* 
* @returns confirmation
*/
  deleteInventor(inventoryId: string) {
    debugger;
    return this._http.delete(environment.serverURL + "/Inventory/" + inventoryId).map(
      res => {
        return res;
      }
    )
  }

  deleteInventoryUsage(inventoryId: string): any {
    debugger;
    return this._http.delete(environment.serverURL + "/InventoryUsage/" + inventoryId).map(
      res => {
        return res;
      }
    )
  }



}

















