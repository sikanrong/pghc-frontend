//Well here it is, my first typescript file... :/

import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
// @ts-ignore
import { AppComponent } from "./app.component.ts";

@NgModule({
    imports: [
        BrowserModule
    ],

    declarations: [ AppComponent ],
    bootstrap: [ AppComponent ]
})
export class AppModule {}