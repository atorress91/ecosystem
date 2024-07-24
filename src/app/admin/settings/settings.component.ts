import { ConfigurationService } from '@app/core/service/configuration-service/configuration.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GeneralConfiguration } from '@app/core/models/general-configuration/general-configuration.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
})
export class SettingsComponent implements OnInit {
  generalConfigurationForm: FormGroup
  active = 1;

  constructor(
    private fb: FormBuilder,
    private configurationService: ConfigurationService,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.generalConfigurationForm = this.fb.group({
      paymentModelCutoffDate: ['', Validators.required],
      isUnderMaintenance: [false]
    })

    this.loadGeneralConfiguration();
  }

  loadGeneralConfiguration() {
    this.configurationService.getGeneralConfiguration().subscribe({
      next: (value) => {
        if (value.success) {
          const config: GeneralConfiguration = value.data;
          this.generalConfigurationForm.patchValue({
            paymentModelCutoffDate: this.formatDateForInput(new Date(config.paymentModelCutoffDate)),
            isUnderMaintenance: config.isUnderMaintenance
          });
        } else {
          console.error('Error al cargar la configuración general')
        }

      }, error: (err) => {
        console.error('Error', err)
      },
    })
  }

  saveGeneralConfiguration() {
    if (this.generalConfigurationForm.valid) {
      const formValue = this.generalConfigurationForm.value;
      const generalConfiguration = new GeneralConfiguration();
      generalConfiguration.paymentModelCutoffDate = new Date(formValue.paymentModelCutoffDate);
      generalConfiguration.isUnderMaintenance = formValue.isUnderMaintenance;

      this.configurationService.setGeneralConfiguration(generalConfiguration).subscribe({
        next: (value) => {
          if (value.success) {
            this.toastrService.success('Configuración se actualizó correctamente.')
          } else {
            this.toastrService.error('No se pudo actualizar la configuración.')
          }
        }, error: (err) => {
          console.error('Error', err)
        },
      })
    }
  }

  private formatDateForInput(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}
