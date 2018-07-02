import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MatIconModule } from '@angular/material';

import { FuseSharedModule } from '@fuse/shared.module';

import { FusePhoneConfirmComponent } from './phone-confirm.component';
import { MatButtonModule, MatCheckboxModule, MatFormFieldModule,     MatInputModule } from '@angular/material';

const routes = [
    {
        path     : 'phone-confirm',
        component: FusePhoneConfirmComponent
    }
];

@NgModule({
    declarations: [
        FusePhoneConfirmComponent
    ],
    imports     : [
      MatButtonModule,
      MatCheckboxModule,
      MatFormFieldModule,
      MatInputModule,  MatIconModule,
    
        RouterModule.forChild(routes),

        MatIconModule,

        FuseSharedModule
    ]
})
export class PhoneConfirmModule
{
}
