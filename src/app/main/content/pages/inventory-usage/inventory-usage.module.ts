import { NgModule, Input } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule} from '@angular/forms'
import { CdkTableModule } from '@angular/cdk/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { MatDividerModule, MatRadioModule, MatTabsModule, MatStepperModule } from '@angular/material';
import {
  MatButtonModule, MatSnackBarModule, MatProgressSpinnerModule,
  MatCheckboxModule, MatSelectModule, MatNativeDateModule, MatDatepickerModule,
  MatFormFieldModule, MatIconModule, MatInputModule, MatMenuModule, MatRippleModule,
  MatSidenavModule, MatTableModule, MatToolbarModule, MatExpansionModule,
} from '@angular/material';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule } from '@fuse/components';
import { AuthGuard } from '../../services';

import { ModalModule } from "ngx-bootstrap";
import { InventoryUsageComponent } from './inventory-usage/inventory-usage.component';
import { inventoryService } from './inventory-usage.service';
const routes: Routes = [
  {
    path: 'inventory-usage',
    canActivate: [AuthGuard],
    component: InventoryUsageComponent,
  }
];

@NgModule({
  declarations: [
    InventoryUsageComponent
  ],
  imports: [
    FormsModule,ReactiveFormsModule,
    AccordionModule.forRoot(),
    RouterModule.forChild(routes),
    CdkTableModule,
    ModalModule.forRoot(),
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule, MatSelectModule,
    MatDividerModule, MatRadioModule, MatTabsModule, MatStepperModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatRippleModule,
    MatSidenavModule,
    MatTableModule,
    MatToolbarModule,
    FuseSharedModule,
    FuseConfirmDialogModule,
    MatPaginatorModule,
    MatSortModule,
    MatExpansionModule,
    MatSnackBarModule,
  ],
  providers: [
    inventoryService
  ],
  entryComponents: []
})
export class InventoryUsageModule {
}
