import { LogoService } from '@app/core/service/logo-service/logo.service';
import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.sass'],
  encapsulation: ViewEncapsulation.None
})
export class LogoComponent implements OnInit, OnDestroy {
  logoSrc: string;
  @Input() logoClass: string = '';
  private subscription: Subscription;

  constructor(private logoService: LogoService) {
    this.subscription = this.logoService.isDarkTheme$.subscribe(isDark => {
      this.logoSrc = this.logoService.getLogoSrc();
    });
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
