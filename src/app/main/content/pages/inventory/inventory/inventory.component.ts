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

import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { FuseSplashScreenService } from '@fuse/services/splash-screen.service';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { inventoryService } from '../inventory.service'

@Component({
  selector: 'inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class InventoryComponent implements OnInit, AfterViewInit {
  modalRef: BsModalRef;
  config = {
    animated: true,
  };
  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  searchInput: FormControl;
  dialogRef: any;
  data = new MatTableDataSource();
  errorMesage: any;
  contacts: any;
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
  userData:any=JSON.parse(localStorage.getItem("user"));
  constructor(
    public dialog: MatDialog,
    private router: Router,
    private changeDetectorRefs: ChangeDetectorRef,
    private fuseSplashScreen: FuseSplashScreenService,
    private modalService: BsModalService,
    public snackBar: MatSnackBar,
    private inventoryService: inventoryService,
    private fb: FormBuilder
  ) {
    this.searchInput = new FormControl('');
  }

  ngOnInit() {
    this.getAllInventory();
    this.roleForm = this.fb.group({
      title: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      quantity: new FormControl('', [Validators.required])
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
        var finalRes = res.inventory.map(function(data){
          var dateCreated =  new Date(data.createdAt);
          data.createdAt = dateCreated.getDay()+'/'+dateCreated.getMonth()+'/'+dateCreated.getFullYear()+ ' ' +dateCreated.getHours()+':'+dateCreated.getMinutes()+':'+dateCreated.getSeconds();
          var dateUpdated =  new Date(data.updatedAt);
          data.updatedAt = dateUpdated.getDay()+'/'+dateUpdated.getMonth()+'/'+dateUpdated.getFullYear()+ ' ' +dateUpdated.getHours()+':'+dateUpdated.getMinutes()+':'+dateUpdated.getSeconds();
         if(typeof data.createdBy == 'object' && typeof data.updatedBy == 'object'){
          data.createdBy = data.createdBy.name;
          data.updatedBy =  data.updatedBy.name;
         }
          return data;
        });
        this.data = new MatTableDataSource(finalRes);
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

  getInventoryUsageByInventoryId(row) {
    //console.log(row);
    // this.roleObj = row;
    // this.isEdit = true
    // this.modalRef = this.modalService.show(template, this.config);
    // this.roleForm.patchValue(row);
    // this.inventoryService.getAllInventoryUsageByInvenoryId(row._id).subscribe(
    //   res => {
    //     console.log(res);
    //   },
    //   err => {
    //     this.errorMesage = "some went wrong. please try again later";
    //     this.fuseSplashScreen.hide();
    //   }
    // )


    this.router.navigate(['auth/inventory-view/',row._id]);

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
       console.log(this.userData.user._id);
       credientials.updatedBy  = {_id:this.userData.user._id,name:this.userData.user.username};
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
      credientials.createdBy  = {_id:this.userData.user._id,name:this.userData.user.username};

      credientials.updatedBy  = {_id:this.userData.user._id,name:this.userData.user.username};

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
  deleteInventory(contact) {
    debugger;
    this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });
    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fuseSplashScreen.show();
        this.inventoryService.deleteInventor(contact._id).subscribe(
          res => {
            this.getAllInventory();
            this.snackBar.open('Delete item Successfully', '', {
              duration: 1000,
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
            });
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
