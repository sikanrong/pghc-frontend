import { RouterModule } from "@angular/router";
import {LiveStatusSingleNodeComponent} from "./components/livestatus.singlenode.component";
import {LiveStatusComponent} from "./components/livestatus.component";
import {LiveStatusClusterComponent} from "./components/livestatus.cluster.component";

export default RouterModule.forChild([
    {
        path: 'livestatus',
        component: LiveStatusComponent,
        children: [
            {
                path: 'singlenode',
                component: LiveStatusSingleNodeComponent,
                outlet: 'ls'
            },

            {
                path: 'cluster',
                component: LiveStatusClusterComponent,
                outlet: 'ls'
            },

            { path: '', pathMatch: 'full', redirectTo: '/livestatus/(ls:singlenode)' },
        ]
    }
]);