import {Component, OnInit} from "@angular/core";
import * as $package from "../../../../../package.json";
import {Store, select} from "@ngrx/store";
import {LiveStatusState, initializeState} from "../state/livestatus.state";
import ActionWithPayload from "../../../ActionWithPayload";
import {ClusterConfig} from "../state/livestatus.models";
import {GetClusterConf} from "../state/livestatus.actions";
import {Observable, Subscription} from "rxjs";
import {map} from "rxjs/operators";

@Component({
    selector: "livestatus",
    templateUrl: "/scripts/modules/livestatus/templates/livestatus.template.html"
})
export class LiveStatusComponent implements OnInit {
    public clusterConf: object = {};

    private ClusterConfState$: Observable<LiveStatusState>;
    private ClusterConfSubscription: Subscription;

    constructor(private store: Store<LiveStatusState>) { }

    public async ngOnInit() {
        this.ClusterConfState$ = this.store.pipe(select('cluster'));
        // Fetch the cluster config from the API
        const apiConf = await fetch(`${$package.config.api_uri}/cluster/config`, {method: "GET"})
            .then((resp) => {
                return resp.json();
            });

        const bkn = (apiConf.num_total_pg_nodes - apiConf.num_bdr_groups);
        const getClusterConf: ActionWithPayload<ClusterConfig> = new GetClusterConf({
            backendNodes: bkn,
            pgSlaveNodes: bkn,
            pgMasterNodes: apiConf.num_bdr_groups
        });

        this.ClusterConfSubscription = this.ClusterConfState$.pipe(map((newClusterConf) => {
            if (newClusterConf) {
                Object.assign(this.clusterConf, newClusterConf);
            }
        })).subscribe();

        this.store.dispatch(getClusterConf);
    }
}