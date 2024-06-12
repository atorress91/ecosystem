import {Router, NavigationEnd} from '@angular/router';
import {DOCUMENT} from '@angular/common';
import {
  Component,
  Inject,
  ElementRef,
  OnInit,
  Renderer2,
  HostListener,
  OnDestroy,
} from '@angular/core';

import {ROUTES} from './sidebar-items';
import {AuthService} from 'src/app/core/service/authentication-service/auth.service';
import {Subject, takeUntil} from 'rxjs';
import {UserAffiliate} from '@app/core/models/user-affiliate-model/user.affiliate.model';
import {AffiliateService} from '@app/core/service/affiliate-service/affiliate.service';
import {GradingService} from '@app/core/service/grading-service/grading.service';
import {Grading} from '@app/core/models/grading-model/grading.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.sass'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  public user: UserAffiliate = new UserAffiliate();
  public grading: Grading = new Grading();
  private destroy$ = new Subject();
  public sidebarItems: any[];
  public innerHeight: any;
  public bodyTag: any;
  listMaxHeight: string;
  listMaxWidth: string;
  headerHeight = 60;
  routerObj = null;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    public elementRef: ElementRef,
    private authService: AuthService,
    private affiliateService: AffiliateService,
    private gradingService: GradingService,
    private router: Router
  ) {
    this.routerObj = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // close sidebar on mobile screen after menu select
        this.renderer.removeClass(this.document.body, 'overlay-open');
        this.sidebbarClose();
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  windowResizecall() {
    if (window.innerWidth < 1025) {
      this.renderer.removeClass(this.document.body, 'side-closed');
    }
    this.setMenuHeight();
    this.checkStatuForResize();
  }

  @HostListener('document:mousedown', ['$event'])
  onGlobalClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.renderer.removeClass(this.document.body, 'overlay-open');
      this.sidebbarClose();
    }
  }

  callToggleMenu(event: any, length: any) {
    if (length > 0) {
      const parentElement = event.target.closest('li');
      const activeClass = parentElement.classList.contains('active');

      if (activeClass) {
        this.renderer.removeClass(parentElement, 'active');
      } else {
        this.renderer.addClass(parentElement, 'active');
      }
    }
  }

  ngOnInit() {
    this.authService.currentUserAffiliate
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        if (user) {
          this.user = user;
          this.refreshUserInfoData(this.user.id);
        }
      });

    if (this.user) {
      this.sidebarItems = ROUTES.filter((sidebarItem) => sidebarItem);
    }

    this.initLeftSidebar();
    this.bodyTag = this.document.body;
  }

  ngOnDestroy() {
    this.routerObj.unsubscribe();
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  initLeftSidebar() {
    const _this = this;
    // Set menu height
    _this.setMenuHeight();
    _this.checkStatuForResize();
  }

  setMenuHeight() {
    this.innerHeight = window.innerHeight;
    const height = this.innerHeight - this.headerHeight;
    this.listMaxHeight = height + '';
    this.listMaxWidth = '500px';
  }

  checkStatuForResize() {
    if (window.innerWidth < 1025) {
      this.renderer.addClass(this.document.body, 'sidebar-gone');
    } else {
      this.renderer.removeClass(this.document.body, 'sidebar-gone');
    }
  }

  mouseHover() {
    const body = this.elementRef.nativeElement.closest('body');
    if (body.classList.contains('submenu-closed')) {
      this.renderer.addClass(this.document.body, 'side-closed-hover');
      this.renderer.removeClass(this.document.body, 'submenu-closed');
    }
  }

  mouseOut() {
    const body = this.elementRef.nativeElement.closest('body');
    if (body.classList.contains('side-closed-hover')) {
      this.renderer.removeClass(this.document.body, 'side-closed-hover');
      this.renderer.addClass(this.document.body, 'submenu-closed');
    }
  }

  sidebbarClose() {
    if (window.innerWidth < 1025) {
      this.renderer.addClass(this.document.body, 'sidebar-gone');
    }
  }

  refreshUserInfoData(id: number) {
    this.affiliateService.getAffiliateById(id).subscribe({
      next: (value) => {
        this.user = value.data;
        this.getGradingInfo(this.user.external_grading_before_id);
      },
      error: () => {

      },
    })
  }

  getGradingInfo(id: number) {
    this.gradingService.getGradingById(id).subscribe((response) => {
      if (response.success) {
        this.grading = response.data;
      }
    });
  }
}
