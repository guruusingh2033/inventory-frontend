import { Component, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { FusePerfectScrollbarDirective } from '@fuse/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

import { Clerk, Admin, Customer } from 'app/navigation/navigation';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { FuseSidebarComponent } from '@fuse/components/sidebar/sidebar.component';

@Component({
    selector     : 'fuse-navbar',
    templateUrl  : './navbar.component.html',
    styleUrls    : ['./navbar.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class FuseNavbarComponent implements OnInit, OnDestroy
{
    private fusePerfectScrollbar: FusePerfectScrollbarDirective;

    @ViewChild(FusePerfectScrollbarDirective) set directive(theDirective: FusePerfectScrollbarDirective)
    {
        if ( !theDirective )
        {
            return;
        }

        this.fusePerfectScrollbar = theDirective;

        this.navigationServiceWatcher =
            this.navigationService.onItemCollapseToggled.subscribe(() => {
                this.fusePerfectScrollbarUpdateTimeout = setTimeout(() => {
                    this.fusePerfectScrollbar.update();
                }, 310);
            });
    }

    @Input() layout;
    navigation: any;
    navigationServiceWatcher: Subscription;
    fusePerfectScrollbarUpdateTimeout;

    constructor(
        private sidebarService: FuseSidebarService,
        private navigationService: FuseNavigationService,
        private router: Router
    )
    {
        // Navigation data
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
        }
        // Default layout
        this.layout = 'vertical';
    }

    ngOnInit()
    {
        this.router.events.subscribe(
            (event) => {
                if ( event instanceof NavigationEnd )
                {
                    if ( this.sidebarService.getSidebar('navbar') )
                    {
                        this.sidebarService.getSidebar('navbar').close();
                    }
                }
            }
        );
    }

    ngOnDestroy()
    {
        if ( this.fusePerfectScrollbarUpdateTimeout )
        {
            clearTimeout(this.fusePerfectScrollbarUpdateTimeout);
        }

        if ( this.navigationServiceWatcher )
        {
            this.navigationServiceWatcher.unsubscribe();
        }
    }

    toggleSidebarOpened()
    {
        this.sidebarService.getSidebar('navbar').toggleOpen();
    }

    toggleSidebarFolded()
    {
        this.sidebarService.getSidebar('navbar').toggleFold();
    }
}
