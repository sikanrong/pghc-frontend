import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";

import { AppComponent } from "./components/app.component";
import { LiveStatusModule } from "../livestatus";
import AppRoutes from "./routes";

import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

import '../../../styles.sass';

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule,
        LiveStatusModule,
        AppRoutes
    ],

    declarations: [ AppComponent ],
    bootstrap: [ AppComponent ]
})

export class AppModule {}
