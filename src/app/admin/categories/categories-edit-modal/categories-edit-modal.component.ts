import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ProductCategory } from '@app/core/models/product-category-model/product-category.model';
import { ProductCategoryService } from '@app/core/service/product-category-service/product-category.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-categories-edit-modal',
  templateUrl: './categories-edit-modal.component.html',
})
export class CategoriesEditModalComponent implements OnInit {
  editCategorieForm!: FormGroup;
  categoriesList: ProductCategory[] = [];
  submitted = false;
  checkboxSmallBanner = false;
  checkboxBigBanner = false;
  selectedFile: File = null;
  category: ProductCategory = new ProductCategory();

  @ViewChild('categoriesEditModal') categoriesEditModal: NgbModal;
  @Output('loadCategoryList') loadCategoryList: EventEmitter<any> =
    new EventEmitter();

  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private productCategoryService: ProductCategoryService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.categorieValidation();
    this.categoryList();
  }

  get edit_categorie_controls(): { [key: string]: AbstractControl } {
    return this.editCategorieForm.controls;
  }

  editOpenModal(content, row) {
    this.category = row;
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'xl',
    });

    this.editCategorieForm.setValue({
      categorie: this.category.category,
      name: this.category.name,
      description: this.category.description,
      activate_big_banner: this.category.displayBigBanner,
      activate_small_banner: this.category.displaySmallBanner,
    });
  }

  categorieValidation() {
    this.editCategorieForm = this.formBuilder.group({
      categorie: [0],
      name: [''],
      description: [],
      activate_big_banner: [''],
      activate_small_banner: [''],
    });
  }


  closeModals() {
    this.modalService.dismissAll();
  }

  showSuccess(message) {
    this.toastr.success(message, 'Success!');
  }

  onFileSelected(event) {
    this.selectedFile = <File>event.target.files[0];
  }

  uploadFile() { }

  onChangeSmallBanner() {
    this.checkboxSmallBanner = !this.checkboxSmallBanner;
  }

  onChangeBigBanner() {
    this.checkboxBigBanner = !this.checkboxBigBanner;
  }

  onAddRowSave() {
    this.submitted = true;
    if (this.editCategorieForm.invalid) {
      return;
    }

    this.category.name = this.editCategorieForm.value.name;
    this.category.category = this.editCategorieForm.value.categorie;
    this.category.description = this.editCategorieForm.value.description;
    this.category.displayBigBanner = this.editCategorieForm.value.activate_big_banner;
    this.category.displaySmallBanner = this.editCategorieForm.value.activate_small_banner;

    this.productCategoryService.updateCategory(this.category).subscribe((resp) => {
      if (resp.success) {
        this.showSuccess('The category was update successfully!');
        this.closeModals();
        this.loadCategoryList.emit();
      }
    })
  }

  categoryList() {
    this.productCategoryService.getAll().subscribe((resp) => {
      this.categoriesList = resp;
    });
  }
}
