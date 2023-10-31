import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserAffiliate } from '@app/core/models/user-affiliate-model/user.affiliate.model';
import { AuthService } from '@app/core/service/authentication-service/auth.service';

@Component({
  selector: 'app-ticket-view',
  templateUrl: './ticket-view.component.html',
  styleUrls: ['./ticket-view.component.sass']
})
export class TicketViewComponent {
  ticketId: number;
  user: UserAffiliate;

  constructor(private route: ActivatedRoute, private authService: AuthService) { }

  ngOnInit(): void {
    this.ticketId = +this.route.snapshot.paramMap.get('id');
    this.user = this.authService.currentUserAffiliateValue;
    console.log(this.user);
  }
}
