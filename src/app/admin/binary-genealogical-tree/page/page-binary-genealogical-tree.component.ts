import { Component, OnInit } from '@angular/core';
import { MyTreeNode } from '@app/core/models/unilevel-tree-model/tree-node';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AffiliateService } from '@app/core/service/affiliate-service/affiliate.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-page-binary-genealogical-tree',
  templateUrl: './page-binary-genealogical-tree.component.html',
  styleUrls: ['./page-binary-genealogical-tree.component.scss'],
})
export class PageBinaryGenealogicalTreeComponent implements OnInit {

  userId: number;
  tree: MyTreeNode = {
    id: 0,
    user_name: '',
    image: '',
    children: [
    ],
  };
  typeSelected: string;
  showDiv = false;

  constructor(
    private router: Router,
    private affiliateService: AffiliateService,
    private spinnerService: NgxSpinnerService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.typeSelected = 'cube-transition';
  }


  ngOnInit() {
    this.userId = this.activatedRoute.snapshot.params.id;
    this.onloadFamilyTree(this.userId);
    }


  public onloadFamilyTree(id: number){
    this.showDiv = false;
    this.spinnerService.show();

    this.tree = {
      id: 0,
      user_name: '',
      image: '',
      children: [
      ],
    };
    this.affiliateService.getBinaryTree(id).subscribe((users: MyTreeNode) => {
      if (users !== null) {
        this.tree = users;
        setTimeout(() => {
          this.spinnerService.hide();
          this.showDiv = true;
        }, 500);   
      }
    });
  }
}
