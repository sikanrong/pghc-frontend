import 'zone.js';
import 'reflect-metadata';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from "./modules/app/app.module.ts";

platformBrowserDynamic().bootstrapModule(AppModule);