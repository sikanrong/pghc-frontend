import {Component, OnDestroy, OnInit} from "@angular/core";
import * as $package from "../../../../../package.json";
import {Action, select, Store} from "@ngrx/store";
import {LiveStatusState, LiveStatusStats, initializeState, UserInputs} from "../state/livestatus.state";
import ActionWithPayload from "../../../ActionWithPayload";
import {ChainLink, ClusterConfig} from "../state/livestatus.models";
import {
    GetClusterConf,
    NewChainLink,
    NewVerification,
    PauseSimulation,
    UnPauseSimulation
} from "../state/livestatus.actions";
import {Observable, Subscription} from "rxjs";
import {map, distinctUntilChanged} from "rxjs/operators";
import {LiveStatusMessage, LiveStatusMessageType, LiveStatusOrchestrator} from "../services/livestatus.orchestrator";
import {CreatorMessage} from "../services/livestatus.creator.worker";
import {VerifierMessage} from "../services/livestatus.verifier.worker";

@Component({
    selector: "livestatus",
    templateUrl: "/scripts/modules/livestatus/templates/livestatus.template.html"
})
export class LiveStatusComponent implements OnInit, OnDestroy {
    public clusterConf: object = {};

    private ClusterConfState$: Observable<ClusterConfig>;
    private ClusterConfSubscription: Subscription;

    private LiveStatusUpdates$: Observable<LiveStatusMessage>;
    private LiveStatusSubscription: Subscription;

    private LiveStatsState$: Observable<LiveStatusStats>;
    private LiveStatsSubscription: Subscription;

    private UserInputState$: Observable<UserInputs>;
    private UserInputSubscription: Subscription;

    private initState: LiveStatusState = initializeState();
    private requestStats: LiveStatusStats = this.initState.stats;
    private userInputs: UserInputs = this.initState.userInputs;

    constructor(private store: Store<LiveStatusState>, private orchestrator: LiveStatusOrchestrator) {}

    public ngOnDestroy() {
        this.orchestrator.cleanup();
        this.LiveStatusSubscription.unsubscribe();
        this.ClusterConfSubscription.unsubscribe();
        this.LiveStatsSubscription.unsubscribe();
        this.UserInputSubscription.unsubscribe();
    }

    public requestPause() {
        if (this.userInputs.isPaused) {
            const uiUnPause: Action = new UnPauseSimulation();
            this.store.dispatch(uiUnPause);
        } else {
            const uiPause: Action = new PauseSimulation();
            this.store.dispatch(uiPause);
        }
    }

    public async ngOnInit() {
        this.ClusterConfState$ = this.store.pipe(select('cluster')).pipe(distinctUntilChanged());
        this.LiveStatsState$ = this.store.pipe(select('stats')).pipe(distinctUntilChanged());
        this.UserInputState$ = this.store.pipe(select('userInputs')).pipe(distinctUntilChanged());
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

        this.LiveStatsSubscription = this.LiveStatsState$.pipe(map((newStats) => {
            Object.assign(this.requestStats, newStats);
        })).subscribe();

        this.UserInputSubscription = this.UserInputState$.pipe(map((newInputs) => {
            Object.assign(this.userInputs, newInputs);

            if (newInputs.isPaused) {
                this.orchestrator.cleanup();
                this.LiveStatusSubscription.unsubscribe();
            } else {
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
            }
        })).subscribe();
    }
}