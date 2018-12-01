import {Component, OnDestroy, OnInit} from "@angular/core";
import * as $package from "../../../../../package.json";
import {select, Store} from "@ngrx/store";
import {LiveStatusState, LiveStatusStats, initializeState} from "../state/livestatus.state";
import ActionWithPayload from "../../../ActionWithPayload";
import {ChainLink, ClusterConfig} from "../state/livestatus.models";
import {GetClusterConf, NewChainLink, NewVerification} from "../state/livestatus.actions";
import {Observable, Subscription} from "rxjs";
import {map} from "rxjs/operators";
import {LiveStatusMessage, LiveStatusMessageType, LiveStatusOrchestrator} from "../services/livestatus.orchestrator";
import {CreatorMessage} from "../services/livestatus.creator.worker";
import {VerifierMessage} from "../services/livestatus.verifier.worker";

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
    private requestStats: LiveStatusStats = initializeState().stats;

    constructor(private store: Store<LiveStatusState>, private orchestrator: LiveStatusOrchestrator) {}

    public ngOnDestroy() {
        this.orchestrator.cleanup();
        this.LiveStatusSubscription.unsubscribe();
        this.ClusterConfSubscription.unsubscribe();
    }

    public pauseStressTest() {
        this.orchestrator.cleanup();
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
            switch (lsm.parentType) {
                case LiveStatusMessageType.creator:
                    const newChainLink: ActionWithPayload<ChainLink> = new NewChainLink((lsm as CreatorMessage).payload);
                    this.store.dispatch(newChainLink);
                    break;
                case LiveStatusMessageType.verifier:
                    const newVerification: ActionWithPayload<VerifierMessage> = new NewVerification(lsm as VerifierMessage);
                    this.store.dispatch(newVerification);
                    break;
            }
        });

        this.LiveStatsState$.subscribe((newStats) => {
            Object.assign(this.requestStats, newStats);
        });
    }
}