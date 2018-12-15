import {NgModule} from "@angular/core";
import {LiveStatusComponent} from "./components/livestatus.component";
import {LiveStatusSingleNodeComponent} from "./components/livestatus.singlenode.component";
import {LiveStatusClusterComponent} from "./components/livestatus.cluster.component";
import {RouterModule} from "@angular/router";
import LiveStatusRoutes from "./routes";
import {CommonModule} from "@angular/common";
import {StoreModule} from "@ngrx/store";
import {reducers} from "./state/livestatus.reducers";
import {LiveStatusOrchestrator} from "./services/livestatus.orchestrator";
import {MatButtonModule} from '@angular/material/button';
import {LiveStatusD3} from "./services/livestatus.d3";

@NgModule({
    imports: [
        RouterModule,
        StoreModule.forRoot(reducers),
        CommonModule,
        LiveStatusRoutes,
        MatButtonModule
    ],
    declarations: [ LiveStatusComponent, LiveStatusSingleNodeComponent, LiveStatusClusterComponent ],
    exports: [ RouterModule ],
    providers: [ LiveStatusOrchestrator, LiveStatusD3 ]

})
export class LiveStatusModule {}
export {LiveStatusComponent, LiveStatusSingleNodeComponent, LiveStatusClusterComponent};