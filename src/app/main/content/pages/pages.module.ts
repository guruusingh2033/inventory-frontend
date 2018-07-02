import { NgModule } from '@angular/core';

import { LoginModule } from './authentication/login/login.module';
import { RegisterModule } from './authentication/register/register.module';
import { ForgotPasswordModule } from './authentication/forgot-password/forgot-password.module';
import { ResetPasswordModule } from './authentication/reset-password/reset-password.module';
import { MailConfirmModule } from './authentication/mail-confirm/mail-confirm.module';
import { PhoneConfirmModule } from './authentication/phone-confirm/phone-confirm.module';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
 import { RoleModule } from './roles/role.module';
import {InventoryModule} from './inventory/inventory.module';
import {InventoryUsageModule} from './inventory-usage/inventory-usage.module'

@NgModule({
    imports: [
        // Auth
        LoginModule,
        RegisterModule,
        ForgotPasswordModule,
        ResetPasswordModule,
        MailConfirmModule,
        PhoneConfirmModule,
        RoleModule,
        NgxIntlTelInputModule,
        InventoryModule,
         InventoryUsageModule
    ]
})
export class FusePagesModule
{

}
