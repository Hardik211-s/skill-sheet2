import { Routes } from '@angular/router';
import { DashboardComponent } from './shared/components/dashboard/dashboard.component';
import { LoginComponent } from './shared/components/login/login.component'; 
import { NavbarComponent } from './shared/common/navbar/navbar.component';
import { AddUserAdminComponent } from './shared/components/add-user-admin/add-user-admin.component';
import { ManageUserComponent } from './shared/components/manage-user/manage-user.component';
import { RoleGuard } from './service/role.guard';
import { DeniedAccessComponent } from './shared/components/denied-access/denied-access.component';
import { EditProfileComponent } from './shared/components/edit-profile/edit-profile.component';
import { AddSkillComponent } from './shared/components/add-skill/add-skill.component';
import { MySkillComponent } from './shared/components/my-skill/my-skill.component';
import { ShowProfileComponent } from './shared/components/show-profile/show-profile.component';
import { PersonalDetailComponent } from './shared/components/personal-detail/personal-detail.component';
import { FindUserComponent } from './shared/components/find-user/find-user.component';

export const routes: Routes = [ 
    
    {
        path:"login",
        component:LoginComponent
    },{
        path:"dashboard",
        component:DashboardComponent,
    }, {
        path:"navbar",
        component:NavbarComponent,

    },{
        path:"find",
        component:FindUserComponent,
        canActivate:[RoleGuard],
        data: { expectedRole: 'Admin' }
    },{
        path:"add",
        component:AddUserAdminComponent,
        canActivate:[RoleGuard],
        data: { expectedRole: 'Admin' }

    },{
        path:"manage",
        component:ManageUserComponent,
        canActivate:[RoleGuard],
        data: { expectedRole: 'Admin' },

    },{
        path:"personal",
        component:PersonalDetailComponent,
        canActivate:[RoleGuard],
        data: { expectedRole: 'User' },
    },{
        path:"showdetail",
        component:ShowProfileComponent,

    },{
        path:"access-denied",
        component:DeniedAccessComponent,
    },{
        path:"edit",
        component:EditProfileComponent,
        canActivate:[RoleGuard],
        data: { expectedRole: 'User' }

    },{
        path:"skill",
        component:AddSkillComponent,
        canActivate:[RoleGuard],
        data: { expectedRole: 'User' }

    }
    ,{
        path:"myskill",
        component:MySkillComponent,
        canActivate:[RoleGuard],
        data: { expectedRole: 'User' }

    }
];
