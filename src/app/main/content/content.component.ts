import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations/index';
import { FuseConfigService } from '@fuse/services/config.service';

@Component({
  selector: 'fuse-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
  animations: fuseAnimations
})
export class FuseContentComponent implements OnDestroy, OnInit {
  onConfigChanged: Subscription;
  fuseSettings: any;

  @HostBinding('@routerTransitionUp') routeAnimationUp = false;
  @HostBinding('@routerTransitionDown') routeAnimationDown = false;
  @HostBinding('@routerTransitionRight') routeAnimationRight = false;
  @HostBinding('@routerTransitionLeft') routeAnimationLeft = false;
  @HostBinding('@routerTransitionFade') routeAnimationFade = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fuseConfig: FuseConfigService
  ) {
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.activatedRoute)
    ).subscribe((event) => {
      switch (this.fuseSettings.routerAnimation) {
        case 'fadeIn':
          this.routeAnimationFade = !this.routeAnimationFade;
          break;
        case 'slideUp':
          this.routeAnimationUp = !this.routeAnimationUp;
          break;
        case 'slideDown':
          this.routeAnimationDown = !this.routeAnimationDown;
          break;
        case 'slideRight':
          this.routeAnimationRight = !this.routeAnimationRight;
          break;
        case 'slideLeft':
          this.routeAnimationLeft = !this.routeAnimationLeft;
          break;
      }
    });

    this.onConfigChanged =
      this.fuseConfig.onConfigChanged
        .subscribe(
          (newSettings) => {
            this.fuseSettings = newSettings;
          }
        );
  }
  ngOnInit() {
    // var loggedIn = localStorage.getItem('isLogin')
    // if (loggedIn == "true") {
    //   this.router.navigate(['/profile'])
    // }
    // else {
    //   this.router.navigate(['/auth/login'])

    // }
  }
  ngOnDestroy() {
    this.onConfigChanged.unsubscribe();
  }
}
