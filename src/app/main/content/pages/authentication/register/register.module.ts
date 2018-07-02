import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule,MatProgressSpinnerModule, MatCheckboxModule, MatFormFieldModule,   MatIconModule,  MatInputModule,MatSelectModule } from '@angular/material';

import { FuseSharedModule } from '@fuse/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FuseRegisterComponent } from './register.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import {MatTooltipModule} from '@angular/material/tooltip';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

const routes = [
  {
    path: 'register',
    component: FuseRegisterComponent
  }
];

@NgModule({
  declarations: [
    FuseRegisterComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,  MatIconModule,MatTooltipModule,

    MatSelectModule, FormsModule, ReactiveFormsModule,

    FuseSharedModule,
    MatProgressSpinnerModule,
    //Telephone input country code
    BsDropdownModule.forRoot(),
    NgxIntlTelInputModule,
    NgxMatSelectSearchModule


  ]
})
export class RegisterModule {
}
