import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";

import { AppComponent } from "./components/app.component";
import { LiveStatusModule } from "../livestatus";
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
