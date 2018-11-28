import { RouterModule } from "@angular/router";
import {LiveStatusComponent} from "../livestatus";


export default RouterModule.forRoot([
    { path: '', pathMatch: 'full', redirectTo: 'livestatus' }
]);
