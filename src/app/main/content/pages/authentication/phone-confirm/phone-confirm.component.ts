import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FuseSplashScreenService } from '@fuse/services/splash-screen.service';
import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { RoleService } from '../../roles/role.service';

@Component({
  selector: 'fuse-phone-confirm',
  templateUrl: './phone-confirm.component.html',
  styleUrls: ['./phone-confirm.component.scss'],
  animations: fuseAnimations
})
export class FusePhoneConfirmComponent implements OnInit {
  confirmation: FormGroup;
  confirmationFormErrors: any;
  username: string;
  failureMsg: string;
  roleId: string = "";
  currentUser: any;
  constructor(
    private fuseConfig: FuseConfigService,
    private fuseSplashScreen: FuseSplashScreenService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private roleService: RoleService

  ) {
    this.fuseConfig.setConfig({
      layout: {
        navigation: 'none',
        toolbar: 'none',
        footer: 'none'
      }
    });
    this.confirmationFormErrors = {
      otp: {},

    };
  }

  ngOnInit() {
    this.username = localStorage.getItem('username')
    if (!this.username) {
      this.router.navigate(['/auth/login'])
    }
    this.confirmation = this.formBuilder.group({
      otp: ['', Validators.required]
    });
    this.getAllRoles();
  }

  /** Get the all roles */
  getAllRoles() {
    this.roleService.getAllRoles().subscribe(
      res => {
        if (res && res.length > 0) {
          var foo = res.filter((obj) => obj.name.toLowerCase() == "supervisor");
          if (foo && foo.length > 0)
            this.roleId = foo[0].id;
        }
      },
      err => {
        console.log(err)
      }
    )
  }

  confirm() {
    var credentials = this.confirmation.value;
    this.fuseSplashScreen.show();
    this.userService.confirmPhoneOtp({ username: this.username, token: credentials.otp }).subscribe(
      res => {
        this.login();
        this.fuseSplashScreen.hide();
      },
      err => {
        this.fuseSplashScreen.hide();
        this.failureMsg = "Please enter a valid OTP";
        setInterval(() => {
          this.failureMsg = "";
        }, 5000)
      }
    )
  }

  login() {
    var credentials = { username: this.username, password: localStorage.getItem("password") };
    this.userService.login(credentials).subscribe(
      res => {
        this.currentUser = res;
        console.log(res);
        if (this.roleId != "") {
          this.roleMapping();
          this.updateUserRole();
        }
        localStorage.removeItem('password')
        localStorage.removeItem('username')
        this.fuseSplashScreen.hide();
        localStorage.setItem('isLogin', 'true');
        localStorage.setItem('user', JSON.stringify(res));
        this.router.navigate(['auth/profile'])
      },
      err => {
        this.fuseSplashScreen.hide();
        this.router.navigate(['/auth/login'])
        this.failureMsg = err.error.error.message;
        setInterval(() => {
          this.failureMsg = "";
        }, 5000)
      }
    )
  }
  /** 
   * Update the user Role
  */
  updateUserRole() {
    this.userService.roleUpdate({ userId:this.currentUser.user.id, token: this.currentUser.id, roleId: this.roleId }).subscribe(
      res => {
        console.log(res)
      },
      err => {
        console.log(err)

      }
    )


  }
  /***
   * Role Mapping
   */
  roleMapping() {
    this.userService.roleMapping({ principalType: "supervisor", principalId: this.currentUser.user.id, roleId: this.roleId }).subscribe(
      res => {
        console.log(res)
      },
      err => {
      }
    )
  }
}
