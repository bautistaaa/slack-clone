import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuardService } from './auth-guard.service';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ChannelComponent } from './channel/channel.component';

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        canActivate: [AuthGuardService],
        component: HomeComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'channel',
        component: ChannelComponent
    },
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
