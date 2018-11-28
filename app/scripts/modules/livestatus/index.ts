import {NgModule} from "@angular/core";
import {LiveStatusComponent} from "./components/livestatus.component";
import {LiveStatusSingleNodeComponent} from "./components/livestatus.singlenode.component";
import {LiveStatusClusterComponent} from "./components/livestatus.cluster.component";
import {RouterModule} from "@angular/router";
import LiveStatusRoutes from "./routes";
import {StoreModule} from "@ngrx/store";
import {ClusterReducer} from "./store/livestatus.reducers";

@NgModule({
    imports: [
        RouterModule,
        LiveStatusRoutes,
        StoreModule.forRoot({cluster: ClusterReducer})
    ],
    declarations: [ LiveStatusComponent, LiveStatusSingleNodeComponent, LiveStatusClusterComponent ],
    exports: [ RouterModule ]
})
export class LiveStatusModule {}
export {LiveStatusComponent, LiveStatusSingleNodeComponent, LiveStatusClusterComponent};