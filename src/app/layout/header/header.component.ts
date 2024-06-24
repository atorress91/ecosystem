import {RightSidebarService} from 'src/app/core/service/rightsidebar-service/rightsidebar.service';
import {AuthService} from 'src/app/core/service/authentication-service/auth.service';
import {DOCUMENT} from '@angular/common';
import {
  Component,
  Inject,
  ElementRef,
  OnInit,
  Renderer2,
  AfterViewInit, OnDestroy,
} from '@angular/core';
import {Router} from '@angular/router';
import {ConfigService} from 'src/app/config/config.service';
import {LanguageService} from 'src/app/core/service/language-service/language.service';
import {map, Observable, Subscription} from 'rxjs';

import {UserAffiliate} from '@app/core/models/user-affiliate-model/user.affiliate.model';
import {ConfigureWalletService} from '@app/core/service/configure-wallet-service/configure-wallet.service';
import {CartService} from '@app/core/service/cart.service/cart.service';
import {TicketHubService} from '@app/core/service/ticket-service/ticket-hub.service';
import {TicketSummary} from '@app/core/models/ticket-model/ticket-summary.model';

const document: any = window.document;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, AfterViewInit, OnDestroy {
  public user: UserAffiliate = new UserAffiliate();
  private subscriptions: Subscription[] = [];
  public config: any = {};
  isNavbarCollapsed = true;
  flagvalue;
  countryName;
  langStoreValue: string;
  defaultFlag: string;
  isOpenSidebar: boolean;
  totalItem: number = 0;
  ticketSummaries$: Observable<TicketSummary[]>;
  public unreadCount$: Observable<number>;


  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    public elementRef: ElementRef,
    private rightSidebarService: RightSidebarService,
    private configService: ConfigService,
    private authService: AuthService,
    private router: Router,
    public languageService: LanguageService,
    private configureWalletService: ConfigureWalletService,
    private cartService: CartService,
    private ticketHubService: TicketHubService,
  ) {
    this.ticketHubService.connectionEstablished.subscribe((isConnected) => {
      if (isConnected) {
        this.ticketSummaries$ = this.ticketHubService.ticketSummaries.asObservable();
        this.unreadCount$ = this.ticketSummaries$.pipe(
          map(summaries => summaries.reduce((acc, summary) => acc + summary.unreadMessagesCount, 0))
        );
        this.onLoadTickets(this.authService.currentUserAffiliateValue.id);
      } else {
        console.error('Waiting for connection to be established...');
      }
    });
  }

  listLang = [
    {text: 'English', flag: 'assets/images/flags/us.jpg', lang: 'en'},
    {text: 'Spanish', flag: 'assets/images/flags/spain.jpg', lang: 'es'},
  ];

  ngOnInit() {
    this.user = this.authService.currentUserAffiliateValue;
    this.config = this.configService.configData;

    this.cartService.productList.subscribe((items: any) => {
      this.totalItem = items.reduce((total: number, item: any) => total + item.quantity, 0);
    });

    this.langStoreValue = localStorage.getItem('lang');
    const val = this.listLang.filter((x) => x.lang === this.langStoreValue);
    this.countryName = val.map((element) => element.text);
    if (val.length === 0) {
      if (this.flagvalue === undefined) {
        this.defaultFlag = 'assets/images/flags/us.jpg';
      }
    } else {
      this.flagvalue = val.map((element) => element.flag);
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  ngAfterViewInit() {
    // set theme on startup
    if (localStorage.getItem('theme')) {
      this.renderer.removeClass(this.document.body, this.config.layout.variant);
      this.renderer.addClass(this.document.body, localStorage.getItem('theme'));
    } else {
      this.renderer.addClass(this.document.body, this.config.layout.variant);
    }

    if (localStorage.getItem('menuOption')) {
      this.renderer.addClass(
        this.document.body,
        localStorage.getItem('menuOption')
      );
    } else {
      this.renderer.addClass(
        this.document.body,
        this.config.layout.sidebar.backgroundColor + '-sidebar'
      );
    }

    if (localStorage.getItem('sidebar_status')) {
      if (localStorage.getItem('sidebar_status') === 'close') {
        this.renderer.addClass(this.document.body, 'side-closed');
        this.renderer.addClass(this.document.body, 'submenu-closed');
      } else {
        this.renderer.removeClass(this.document.body, 'side-closed');
        this.renderer.removeClass(this.document.body, 'submenu-closed');
      }
    } else {
      if (this.config.layout.sidebar.collapsed === true) {
        this.renderer.addClass(this.document.body, 'side-closed');
        this.renderer.addClass(this.document.body, 'submenu-closed');
      }
    }
  }

  setLanguage(text: string, lang: string, flag: string) {
    this.countryName = text;
    this.flagvalue = flag;
    this.langStoreValue = lang;
    this.languageService.setLanguage(lang);
  }

  mobileMenuSidebarOpen(event: any, className: string) {
    if (window.innerWidth < 1025) {
      const hasClass = event.target.classList.contains(className);
      if (hasClass) {
        this.renderer.removeClass(this.document.body, className);
        this.renderer.addClass(this.document.body, 'sidebar-gone');
      } else {
        this.renderer.addClass(this.document.body, className);
        this.renderer.removeClass(this.document.body, 'sidebar-gone');
      }
    } else {
      const hasClass = this.document.body.classList.contains('side-closed');
      if (hasClass) {
        this.renderer.removeClass(this.document.body, 'side-closed');
        this.renderer.removeClass(this.document.body, 'submenu-closed');
      } else {
        this.renderer.addClass(this.document.body, 'side-closed');
        this.renderer.addClass(this.document.body, 'submenu-closed');
      }
    }
  }

  public toggleRightSidebar(): void {
    this.rightSidebarService.sidebarState.subscribe((isRunning) => {
      this.isOpenSidebar = isRunning;
    });

    this.rightSidebarService.setRightSidebar(
      (this.isOpenSidebar = !this.isOpenSidebar)
    );
  }

  logout() {
    this.authService.logoutUser().subscribe((res) => {
      if (!res.success) {
        this.router.navigate(['/signin']).then();
      }
    });
  }

  openConfigureWalletModal() {
    this.configureWalletService.openConfigureWalletModal();
  }

  onTicketClick(ticketId: number) {
    this.ticketHubService.connectionEstablished.subscribe({
      next: (e) => {
        this.ticketHubService.markTicketMessagesAsRead(ticketId)
          .then(() => {
            this.ticketHubService.setTicket(ticketId);
            this.router.navigate(['app/tickets/message']).then();
          })
          .catch(error => console.error('Error al marcar mensajes:', error));
      },error:()=>{

      }
    })
  }

  onLoadTickets(affiliateId: number) {
    this.ticketHubService.getTicketSummariesByAffiliateId(affiliateId)
      .catch(error => console.error('Error al cargar tickets:', error));
  }
}

