import { Component } from '@angular/core';
import { MyTreeNodeClient } from '@app/core/models/unilevel-tree-model/tree-node';
import { NgxSpinnerService } from 'ngx-spinner';

import 'perfect-scrollbar';
import { AuthService } from "@app/core/service/authentication-service/auth.service";
import { AffiliateService } from "@app/core/service/affiliate-service/affiliate.service";

@Component({
  selector: 'app-view-unilevel-tree',
  templateUrl: './view-unilevel-tree.component.html',
  styleUrls: ['./view-unilevel-tree.component.scss'],
})
export class ViewUnilevelTreeComponent {
  userId: number;
  btnBack: boolean = false;
  active;

  tree: MyTreeNodeClient = {
    id: 0,
    userName: '',
    image: '',
    children: [],
  };
  typeSelected: string;
  showDiv = false;

  constructor(
    private authService: AuthService,
    private spinnerService: NgxSpinnerService,
    private affiliateService: AffiliateService
  ) {
    this.typeSelected = 'cube-transition';
  }

  ngOnInit() {
    this.active = 1;
    this.userId = this.authService.currentUserAffiliateValue.id;

    if (this.userId) {
      this.onloadFamilyTree(this.userId);
      this.btnBack = false;
    }
  }

  protected onloadFamilyTree(id: number) {
    this.showDiv = false;
    this.spinnerService.show();
    this.btnBack = true;
    if (this.active === 1 ||this.active === 2 ) {
      this.affiliateService.getUniLevelTree(id).subscribe(
        (users: MyTreeNodeClient) => {
          if (users !== null) {
            this.tree = users;
            setTimeout(() => {
              this.spinnerService.hide();
              this.showDiv = true;
            }, 500);
          }
        },
        error => {
          this.spinnerService.hide();
        }
      );
    } else if (this.active === 3) {
      this.affiliateService.getBinaryTree(id).subscribe(
        (users: MyTreeNodeClient) => {
          if (users !== null) {
            this.tree = users;
            setTimeout(() => {
              this.spinnerService.hide();
              this.showDiv = true;
            }, 500);
          }
        },
        error => {
          this.spinnerService.hide();
        }
      );
    }
  }

  onTabChange(newActiveId: number) {
    this.active = newActiveId;
    this.onloadFamilyTree(this.userId);
    this.btnBack = false;
  }
}
