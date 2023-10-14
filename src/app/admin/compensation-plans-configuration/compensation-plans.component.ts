import { Component, OnInit } from '@angular/core';
import { ConfigurationService } from '@app/core/service/configuration-service/configuration.service';
import { CompensationPlansConfiguration } from '@app/core/models/compensation-plans-configuration-model/compensation-plans-configuration.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-compensation-plans',
  templateUrl: './compensation-plans.component.html',
})
export class CompensationPlansComponent implements OnInit {
  compesationPlansForm!: FormGroup;
  submitted = false;
  compesationPlansConfiguration: CompensationPlansConfiguration =
    new CompensationPlansConfiguration();

  constructor(private configurationService: ConfigurationService, private formBuilder: FormBuilder, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.loadValidation();
    this.loadCompesationPlansConfiguration();
  }

  loadValidation() {
    this.compesationPlansForm = this.formBuilder.group({
      automatic_activation: [''],
      automatic_qualification: [''],
      automatic_incentive_calculation: [''],
      automatic_commission_calculation: ['']
    })
  }

  showSuccess(message) {
    this.toastr.success(message, 'Success!');
  }

  loadCompesationPlansConfiguration() {
    this.configurationService.getCompensationPlansConfiguration().subscribe((resp: CompensationPlansConfiguration) => {
      if (resp != null) {
        this.compesationPlansForm.setValue({
          automatic_activation: resp.automatic_activation,
          automatic_qualification: resp.automatic_qualification,
          automatic_incentive_calculation: resp.automatic_incentive_calculation,
          automatic_commission_calculation: resp.automatic_commission_calculation
        })
      }
    });
  }

  onSaveConfiguration() {
    this.submitted = true;
    if (this.compesationPlansForm.invalid) {
      return;
    }
    this.compesationPlansConfiguration.automatic_activation = this.compesationPlansForm.value.automatic_activation;
    this.compesationPlansConfiguration.automatic_qualification = this.compesationPlansForm.value.automatic_qualification;
    this.compesationPlansConfiguration.automatic_incentive_calculation = this.compesationPlansForm.value.automatic_incentive_calculation;
    this.compesationPlansConfiguration.automatic_commission_calculation = this.compesationPlansForm.value.automatic_commission_calculation;

    this.configurationService.createCompensationPlansConfiguration(this.compesationPlansConfiguration).subscribe((resp) => {
      if (resp.success) {
        this.showSuccess('The configuration was update successfully!');
        this.loadCompesationPlansConfiguration();
      }
    });
  }


}
