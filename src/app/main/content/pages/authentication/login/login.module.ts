import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MatButtonModule, MatCheckboxModule,MatIconModule, MatFormFieldModule, MatInputModule,MatSelectModule } from '@angular/material';

import { FuseSharedModule } from '@fuse/shared.module';

import { FuseLoginComponent } from './login.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

const routes = [
    {
        path     : 'login',
        component: FuseLoginComponent
    }
];

@NgModule({
    declarations: [
        FuseLoginComponent
    ],
    imports     : [
        RouterModule.forChild(routes),

        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        FuseSharedModule,
        MatIconModule,
        NgxMatSelectSearchModule
    ]
})
export class LoginModule
{
}
