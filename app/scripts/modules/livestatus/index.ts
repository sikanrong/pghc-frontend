import {NgModule} from "@angular/core";
import {LiveStatusComponent} from "./components/livestatus.component";
import {LiveStatusSingleNodeComponent} from "./components/livestatus.singlenode.component";
import {LiveStatusClusterComponent} from "./components/livestatus.cluster.component";
import {RouterModule} from "@angular/router";
import LiveStatusRoutes from "./routes";
import {CommonModule} from "@angular/common";
import {StoreModule} from "@ngrx/store";
import {reducers} from "./state/livestatus.reducers";

@NgModule({
    imports: [
        RouterModule,
        StoreModule.forRoot(reducers),
        CommonModule,
        LiveStatusRoutes
    ],
    declarations: [ LiveStatusComponent, LiveStatusSingleNodeComponent, LiveStatusClusterComponent ],
    exports: [ RouterModule ]
})
export class LiveStatusModule {}
export {LiveStatusComponent, LiveStatusSingleNodeComponent, LiveStatusClusterComponent};