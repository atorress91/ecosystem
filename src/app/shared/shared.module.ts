import { BootstrapModule } from './bootstrap.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IconsModule } from './feather-icons.module';
import { TruncateDecimalsPipe } from './truncate-decimals.pipe';

@NgModule({
  declarations: [TruncateDecimalsPipe],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    IconsModule,
    BootstrapModule,

  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    IconsModule,
    BootstrapModule,
    TruncateDecimalsPipe
  ],
  providers:[
    TruncateDecimalsPipe
  ]
})
export class SharedModule {}
