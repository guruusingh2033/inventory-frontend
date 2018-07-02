import {
  Component, OnDestroy, OnInit, ChangeDetectorRef, ViewEncapsulation,
  TemplateRef, ViewChild, AfterViewInit
} from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
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
import { RoleService } from '../role.service'

@Component({
  selector: 'fuse-roles',
  templateUrl: './userRole.component.html',
  styleUrls: ['./userRole.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class UserRoleComponent implements OnInit, AfterViewInit {
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
  constructor(
    public dialog: MatDialog,
    private router: Router,
    private changeDetectorRefs: ChangeDetectorRef,
    private fuseSplashScreen: FuseSplashScreenService,
    private modalService: BsModalService,
    public snackBar: MatSnackBar,
    private roleService: RoleService,
    private fb: FormBuilder
  ) {
    this.searchInput = new FormControl('');
  }

  ngOnInit() {
    this.getAllRoles();
    this.roleForm = this.fb.group({
      name: new FormControl(''),
      description: new FormControl('')
    })
  }

  ngAfterViewInit() {
    this.data.paginator = this.paginator;
    this.data.sort = this.sort;
  }

  /** Get list off all UserRole  
   */
  getAllRoles() {
    this.roleService.getAllRoles().subscribe(
      res => {
        this.data = new MatTableDataSource(res);
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

  /** filter data in grid
       * @param  applyFilter - searching text  
    */
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.data.filter = filterValue;
  }

  /** open dialof for editing UserRole values
    * @param  {any} foo - object of UserRole
    * @param {template} template  - template reference  
 */
  editUserRole(foo, template: TemplateRef<any>) {
    this.roleObj = foo;
    this.isEdit = true
    this.modalRef = this.modalService.show(template, this.config);
    this.roleForm.patchValue(foo);
  }

  /** open dialog for add UserRole 
 * @param {template} template  - template reference  
*/
  addUserRole(template: TemplateRef<any>) {
    this.isEdit = false;
    this.modalRef = this.modalService.show(template, this.config);
    this.roleForm.reset();
  }

  /** 
*  add or update the UserRole
* 
*/
  addEditUserRole() {
    var credientials = this.roleForm.value;
    if (this.isEdit) {
      this.roleService.updateRoles({ id: this.roleObj.id, name: credientials.name, description: credientials.description }).subscribe(
        res => {
          this.getAllRoles();
          this.modalRef.hide()
        },
        err => {
          console.log(err)
        }
      )
    }
    else {
      this.roleService.createRoles(credientials).subscribe(
        res => {
          this.getAllRoles();
          this.modalRef.hide()
        },
        err => {
          console.log(err)
        }
      )
    }
  }

  /** 
*  Delete the UserRole
* @param {any} contact - object of UserRole
*/
  deleteUserRole(contact) {
    this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fuseSplashScreen.show();
        this.roleService.deleteRoles(contact.id).subscribe(
          res => {
            this.getAllRoles();
            this.snackBar.open('Delete customer Successfully', '', {
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
