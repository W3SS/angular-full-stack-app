import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {  FormsModule }  from "@angular/forms";
import { HttpModule }    from '@angular/http';
import {MessageModule}   from './messages/message.module';

import { AppComponent }  from "./app.component";
import {AuthenticationComponent} from './users/authentication.component';
import {HeaderComponent} from './header.component';
import {routing}         from './app.routing';
import {AuthService}     from './users/auth.service';
import {ErrorComponent}  from './errors/error.component';
import {ErrorService}    from './errors/error.service';

@NgModule({
    declarations: [
        AppComponent, 
        AuthenticationComponent,
        HeaderComponent, 
        ErrorComponent
    ],
    imports: [
        BrowserModule, 
        routing,
        HttpModule,
        MessageModule
    ],
    providers: [AuthService, ErrorService],
    bootstrap: [AppComponent]
})
export class AppModule {

}