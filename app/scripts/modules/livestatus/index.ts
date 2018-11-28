import {NgModule} from "@angular/core";
import {LiveStatusComponent} from "./components/livestatus.component";


@NgModule({
    declarations: [ LiveStatusComponent ],
    exports: [ LiveStatusComponent ]
})
export class LiveStatusModule {}
export {LiveStatusComponent};