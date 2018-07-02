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
import { inventoryService } from '../inventory-usage.service'

@Component({
  selector: 'fuse-roles',
  templateUrl: './inventory-usage.component.html',
  styleUrls: ['./inventory-usage.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class InventoryUsageComponent implements OnInit, AfterViewInit {
  modalRef: BsModalRef;
  config = {
    animated: true,
    // class:"gray modal-sm"
  };
  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  searchInput: FormControl;
  dialogRef: any;
  data: any;
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
  itemvalidate: boolean = true;
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
      inventoryId: new FormControl('', [Validators.required]),
      itemLeft: new FormControl(''),
      description: new FormControl('', [Validators.required]),
      quantity: new FormControl('', [Validators.required]),
    })
  }

  // title : req.body.title,
  //   description: req.body.description,
  //   quantity: req.body.Quantity

  ngAfterViewInit() {

  }

  validateItems(item) {
    debugger;
    if (this.roleForm.value.quantity <= this.roleForm.value.itemLeft) {
      this.itemvalidate = false;
    }
    else {
      this.itemvalidate = true;
      this.snackBar.open('Quantity is more than item left in stock', '', {
        duration: 1000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    //  alert("you have only " + this.roleForm.value.itemLeft + " left in inventory")
    }
  }

  setItem(item) {
    debugger;
    //  var obj = this.data
    var result = this.data.filter(function (obj) {
      return obj._id == item;
    });
    this.roleForm.patchValue({ itemLeft: result[0].quantity });
    console.log(this.roleForm);
  }

  /** Get list off all RealEstate  
  */
  getAllInventory() {
    this.inventoryService.getAllInventory().subscribe(
      res => {
        console.log(res);
        this.data = res.inventory;
        console.log(this.data);
      },
      err => {
        this.errorMesage = "some went wrong. please try again later";
        this.fuseSplashScreen.hide();
      }
    )
  }








  /** 
*  add or update the RealEstate
* 
*/
  addUpdateInventory() {
    debugger;
    var credientials = this.roleForm.value;
    console.log(credientials);
    if (credientials.itemLeft < credientials.quantity) {
      this.snackBar.open('Quantity is more than item left in stock', '', {
        duration: 1000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
    else {
      credientials.usedBy =   {_id:this.userData.user._id,name:this.userData.user.username};
      this.inventoryService.createInventor(credientials).subscribe(
        res => {
          this.getAllInventory();
          this.snackBar.open('Item added Successfully', '', {
            duration: 1000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
          this.getAllInventory();
          this.router.navigate(['auth/inventory-view/',credientials.inventoryId]);

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
}
