import {
  Component, OnDestroy, OnInit, ChangeDetectorRef, ViewEncapsulation,
  TemplateRef, ViewChild, AfterViewInit
} from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  MatDialog, MatDialogRef, MatTableDataSource, MatPaginator, MatSort, PageEvent,
  MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition,
} from '@angular/material';

import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';

import { Router,ActivatedRoute } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { FuseSplashScreenService } from '@fuse/services/splash-screen.service';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { inventoryService } from '../inventory.service'

@Component({
  selector: 'inventory-view',
  templateUrl: './inventory-view.component.html',
  styleUrls: ['./inventory-view.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class InventoryViewComponent implements OnInit, AfterViewInit {
  modalRef: BsModalRef;
  config = {
    animated: true,
    // class:"gray modal-sm"
  };
  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  searchInput: FormControl;
  dialogRef: any;
  data = new MatTableDataSource();
  errorMesage: any;
  contacts: any;
  user: any;
  showUserId: string;
  isEdit: boolean = false;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  length = 100;
  pageSize = 10;
  pageSizeOptions = [5, 10, 15, 20];
  pageEvent: PageEvent;
  roleForm: FormGroup;
  temp = [];
  roleObj: any;
  paramId : string;
  itemDetail :any;
  constructor(
    public dialog: MatDialog,
    private router: Router,
    private changeDetectorRefs: ChangeDetectorRef,
    private fuseSplashScreen: FuseSplashScreenService,
    private modalService: BsModalService,
    public snackBar: MatSnackBar,
    private inventoryService: inventoryService,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute
  ) {
    this.searchInput = new FormControl('');
    this.activatedRoute.params.subscribe( params => this.paramId = params.id
  );

  }

  ngOnInit() {
    this.getInventoryHistory(this.paramId);
    this.roleForm = this.fb.group({
      title: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      quantity: new FormControl('', [Validators.required]),
    })
  }

  // title : req.body.title,
  //   description: req.body.description,
  //   quantity: req.body.Quantity

  ngAfterViewInit() {
    this.data.paginator = this.paginator;
    this.data.sort = this.sort;
  }

  /** Get list off all RealEstate  
  */
  getAllInventory() {
    this.inventoryService.getAllInventory().subscribe(
      res => {
        console.log(res);
        this.data = new MatTableDataSource(res.inventory);
        setTimeout(() => {
          this.data.paginator = this.paginator;
          this.data.sort = this.sort;
          this.fuseSplashScreen.hide();
        }, 200);
        console.log(this.data);
      },
      err => {
        this.errorMesage = "some went wrong. please try again later";
        this.fuseSplashScreen.hide();
      }
    )
  }

  getInventoryHistory(id:string) {

    this.inventoryService.getAllInventoryUsageByInvenoryId(id).subscribe(
      res => {
        //console.log(res);
        var finalRes = res.history.map(function(data){
          var date =  new Date(data.createdAt);
          data.createdAt = date.getDay()+'/'+date.getMonth()+'/'+date.getFullYear();
          return data;
        });
        console.log(finalRes);

        this.data = new MatTableDataSource(res.history);
        this.itemDetail = res.detail[0];
        console.log(this.itemDetail);
        setTimeout(() => {
          this.data.paginator = this.paginator;
          this.data.sort = this.sort;
          this.fuseSplashScreen.hide();
        }, 200);
        console.log(this.data);
     },
      err => {
        this.errorMesage = "some went wrong. please try again later";
        this.fuseSplashScreen.hide();
      }
    )
  }

  getInventoryUsageByInventoryId(row,template: TemplateRef<any>) {
    this.roleObj = row;
    this.isEdit = true
    this.modalRef = this.modalService.show(template, this.config);
    this.roleForm.patchValue(row);
    this.inventoryService.getAllInventoryUsageByInvenoryId(row._id).subscribe(
      res => {
        console.log(res);
      },
      err => {
        this.errorMesage = "some went wrong. please try again later";
        this.fuseSplashScreen.hide();
      }
    )
  }

  /** filter data in grid
     * @param  applyFilter - searching text  
  */
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.data.filter = filterValue;
  }

  /** open dialof for editing RealEstate values
    * @param  {any} foo - object of RealEstate
    * @param {template} template  - template reference  
 */
  editInventory(foo, template: TemplateRef<any>) {
    debugger;
    this.roleObj = foo;
    this.isEdit = true
    this.modalRef = this.modalService.show(template, this.config);
    this.roleForm.patchValue(foo);
  }


  /** open dialog for add RealEstate 
 * @param {template} template  - template reference  
*/
  addInventory(template: TemplateRef<any>) {
    this.isEdit = false;
    this.modalRef = this.modalService.show(template, this.config);
    this.roleForm.reset();
  }

  /** 
*  add or update the RealEstate
* 
*/
  addUpdateInventory() {
    debugger;
    var credientials = this.roleForm.value;
    if (this.isEdit) {
      this.inventoryService.updateInventor({ inventoryId: this.roleObj._id, inventory: credientials }).subscribe(
        res => {
          this.getAllInventory();
          this.modalRef.hide();
          this.snackBar.open('Item update Successfully', '', {
            duration: 1000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        },
        err => {
          this.snackBar.open('Someting went wrong, Please try again', '', {
            duration: 1000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
          console.log(err)
        }
      )
    }
    else {
      debugger;
      this.inventoryService.createInventor(credientials).subscribe(
        res => {
          this.getAllInventory();
          this.modalRef.hide();
          this.snackBar.open('Item added Successfully', '', {
            duration: 1000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        },
        err => {
          this.snackBar.open('Someting went wrong, Please try again', '', {
            duration: 1000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
          console.log(err)
        }
      )
    }
  }

  /** 
 *  Delete the RealEstate
 * @param {any} contact - object of RealEstate
*/
deleteInventoryUsage(contact) {
  debugger;
  this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
    disableClose: false
  });
  this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

  this.confirmDialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.fuseSplashScreen.show();
      this.inventoryService.deleteInventoryUsage(contact._id).subscribe(
        res => {
          this.snackBar.open('Deleted item Successfully', '', {
            duration: 1000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
          this.getInventoryHistory(res.id);
        },
        err => {
          this.errorMesage = "some went wrong. please try again later";
          this.fuseSplashScreen.hide();
        }
      )
    }
    this.confirmDialogRef = null;
  });
}
}
