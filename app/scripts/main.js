require("@babel/register")({
    extensions: [".js", ".ts"]
});

import 'zone.js';
import 'reflect-metadata';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from "./modules/app";

platformBrowserDynamic().bootstrapModule(AppModule);