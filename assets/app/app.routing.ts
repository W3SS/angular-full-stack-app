import { Routes, RouterModule } from "@angular/router";

import { MessagesComponent } from "./messages/messages.component";
import { AuthenticationComponent } from "./users/authentication.component";

const APP_ROUTES: Routes = [
    { path: '', redirectTo: '/messages', pathMatch: 'full' },
    { path: 'messages', component: MessagesComponent },
    { 
        path: 'auth', 
        component: AuthenticationComponent, 
        loadChildren: './users/auth.module#AuthModule'
    }
];

export const routing = RouterModule.forRoot(APP_ROUTES);