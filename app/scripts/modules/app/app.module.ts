//Well here it is, my first typescript file... :/

import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";

import { AppComponent } from "./app.component";
import {LiveStatusModule} from "../livestatus/index";
import AppRoutes from "./routes";

@NgModule({
    imports: [
        BrowserModule,
        RouterModule,
        LiveStatusModule,
        AppRoutes
    ],

    declarations: [ AppComponent ],
    bootstrap: [ AppComponent ]
})
export class AppModule {}