import {Component, OnDestroy, OnInit} from "@angular/core";
import * as $package from "../../../../../package.json";
import {Store, select} from "@ngrx/store";
import {LiveStatusState, initializeState, LiveStatusStats} from "../state/livestatus.state";
import ActionWithPayload from "../../../ActionWithPayload";
import {ChainLink, ClusterConfig} from "../state/livestatus.models";
import {GetClusterConf, NewChainLink} from "../state/livestatus.actions";
import {Observable, Subscription} from "rxjs";
import {map} from "rxjs/operators";
import {LiveStatusMessage, LiveStatusOrchestrator} from "../services/livestatus.orchestrator";

@Component({
    selector: "livestatus",
    templateUrl: "/scripts/modules/livestatus/templates/livestatus.template.html"
})
export class LiveStatusComponent implements OnInit, OnDestroy {
    public clusterConf: object = {};

    private ClusterConfState$: Observable<LiveStatusState>;
    private LiveStatsState$: Observable<LiveStatusState>;
    private ClusterConfSubscription: Subscription;

    private LiveStatusUpdates$: Observable<LiveStatusMessage>;
    private LiveStatusSubscription: Subscription;
    private requestStats: LiveStatusStats = {totalLinksCreated: 0};

    constructor(private store: Store<LiveStatusState>, private orchestrator: LiveStatusOrchestrator) {}

    public ngOnDestroy() {
        this.orchestrator.cleanup();
        this.LiveStatusSubscription.unsubscribe();
        this.ClusterConfSubscription.unsubscribe();
    }

    public async ngOnInit() {
        this.ClusterConfState$ = this.store.pipe(select('cluster'));
        this.LiveStatsState$ = this.store.pipe(select('stats'));
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
            Object.assign(this.clusterConf, newClusterConf);
        })).subscribe();

        this.store.dispatch(getClusterConf);

        this.LiveStatusUpdates$ = this.orchestrator.spawnAllWorkers();
        this.LiveStatusSubscription = this.LiveStatusUpdates$.subscribe((lsm: LiveStatusMessage) => {
            const newChainLink: ActionWithPayload<ChainLink> = new NewChainLink(lsm.payload);
            this.store.dispatch(newChainLink);
        });

        this.LiveStatsState$.subscribe((newStats) => {
            Object.assign(this.requestStats, newStats);
        });
    }
}