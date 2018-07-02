import { Component, ElementRef, HostBinding, Inject, OnDestroy, Renderer2, ViewEncapsulation } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Platform } from '@angular/cdk/platform';
import { Subscription } from 'rxjs';

import { FuseConfigService } from '@fuse/services/config.service';

import { Clerk, Admin, Customer } from 'app/navigation/navigation';

@Component({
    selector     : 'fuse-main',
    templateUrl  : './main.component.html',
    styleUrls    : ['./main.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class FuseMainComponent implements OnDestroy
{
    onConfigChanged: Subscription;
    fuseSettings: any;
    navigation: any;

    @HostBinding('attr.fuse-layout-mode') layoutMode;

    constructor(
        private _renderer: Renderer2,
        private _elementRef: ElementRef,
        private fuseConfig: FuseConfigService,
        private platform: Platform,
        @Inject(DOCUMENT) private document: any
    )
    {
        this.onConfigChanged =
            this.fuseConfig.onConfigChanged
                .subscribe(
                    (newSettings) => {
                        this.fuseSettings = newSettings;
                        this.layoutMode = this.fuseSettings.layout.mode;
                    }
                );

        if ( this.platform.ANDROID || this.platform.IOS )
        {
            this.document.body.className += ' is-mobile';
        }

        var login = localStorage.getItem('isLogin');
        var currentUser = JSON.parse(localStorage.getItem('user'))
       
        if (login && currentUser && currentUser.user.role) {
        if (currentUser.user.role.name.toLowerCase() == 'admin') {
        this.navigation = Admin;
       
        }
        else if (currentUser.user.role.name.toLowerCase() == 'clerk' || currentUser.user.role.name.toLowerCase() == 'supervisor') {
        this.navigation = Clerk;
       
        }
        else if (currentUser.user.role.name.toLowerCase() == 'customers') {
        this.navigation = Customer;
       
        }
        else
        this.navigation = Customer;
       
        }
        else{
        this.navigation = Customer;
        }   
       }

    ngOnDestroy()
    {
        this.onConfigChanged.unsubscribe();
    }

    addClass(className: string)
    {
        this._renderer.addClass(this._elementRef.nativeElement, className);
    }

    removeClass(className: string)
    {
        this._renderer.removeClass(this._elementRef.nativeElement, className);
    }
}
