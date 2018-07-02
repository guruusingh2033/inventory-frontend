import { Component, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { FuseConfigService } from '@fuse/services/config.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

import { Clerk, Admin, Customer } from 'app/navigation/navigation';
import { UserService } from '../content/services';
@Component({
  selector: 'fuse-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})

export class FuseToolbarComponent implements OnInit {
  userStatusOptions: any[];
  languages: any;
  selectedLanguage: any;
  showLoadingBar: boolean;
  horizontalNav: boolean;
  noNav: boolean;
  navigation: any;
  currentUser: any;
  constructor(
    private router: Router,
    private fuseConfig: FuseConfigService,
    private sidebarService: FuseSidebarService,
    private translate: TranslateService,
    private userService: UserService


  ) {
    this.userStatusOptions = [
      {
        'title': 'Online',
        'icon': 'icon-checkbox-marked-circle',
        'color': '#4CAF50'
      },
      {
        'title': 'Away',
        'icon': 'icon-clock',
        'color': '#FFC107'
      },
      {
        'title': 'Do not Disturb',
        'icon': 'icon-minus-circle',
        'color': '#F44336'
      },
      {
        'title': 'Invisible',
        'icon': 'icon-checkbox-blank-circle-outline',
        'color': '#BDBDBD'
      },
      {
        'title': 'Offline',
        'icon': 'icon-checkbox-blank-circle-outline',
        'color': '#616161'
      }
    ];

    this.languages = [
      {
        'id': 'en',
        'title': 'English',
        'flag': 'us'
      },
      {
        'id': 'tr',
        'title': 'Turkish',
        'flag': 'tr'
      }
    ];

    this.selectedLanguage = this.languages[0];

    router.events.subscribe(
      (event) => {
        if (event instanceof NavigationStart) {
          this.showLoadingBar = true;
        }
        if (event instanceof NavigationEnd) {
          this.showLoadingBar = false;
        }
      });

    this.fuseConfig.onConfigChanged.subscribe((settings) => {
      this.horizontalNav = settings.layout.navigation === 'top';
      this.noNav = settings.layout.navigation === 'none';
    });

    var login = localStorage.getItem('isLogin');
    var currentUser = JSON.parse(localStorage.getItem('user'))
   
    if (login && currentUser && currentUser.user.role) {
    if (currentUser.user.role.name == 'admin') {
    this.navigation = Admin;
   
    }
    else if (currentUser.user.role.name == 'clerk' || currentUser.user.role.name == 'supervisor') {
    this.navigation = Clerk;
   
    }
    else if (currentUser.user.role.name == 'customers') {
    this.navigation = Customer;
   
    }
    else
    this.navigation = Customer;
   
    }
    else{
    this.navigation = Customer;
    }  }

  ngOnInit() {

    //Get the current User
    var temp = JSON.parse(localStorage.getItem('user'));
    if (temp)
      this.currentUser = temp.user;
  }

  toggleSidebarOpened(key) {
    this.sidebarService.getSidebar(key).toggleOpen();
  }

  search(value) {
    // Do your search here...
    console.log(value);
  }

  setLanguage(lang) {
    // Set the selected language for toolbar
    this.selectedLanguage = lang;

    // Use the selected language for translations
    this.translate.use(lang.id);
  }
  logout() {
    this.userService.logout();
  }
}
